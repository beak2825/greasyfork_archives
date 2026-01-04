// ==UserScript==
// @name           sketchfab2obj
// @description    Save Sketchfab models as obj
// @author         <anonimus>
//
//Version Number
// @version        1.59
//
// Urls process this user script on
// @include        /^https?://(www\.)?sketchfab\.com/models/.*/embed.*$/
// @run-at         document-start
// @grant none
// @namespace https://greasyfork.org/users/161262
// @downloadURL https://update.greasyfork.org/scripts/35820/sketchfab2obj.user.js
// @updateURL https://update.greasyfork.org/scripts/35820/sketchfab2obj.meta.js
// ==/UserScript==

// source: http://stackoverflow.com/a/8485137
function safeName(s) {
    return s.replace(/[^a-zA-Z0-9]/gi, '_').toLowerCase();
}

function patchStr(target, search, replacement) {
    return target.split(search).join(replacement);
};

function unfreeze(obj) {
    var copy = {};
    for(var i in obj) {
       copy[i] = obj[i];
    }
    return copy;
}

// source: http://stackoverflow.com/questions/10596417/is-there-a-way-to-get-element-by-xpath-in-javascript
function getElementByXpath(path) {
    return document.evaluate(path, document, null, 9, null).singleNodeValue;
}

////////////////////// OBJ STUFF /////////////////////////////////////////////////////////////////////////
var models = [];
window._OSL_models = models;
var baseModelName = "unknown";
function InfoForGeometry(geom) {
    //console.log(["InfoForGeometry",geom]);
    var attributes = geom.attributes;
    if (!attributes)
        throw "No attributes for geometry";
    var vertices = attributes.Vertex;
    if (!vertices)
        throw "No vertices for geometry";
    var normals = attributes.Normal;
    var texCoords = attributes.TexCoord0;
    var info = {
        'vertices' : vertices._elements,
        'normals' : normals ? normals._elements : [],
        'texCoords' : texCoords ? texCoords._elements : [],
        'primitives' : [],
        'name' : geom.name
    };
    for (i = 0; i < geom.primitives.length; ++i) {
        var primitive = geom.primitives[i];
        info.primitives.push({
            'mode' : primitive.mode,
            'indices' : primitive.indices._elements
        });
    }
    return info;
}

var verticesExported = 0;
var nl = '\n';
function OBJforGeometry(geom) {
    var obj = '';
    var info = InfoForGeometry(geom);
    obj += 'mtllib ' + MTLFilenameForGeometry(geom) + nl;
    obj += 'o ' + geom.name + nl;
    for (i = 0; i < info.vertices.length; i += 3) {
        obj += 'v ';
        for (j = 0; j < 3; ++j) {
            obj += info.vertices[i + j] + ' ';
        }
        obj += nl;
    }
    for (i = 0; i < info.normals.length; i += 3) {
        obj += 'vn ';
        for (j = 0; j < 3; ++j) {
            obj += info.normals[i + j] + ' ';
        }
        obj += nl;
    }
    for (i = 0; i < info.texCoords.length; i += 2) {
     	obj += 'vt ';
        for (j = 0; j < 2; ++j) {
            obj += info.texCoords[i + j] + ' ';
        }
        obj += nl;  
    }
    obj += 'usemtl ' + MTLNameForGeometry(geom) + nl;
    obj += 's on' + nl;
    var exist = {
        normals: info.normals.length != 0,
        texCoords: info.texCoords.length != 0,
    };
    for (i = 0; i < info.primitives.length; ++i) {
        var primitive = info.primitives[i];
        if (primitive.mode == 4 || primitive.mode == 5) {
            var isTriangleStrip = (primitive.mode == 5);
            for (j = 0; j + 2 < primitive.indices.length; !isTriangleStrip ? j += 3 : ++j) {
                obj += 'f ';
                var isOddFace = j % 2 == 1;
                var order = [ 0, 1, 2];
                if (isTriangleStrip && isOddFace) 
                    order = [ 0, 2, 1];
                for (k = 0; k < 3; ++k) {
                    var faceNum = primitive.indices[j + order[k]] + 1 + verticesExported;
                    obj += faceNum;
                    if (exist.normals && !exist.texCoords) {
                         obj += '//' + faceNum;
                    }
                    else {
                        if (exist.texCoords) {
                            obj += '/' + faceNum;
                        }
                        if (exist.normals) {
                            obj += '/' + faceNum;
                        }
                    }
                    obj += ' ';
                }
                obj += nl;
            }
        }
        else {
            // http://stackoverflow.com/questions/14503600/what-are-webgls-draw-primitives
            console.log(["OBJforGeometry: unknown Primitive mode",primitive]);
            throw 'OBJforGeometry: Primitive mode not implemented';
        }
    }
    verticesExported += info.vertices.length / 3.0;
    return obj;
}

var textureMTLMap = {
	DiffusePBR: "map_Kd",
	DiffuseColor: "map_Kd",
	SpecularPBR: "map_Ks",
	SpecularColor: "map_Ks",
	GlossinessPBR: "map_Pm",
 	NormalMap : "map_bump",
 	EmitColor : "map_Ke",
 	AlphaMask : "map_d",
 	Opacity : "map_o"
};

