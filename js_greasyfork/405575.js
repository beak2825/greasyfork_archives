// ==UserScript==
// @name         theme search
// @version      0.1
// @description  add a button to search in the theme settings
// @author       Rutger Valk-van de Klundert / Ruben @ Lightspeed HQ
// @run-at       document-end
// @match        https://*.webshopapp.com/admin/*

// @match        https://*.shoplightspeed.com/admin/theme/preview/*
// @namespace https://greasyfork.org/users/428438
// @downloadURL https://update.greasyfork.org/scripts/405575/theme%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/405575/theme%20search.meta.js
// ==/UserScript==
var $jscomp = $jscomp||{};
$jscomp.scope = {};
$jscomp.createTemplateTagFirstArg = function(r){
    return r.raw=r
};
$jscomp.createTemplateTagFirstArgWithRaw = function(r,u){
    r.raw=u;return r
};
var themeSearchFn = function(){
    !function(q){
        var h = Function("return this")()||eval("this");
        "function" == typeof define&&define.amd ? define(["jsonq"],function(e){return h.jsonQ=q()}) : "object"==typeof module&&module.exports ? module.exports=q() : h.jsonQ=q()
    }(function(q){
        function h(a){
            var b=a.keyAdded||[],
            c=a.json,
            d=a.path,
            f=a.newJson;
            return e.each(c,function(a,e){
                var g=d ? JSON.parse(JSON.stringify(d)):[];g.push(a);"object"==p(c)&&(-1==b.indexOf(a)&&(b.push(a),f.jsonQ_path[a]=[]),f.jsonQ_path[a].push({path:g}));var k=p(e);"object"!=k&&"array"!=k||h({json:e,newJson:f,path:g,keyAdded:b})
            }),
            f
        }
        var e=function(a){
            return new e.fn.init(a)
        },
        v=JSON.stringify,
        r=JSON.parse;
        e.settings={
            sort:{order:"ASC",logic:function(a){return a},caseIgnore:!0,allLevel:!0}
        };
        var u={
            topLevel:function(a){
                var b=this.jsonQ_current,
                c=this.cloneObj(e()),
                d=c.jsonQ_current=[],
                f="",
                g=a.key;
                a=a.method;
                for(var k=0,m=b.length;k<m;k++){
                    var n=!1,l=b[k].path.concat([]);
                    if("parent"==a)0===l.length?n=!0:l.pop();
                    else{var p=l.lastIndexOf(g);-1==p?n=!0:l=l.slice(0,p+1)}
                    f==(f=JSON.stringify(l))||n||d.push({path:l})
                }
                return c.length=d.length,c.selector.push({method:a,key:g}),c
            },
            qualTrv:function(a){
                var b=this.jsonQ_current,
                c=this.cloneObj(e()),
                d=c.jsonQ_current=[],
                f=a.key,
                g=e.clone(this.jsonQ_path[f])||[],
                k=a.qualifier,
                m=p(k);
                a=a.method;
                for(var n="find"==a,l=0,y=b.length;l<y;l++){
                    var h=b[l].path,
                    r=[],
                    v=!1;
                    if(!n){
                        if(0===h.length)continue;(r=h.concat([])).pop()
                    }
                    for(var w=0;w<g.length;w++){
                        var t=g[w].path;if(n){var q=t;q=(new RegExp("^"+h.join("~~"),"i")).test(q.join("~~"))}else q=t.concat([]),q.pop(),q=r.join()==q.join();if(q)u.qTest.call(this,m,k,t,d)&&(g.splice(w,1),w--),v=!0;else if(v)break
                    }
                }
                return"string"==m&&(c=this.filter.call(c,k)),
                c.length=c.jsonQ_current.length,
                c.selector.push({method:a,key:f,qualifier:k}),
                c
            },
            qTest:function(a,b,c,d){
                a="function"==a?b.call(this.pathValue(c)):"object"!=a||e.checkKeyValue(this.pathValue(c),b);return a&&d.push({path:c}),a
            }
        },
        t={
            baseConv:function(a,b,c){
                if("string"==a){if(c.caseIgnore)return b.toLowerCase()}else{if("array"==a)return b.join();if("object"==a)return v(e.order(b))}return b
            },
            sortAry:function(a,b,c){
                return a.sort(function(a,c){var d=b(a),e=b(c);return d<e?-1:e<d?1:0}),"desc"==c.order.toLowerCase()&&a.reverse(),a
            }
        };
        e.fn=e.prototype={
            init:function(a){
                var b;
                if(!a)return this;
                if("string"==(b=p(a)))try{a=JSON.parse(a)}catch(c){throw"Not a valid json string.";}else if("object"!=b&&"array"!=b)throw"Not a valid json object.";
                return this.jsonQ_root=a,this.jsonQ_path={},this.jsonQ_current=[{path:[]}],h({json:a,newJson:this,refresh:!0}),this.length=this.jsonQ_current.length,this.selector=[],this
            },
            pathValue:function(a){
                return e.pathValue(this.jsonQ_root,a)
            },
            setPathValue:function(a,b){
                return e.setPathValue(this.jsonQ_root,a,b),this
            },
            clone:function(){
                return r(v(this.jsonQ_current))
            },
            cloneObj:function(a){
                return a=a||{},e.each(this,function(b,c){a[b]=c}),a.selector=e.merge([],a.selector),a
            },
            value:function(a,b){
                var c=this.jsonQ_current;if(b=!1!==b,a){for(var d=p(a),f=0,g=c.length;f<g;f++){var k=c[f].path;if("function"==d){var m=this.pathValue(k);m=b?e.clone(a(m)):a(m)}else m=b?e.clone(a):a;this.setPathValue(k,m)}return this}var n=[];
                return this.each(function(a,b,c){n.push(c)}),n
            },
            append:function(a,b){
                return this.appendAt("last",a,b)
            },
            prepend:function(a,b){
                return this.appendAt("first",a,b)
            },
            appendAt:function(a,b,c){
                var d=this.jsonQ_current;if(isNaN(a)&&"first"!=a&&"last"!=a)throw a+"is not a valid index.";for(var f=0,g=d.length;f<g;f++){var k=d[f].path.concat([]),m=k.pop();k=this.pathValue(k);var n=p(k[m]),l=k[m].length,h=0>a||"first"==a?0:l<a||"last"==a?l:a;"array"==n?(b=c?e.clone(b):b,k[m].splice(h,0,b)):"string"==n&&(n=k[m],k[m]=n.substring(0,h)+b+n.substring(h,l))}
                return this
            },
            filter:function(a){
                var b=this.jsonQ_current,c=this.cloneObj(e()),d=c.jsonQ_current=[],f=p(a);if(!a)return this;for(var g=0,k=b.length;g<k;g++)u.qTest.call(this,f,a,b[g].path,d);"string"==f&&(d=(d=/(nth|eq)\((.+)\)/.exec(a))?e.nthElm(b,d[2],!0):e.nthElm(b,a,!0),c.jsonQ_current=d);
                return c.length=d.length,c.selector.push({method:"filter",qualifier:a}),c
            },
            find:function(a,b){
                return u.qualTrv.call(this,{method:"find",key:a,qualifier:b})
            },
            sibling:function(a,b){
                return u.qualTrv.call(this,{method:"sibling",key:a,qualifier:b})
            },
            parent:function(){
                return u.topLevel.call(this,{method:"parent"})
            },
            closest:function(a){
                return u.topLevel.call(this,{method:"closest",key:a})
            },
            path:function(){
                return this.jsonQ_current[0].path
            },
            firstElm:function(){
                return this.pathValue(this.jsonQ_current[0].path)
            },
            lastElm:function(){
                return this.pathValue(this.jsonQ_current[this.length-1].path)
            },
            nthElm:function(a,b){
                return e.nthElm(this.value(),a,b)
            },
            index:function(a,b){
                return e.index(this.value(),a,b)
            },
            createXML:function(){
                return e.createXML(this.value())
            },
            sort:function(a,b){
                b=e.merge({},e.settings.sort,b);var c,d=this.find(a),f=d.clone(),g=[],k=[],m=p(d.pathValue(f[0].path)),n=function(a){for(;0!==a.length;){var b=a.pop();if(!isNaN(b)&&(b=d.pathValue(a),"array"==p(b)))return b}return null};var l=0;for(c=f.length;l<c;l++)g.push({pathHolder:f[l].path.concat([]),current:f[l].path.concat([])});for(c=function(a){return g.splice(a,1),--a};0!==g.length;)for(0,l=0;l<g.length;l++){f=g[l].current;var h=g[l].pathHolder,q=n(f),r=f.join();if(0===f.length||-1!=k.indexOf(r))l=c(l);else{var v=h.slice(f.length+1,h.length);t.sortAry(q,function(a){a=e.pathValue(a,v);return a=t.baseConv(m,a,b),b.logic(a)},b);b.allLevel?(h[f.length]=0,k.push(r)):l=c(l)}}
                return e(d.jsonQ_root).find(a)
            },
            each:function(a){
                for(var b=this.jsonQ_current,c=0,d=b.length;c<d;c++)a(c,b[c].path,this.pathValue(b[c].path));
                return this
            },
            unique:function(){
                return e.unique(this.value())
            },
            refresh:function(){
                for(var a=this.selector,b=e(this.jsonQ_root),c=0,d=a.length;c<d;c++){var f=a[c],g=[];f.key&&g.push(f.key);f.qualifier&&g.push(f.qualifier);b=b[f.method].apply(b,g)}
                return this.cloneObj.call(b,this),this
            },
            prettify:function(a){
                return e.prettify(this.value(),a)
            }
        };
        e.each=function(a,b){
            for(var c in a)a.hasOwnProperty(c)&&b(c,a[c])
        };
        var p=e.objType=(x={"[object Array]":"array","[object Object]":"object","[object String]":"string","[object Number]":"number","[object Boolean]":"boolean","[object Null]":"null","[object Function]":"function"},
        function(a){
            a=Object.prototype.toString.call(a);return x[a]
        }),x;
        return e.merge=function(){
            var a=arguments,b=p(a[0]),c=1,d=a.length,f=!1,g=a[0];if(0!==d&&("boolean"!=b||1!=d)){"boolean"==b&&(g=a[1],c=2,f=a[0]);for(b=function(a,b){var c=p(b),d=p(g[a]);!f||"array"!=c&&"object"!=c?g[a]=b:(g[a]=c!=d||"array"!=d&&"object"!=d?"array"==c?[]:{}:g[a],e.merge(f,g[a],b))};c<d;c++)e.each(a[c],b);return g}
        },
        e.merge(e,{
            sort:function(a,b){
                if(b=e.merge({},e.settings.sort,b),"array"==p(a))return t.sortAry(a,function(a){var c=p(a);return a=t.baseConv(c,a,b),b.logic(a)},b);throw"Only array is allowed to sort";
            },
            order:function(a){
                if("object"!=typeof a)return a;var b=function(a){return isNaN(a)||(a=parseInt(a)),a},c=function(a){var d=p(a),e=Object.keys(a);"object"==d&&e.sort(function(a,c){var d=b(a),e=b(c);return d<e?-1:e<d?1:0});for(var k=0,m=e.length;k<m;k++){var n=e[k],l=a[n],h=p(l);"object"!=h&&"array"!=h||c(l);"object"==d&&(delete a[n],a[n]=l)}};
                return c(a),a
            },
            clone:function(a){
                var b=p(a);
                return"object"==b||"array"==b?r(v(a)):a
            },
            index:function(a,b,c){
                var d=p(b),f=a.length,g="object"==d||"array"==d||"function"==d;if("function"==d&&(c=!0),g&&!c)var k=v(e.order(b));for(var m=0;m<f;m++){var n=a[m];if(g){var l=p(n);if(l==d||c)if(c){if("function"==d)var h=b.call(n);else if("object"==d&&"object"==l)h=e.checkKeyValue(n,b);else if("array"==l)if("array"==d){l=0;for(var q=b.length;l<q&&(h=-1!=e.index(n,b[l]));l++);}else h=-1!=e.index(n,b);if(h)return m}else if(v(e.order(n))==k)return m}else if(b==n)return m}return-1
            },
            contains:function(a,b,c){
                return-1!=e.index(a,b,c)
            },
            checkKeyValue:function(a,b){
                for(var c in b)if(b.hasOwnProperty(c)&&!e.identical(b[c],a[c]))return!1;return!0
            },
            nthElm:function(a,b,c){
                if(a[b])var d=a[b];else if("last"==b)d=a[a.length-1];else if("first"==b)d=a[0];else if("random"==b)d=a[Math.floor(Math.random()*a.length)];else if("even"==b)d=e.nthElm(a,"2n");else if("odd"==b)d=e.nthElm(a,"2n+1");else try{var f=[],g=a.length;if(!b.match(/^[0-9n*+-\/]+$/))throw"";b=b.replace(/([0-9])n/g,function(a,b){return b?b+"*n":a});for(var k=0;k<g;k++){var m=eval(b);if(g-1<m)break;f.push(a[m])}d=f}catch(n){d=a}return d=d||a,"array"!=p(d)&&c?[d]:d
            },
            prettify:function(a,b){
                if("object"!=typeof a)throw"Only valid json object is allowed.";return b?JSON.stringify(a,null,"\t").replace(/\n/g,"</br>").replace(/\t/g,"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"):JSON.stringify(a,null,3)
            },
            identical:function(a,b){
                function c(a){return"object"!=typeof a||null===a?a:Object.keys(a).sort().map(function(b){return{key:b,value:c(a[b])}})}return JSON.stringify(c(a))===JSON.stringify(c(b))
            },
            union:function(){
                for(var a=arguments,b=[],c=a.length,d=0;d<c;d++)for(var f=a[d].length,g=0;g<f;g++){var k=a[d][g];-1==e.index(b,k)&&b.push(k)}return b
            },
            intersection:function(){
                var a,b=arguments,c=[],d=b.length;if(1==d)c=b[0];else for(var f=0,g=b[0].length;f<g;f++){for(var k=b[0][f],m=a=1;m<d;m++)if(-1==e.index(b[m],k)){a=0;break}1==a&&c.push(k)}return c
            },
            shuffle:function(a){
                for(var b=1,c=a.length;b<c;b++){var d=Math.floor(Math.random()*(b+1)),e=a[b];a[b]=a[d];a[d]=e}return a
            },
            suffle:function(a){
                console.error("This method is deprecated. It was a miss spell of shuffle. Use jsonQ.shuffle instead.");e.shuffle(a)
            },
            unique:function(a){
                for(var b=a.length,c=[],d=0;d<b;d++)-1==e.index(c,a[d])&&c.push(a[d]);return c
            },
            pathValue:function(a,b){
                var c=0,d=b.length;if(null===a)return null;for(;c<d;){if(null===a[b[c]])return;a=a[b[c]];c+=1}return a
            },
            setPathValue:function(a,b,c){
                var d=0,e=a,g=b.length;if(null===a)return null;for(;d<g;)"object"!=typeof e[b[d]]&&(e[b[d]]="number"==p(b[d+1])?[]:{}),d==b.length-1&&(e[b[d]]=c),e=e[b[d]],d+=1;return a
            },
            createXML:function(a){
                var b=function(a,d){var c=0===(d=d||[]).length,g=p(a);return c&&d.push('<?xml version="1.0" encoding="ISO-8859-1"?><jsonXML>'),e.each(a,function(a,c){var e="array"==g?"arrayItem":a,f=p(c);d.push("<"+e+' type="'+f+'">');"object"==f||"array"==f?b(c,d):d.push("<![CDATA["+c+"]]\x3e");d.push("</"+e+">")}),c?(d.push("</jsonXML>"),d.join("")):d};return b(a)
            },
            append:function(a,b,c){
                return e.appendAt(a,"last",b,c)
            },
            prepend:function(a,b,c){
                return e.appendAt(a,"first",b,c)
            },
            appendAt:function(a,b,c,d){
                if(!isNaN(b)||"first"==b||"last"==b){var f=p(a),g=a.length;b=0>b||"first"==b?0:g<b||"last"==b?g:b;return"array"==f?(c=d?e.clone(c):c,a.splice(b,0,c)):"string"==f&&(a=a.substring(0,b)+c+a.substring(b,g)),a}throw b+"is not a valid index.";
            }
        }),
        e.fn.init.prototype=e.fn,e
    });
    0<document.querySelectorAll("#themeSearch").length&&document.querySelectorAll("#themeSearch").forEach(function(q){
        q.remove()
    });
    var r = document.getElementById('searchbar').value,
    u,
    t=new XMLHttpRequest;
    r&&0<r.length&&t.open("GET",location.origin+"/admin/theme/preview/settings.json",!1);
    t.onload=function(){
        if(200<=t.status&&400>t.status){
            console.log(JSON.parse(t.responseText).theme_settings);
            u=jsonQ(JSON.parse(t.responseText).theme_settings);
            var q=u.find("settings").jsonQ_current.map(function(h){
                return[h.path.slice(0,-2).join("/")+"/"+h.path.slice(0,-1).reduce(function(e,h){
                    return e[h]
                },u.jsonQ_root).key,h.path.reduce(function(e,h){
                    return e[h]
                },u.jsonQ_root).map(function(e,h){
                    return e.title.toLowerCase()
                }),
                h.path.reduce(function(e,h){
                    return e[h]
                },u.jsonQ_root).map(function(e,h){
                    return e.key
                })]
            }).filter(function(h){
                return 0<=h[1].findIndex(function(e){
                    return e.includes(r.toLowerCase())
                })
            });
            console.log(q);
            q='<div class="modal bg-visible dialog-visible" id="themeSearch"><div class="dialog small"><header><h2>Search results for "'+r+'":</h2><a class="close" href="#" onclick="document.body.removeChild(themeSearch)"></a></header><div id="modal-content"><div class="body" style="overflow-y: scroll;">'+q.map(function(h){return'<a href="#" onclick="Turbolinks.visit(\'/admin/theme/preview/'+h[0]+"', { action: 'replace' })\">/"+h[0]+"</a>"}).filter(function(h){return h}).join("<br>")+'</div><div class="buttons"><a class="btn close" href="#" title="search" onclick="themeSearchFn()">Search again</a><a class="btn close" href="#" title="close" onclick="document.body.removeChild(themeSearch)">Close</a></div></div></div></div>';
            document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeend",q)
        } else alert("Theme settings could not be retrieved!")
    };
    t.send()
};
//themeSearchFn();
function search_(){
    let search = document.createElement('input');
    search.type = ('text'),
    search.placeholder = ('theme search'),
    search.id = ('searchbar');
    document.querySelectorAll('h1.ItemsCenter')[0].appendChild(search);
    let butt = document.createElement('button');
    butt.type = 'button',
    butt.setAttribute('onclick','themeSearchFn()'),
    butt.innerHTML = 'search';
    document.querySelectorAll('h1.ItemsCenter')[0].appendChild(butt);
};
//search_();
document.addEventListener("load", search_);  //calls function when loaded