// source: http://stackoverflow.com/a/3820412
function baseName(str)
{
   var base = new String(str).substring(str.lastIndexOf('/') + 1); 
    if(base.lastIndexOf(".") != -1)       
        base = base.substring(0, base.lastIndexOf("."));
   return base;
}

function ext(str) {
    return str.split('.').pop();
}

function textureInfoForGeometry(geom) {
    //console.log(["textureInfoForGeometry",geom]);
    var textureMap = [];
    if (stateset = geom.stateset) {
        if (textures = stateset.textureAttributeMapList) {
            textures.forEach(function(texture) {
            	//console.log(["textureInfoForGeometry texture",texture]);
                if (Texture = texture.Texture) {
                    if (object = Texture._object) {
                        if (texture = object._texture) {
                            if (imageProxy = texture._imageProxy) {
                            	console.log(["textureInfoForGeometry texture",imageProxy]);
                                var textureURL = imageProxy.attributes.images[0].url;
                                var textureSize = imageProxy.attributes.images[0].size;
                                for(ti=1;ti<imageProxy.attributes.images.length;ti++){
                                	if(imageProxy.attributes.images[ti].size > textureSize){
                                		textureSize = imageProxy.attributes.images[ti].size;
                                		textureURL = imageProxy.attributes.images[ti].url;
                                	}
                                }
                                var mtlmap = textureMTLMap[object._channelName];
                                if(!mtlmap){
                                	mtlmap = object._channelName;
                                }
                                var texture = {
                                    url: textureURL,
                                    type: mtlmap,
                                    ext: ext(textureURL)
                                };
                                texture.filename = textureFilename(geom, texture);
                                textureMap.push(texture);
                            }   
                        }
                    }
                }
            });
        }
    }
    console.log(["textureInfoForGeometry textureMap",textureMap]);
    return textureMap;
}

function textureFilename(geom, texture) {
    return baseName(texture.url) + '.' + texture.ext;
}

function MTLFilenameForGeometry(geom) {
 	return baseModelName + '.mtl';   
}

function MTLNameForGeometry(geom) {
 	return geom.name;
}

function MTLforGeometry(geom) {
    var mtl = '';
    mtl += 'newmtl ' + MTLNameForGeometry(geom) + nl;
    geom.textures.forEach(function(texture) {
    	mtl += texture.type + ' ' + texture.filename + nl;
    });
    return mtl;
}

// source: http://thiscouldbebetter.wordpress.com/2012/12/18/loading-editing-and-saving-a-text-file-in-html5-using-javascrip/
function downloadString(filename, ext, str) {
    function destroyClickedElement(event)
    {
        document.body.removeChild(event.target);
    }
    var textFileAsBlob = new Blob([str], {type:'text/plain'});
    var fileNameToSaveAs = filename + '.' + ext;
    
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null)
    {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    }
    else
    {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }
    downloadLink.click();
}

var imagesDownloaded = {};
// source: http://muaz-khan.blogspot.com/2012/10/save-files-on-disk-using-javascript-or.html
function downloadFileAtURL(fileURL, fileName) {
    if (!imagesDownloaded[fileURL]) {
        imagesDownloaded[fileURL] = true;
	    var hyperlink = document.createElement('a');
	    hyperlink.href = fileURL;
	    hyperlink.target = '_blank';
	    hyperlink.download = fileName || fileURL;
	
	    (document.body || document.documentElement).appendChild(hyperlink);
	    hyperlink.onclick = function() {
	       (document.body || document.documentElement).removeChild(hyperlink);
	    };
	
	    var mouseEvent = new MouseEvent('click', {
	        view: window,
	        bubbles: true,
	        cancelable: true
	    });
	
	    hyperlink.dispatchEvent(mouseEvent);
    }
}

function downloadModels() {
    if (models.length == 0) {
    	alert("Script failed... something changed on Sketchfab!");
        return;
    }
    var combinedOBJ = '';
    var combinedMTL = '';
    models.forEach(function(model) {
    	console.log(["downloadModels",model]);
	try{
        	combinedOBJ += model.obj + nl;
	}catch(e){
		console.log(["downloadModels: obj generation failed, skipping model",e]);
		continue;
	}
        try{
	    combinedMTL += model.mtl + nl;
	}catch(e){
		console.log(["downloadModels: mtl generation failed",e]);
	}
	try{
        	model.textures.forEach(function(texture) {
        		console.log(["downloadModels downloadFileAtURL",texture]);
        		downloadFileAtURL(texture.url, texture.filename);
       		});
	}catch(e){
		console.log(["downloadModels: texture downloading failed",e]);
	}
    });
    try{
    	downloadString(baseModelName, 'obj', combinedOBJ);
    	downloadString(baseModelName, 'mtl', combinedMTL);
    }catch(e){console.log(["downloadModels: downloadString failed",e]);}
}

///////////////////////// HELPERS /////////////////////////////////////////////////////////////////////////
function overrideDrawImplementation() {
	try{
	    console.log("OGL Injection: patching OSG");
	    var geometry = window.OSG.Geometry;
	    var newPrototype = unfreeze(geometry.prototype);
	    geometry.prototype = newPrototype;
	    newPrototype.originalDrawImplementation = newPrototype.drawImplementation;
	    newPrototype.drawImplementation = function(a) {
	    	console.log("OGL Injection: invoking drawImplementation");
	        this.originalDrawImplementation(a);
	        if (!this.computedOBJ) {
	            console.log("OGL Injection: saving model");
	            this.computedOBJ = true;
	            this.name = baseModelName + '-' + models.length;
	            this.__defineGetter__("textures", function() {
	                return this._textures ? this._textures : this._textures = textureInfoForGeometry(this);
	            });
	            models.push({
	                name: this.name,
	                geom: this,
	                get obj() {
	                    return OBJforGeometry(this.geom);
	                },
	                get mtl() {
	                    return MTLforGeometry(this.geom);
	                },
	                get textures() {
	                    return this.geom.textures;
	                }
	            });
	        }
	    };
	    console.log("OGL Injection: OSG patched OK!");
	    return true;
	}catch(e){
		console.log("OGL Injection: patching failed "+e);
		return false;
	}
}

var drawOverrided = false;
window.stealOSG = function(k){
	//console.log("OGL Injection: osg intercept");
	if(drawOverrided == false && k.osg){
		window.OSG = k.osg;
		if(overrideDrawImplementation()){
			drawOverrided = true;
		}
	};
};

console.log("OGL Injection: initializing events");
document.addEventListener('DOMContentLoaded', function(e) {
	console.log("OGL Injection: DOMContentLoaded event");
	baseModelName = safeName(document.title.replace(' - Sketchfab', ''));
	// source: http://stackoverflow.com/questions/3219758/detect-changes-in-the-dom
	var observeDOM = (function(){
	    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
	        eventListenerSupported = window.addEventListener;
	
	    return function(obj, callback){
	        if( MutationObserver ){
	            // define a new observer
	            var obs = new MutationObserver(function(mutations, observer){
	                if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
	                    callback();
	            });
	            // have the observer observe foo for changes in children
	            obs.observe( obj, { childList:true, subtree:true });
	        }
	        else if( eventListenerSupported ){
	            obj.addEventListener('DOMNodeInserted', callback, false);
	            obj.addEventListener('DOMNodeRemoved', callback, false);
	        }
	    }
	})();

	var addedDownloadButton = false;
	var downloadButtonParentXPath = "//div[@class='titlebar']";
	observeDOM(document.body, function(){ 
	    if (!addedDownloadButton) {
	        if (downloadButtonParent = getElementByXpath(downloadButtonParentXPath))
	        {
			//addOSGIntercept();
	        	setTimeout(function () {
	        		addDownloadButton(downloadButtonParent);
	        	}, 2000);
			addedDownloadButton = true;
	        }
	    }
	});
}, true);

window.addEventListener('beforescriptexecute', function(e) {
	var src = e.target.src;
	if((""+src).length == 0){
		return;
	}
	console.log("OGL Injection: beforescriptexecute event: "+src);
	if (src.indexOf("web/dist/viewer") >= 0) {
		e.preventDefault();
		e.stopPropagation();
		var xhrObj = new XMLHttpRequest();
		// open and send a synchronous request
		xhrObj.open('GET', src, false);
		xhrObj.send('');
		console.log("OGL Injection: legacy viewer loaded");
		var viewertext = xhrObj.responseText;
		// patching code for n r s a h p u
		viewertext = patchStr(viewertext, "n.osg,", "n.osg,zzz=window.stealOSG(n),");
		viewertext = patchStr(viewertext, "r.osg,", "r.osg,zzz=window.stealOSG(r),");
		viewertext = patchStr(viewertext, "s.osg,", "s.osg,zzz=window.stealOSG(s),");
		viewertext = patchStr(viewertext, "a.osg,", "a.osg,zzz=window.stealOSG(a),");
		viewertext = patchStr(viewertext, "h.osg,", "h.osg,zzz=window.stealOSG(h),");
		viewertext = patchStr(viewertext, "p.osg,", "p.osg,zzz=window.stealOSG(p),");
		viewertext = patchStr(viewertext, "u.osg,", "u.osg,zzz=window.stealOSG(u),");
		console.log("OGL Injection: legacy viewer patched");
		var se = document.createElement('script');
		se.type = "text/javascript";
		se.text = viewertext;
		document.getElementsByTagName('head')[0].appendChild(se);
	};
}, true);
console.log("OGL Injection: events initialized");

function addDownloadButton(downloadButtonParent) {
    var downloadButton = document.createElement("a");
    downloadButton.setAttribute("class", "control");
    downloadButton.innerHTML = "<pre style='color:red;'>OBJ-DOWNLOAD</pre>";
    downloadButton.addEventListener("click", downloadModels , false);
    downloadButtonParent.appendChild(downloadButton);
}
