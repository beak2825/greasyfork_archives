// ==UserScript==
// @name        Chefkoch PDF export
// @description Erzeugt aus einem Rezept ein PDF Dokument zum Herunterladen oder Drucken
// @namespace   cuzi
// @oujs:author cuzi
// @version     2
// @include     http://www.chefkoch.de/rezepte/*
// @grant       GM_xmlhttpRequest
// @require     https://greasyfork.org/scripts/15924-jspdf/code/jsPDF.js
// @downloadURL https://update.greasyfork.org/scripts/15925/Chefkoch%20PDF%20export.user.js
// @updateURL https://update.greasyfork.org/scripts/15925/Chefkoch%20PDF%20export.meta.js
// ==/UserScript==

function convertImgToDataURL(url, callback){
  GM_xmlhttpRequest({
    method: "GET",
    responseType : "blob",
    url: url,
    onload: function(response) {
      var reader  = new FileReader();
      reader.onloadend = function () {
        var img = new Image();
        img.onload = function(){
          callback(reader.result, parseInt(this.width,10), parseInt(this.height,10));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(response.response);
    },
  });
}

function trimArray(arr) {
  return arr.map((e) => e.trim());
}
function trimMultiline(s) {
  return trimArray(s.split("\n")).join("\n").trim();
}

function splitText(doc, s, size) {
  size = size?size:500;
  var p = s.split("\n");
  var r = [];
  for(var i = 0; i < p.length; i++) {
    var t = p[i].trim();
    if(t) {
      r.push(t);
    }
  }
  s = r.join("\n").trim();
  return doc.splitTextToSize(s, size);
}

function makeColums(doc, x, y, fontSize, columnSep, rowSep, data) {
  /* Write text to pdf in columns
  data = [
             [text1, text2, text2],
             [text3, text4, text5],
             ....
         ]
  */
  doc.setFontSize(fontSize);
  
  var columnWidth = [];
  for(var i = 0; i < data.length; i++) {
    for(var j = 0; j < data[i].length; j++) {
      var textWidth = doc.getStringUnitWidth(data[i][j]);
      if(columnWidth[j]) {
        columnWidth[j] = Math.max(columnWidth[j], fontSize * textWidth);
      } else {
        columnWidth.push(fontSize * textWidth);
      }
    }
  }
  
  var start_x = x;
  
  for(var i = 0; i < data.length; i++) {
    for(var j = 0; j < data[i].length; j++) {
      doc.text(x, y, data[i][j]);
      x += columnWidth[j] + columnSep;
    }
    x = start_x;
    y += doc.getLineHeight() + rowSep;
  }
  
  // Return total width and height
  var total_width = columnWidth.reduce((a, b) => a+b) + columnWidth.length * columnSep;
  var total_height = data.length * doc.getLineHeight() + data.length * rowSep;
  return [total_width, total_height];
}

function Layout(doc, x, y) {
  var lineSep = 0;
  var width = 595; // A4 = 495pt x 842pt
  var height = 842;
  var start_x = x;
  var start_y = y;
  
  this.move = function move(toX,toY) {
    x = toX;
    y = toY;
  };
  
  this.pos = function pos() {
    return {"x" : x, "y" : y};
  };
  
  this.pageWidth = function pageWidth() {
    return width;
  };
  
  this.setLineSep = function setLineSep(newlineSep) {
    lineSep = newlineSep
    return this;
  };
  
  this.text = function text(fontSize, str) {
    doc.setFontSize(fontSize);
  
    doc.text(x, y, doc.splitTextToSize(str, width-x));
    
    x += doc.getStringUnitWidth(str) * fontSize;
    return this;
  };
  
  this.line = function line(fontSize, str) {
    doc.setFontSize(fontSize);
        
    x = start_x;
    var textHeight = doc.splitTextToSize(str, width-x).length * doc.getLineHeight();
    this.text(fontSize, str);
    y += textHeight + lineSep;
    return this;
  };
  
  this.r = function r() {
    x = start_x;
  };
  
  this.br = function br(numberOfNewLines) {
    if(numberOfNewLines === -1) {
      x = start_x;
      y -= doc.getLineHeight() - lineSep;
    } else if(numberOfNewLines > 1) {
      for(var i = 0; i < numberOfNewLines; i ++) {
        br(1);
      }
    } else if(numberOfNewLines < 0) {
      for(var i = 0; i < -numberOfNewLines; i ++) {
        br(-1);
      }
    } else {
      x = start_x;
      y += doc.getLineHeight() + lineSep;
    }
    return this;
  };
  
  this.columns = function columns(fontSize, columnSep, rowSep, data) {
    var res = makeColums(doc, x, y, fontSize, columnSep, rowSep, data);
    x += res[0];
    y += res[1] + lineSep;
    return this;
  };
  
  
}


function RecipePage() {
  if(!document.querySelector("#recipe-incredients")) {
    throw Error("RecipePage() needs a recipe page");
  }

  this.title = function getTitle() {
    return document.querySelector("h1").textContent.trim();
  };

  this.summary = function getSummary() {
    return document.querySelector(".summary")?document.querySelector(".summary").textContent.trim():"";
  };

  this.ingredients = function getIngredients() {
    var ingredients = [];
    var tr = document.querySelectorAll("#recipe-incredients tr");
    for(var i = 0; i < tr.length; i++) {
      var td = tr[i].getElementsByTagName("td");

      var c = [];
      for(var j = 0; j < td.length; j++) {
        c.push(td[j].textContent.trim());
      }
      if(c) {
        ingredients.push(c);
      }
    }
    return ingredients;
  };

  this.servings = function getServings() {
    return (document.querySelector("#divisor").value + ' ' + document.querySelector("#divisor").nextElementSibling.firstChild.data).trim();
  };

  this.details = function getDetails() {
    return trimMultiline(document.querySelector("#rezept-zubereitung").previousElementSibling.textContent.trim().replace(/(\s)\s*/g,"$1").replace(/\n/g," "));
  };

  this.instructions = function getInstructions() {
    return trimMultiline(document.querySelector("#rezept-zubereitung").textContent);
  };

  this.imageURL = function getImageURL() {
    if(document.querySelectorAll("#slideshow a")[0].href) {
      var imgs = Array.from(document.querySelectorAll("#slideshow a")).filter((e) => e.style.display == 'block');
      if(imgs.length && imgs[0] && imgs[0].href) {
        return imgs[0].href.toString();
      }
    }
    return false;
  };

}

function makePdf(cb, recipe, imageData, imgWidth, imgHeight) {

  // Generate PDF
  var doc = new jsPDF("portrait", 'pt', 'a4');
  var layout = new Layout(doc, 20, 20);

  layout.setLineSep(5);

  layout.line(14,recipe.title());
  layout.line(11, recipe.summary());
  var image_y_start = layout.pos().y;
  layout.br();
  layout.line(13, "Zutaten (für "+recipe.servings()+")").r();
  layout.columns(12, 20, 5, recipe.ingredients());
  var image_x_start = layout.pos().x;
  var image_y_end = layout.pos().y;
  layout.line(13, "Zubereitung");
  layout.line(12, recipe.details());
  layout.line(12, recipe.instructions());
  
  if(imageData) {
    // Insert Image
    var paddingLeft = 10;
    var paddingRight = 10;
    var newImageWidth = layout.pageWidth() - image_x_start - paddingLeft - paddingRight;
    var newImageHeight = image_y_end - image_y_start;
    if(Math.min(newImageWidth, newImageHeight) > 20) { // Do not include images, if there's less than 20pt available
      var scale = Math.min(newImageWidth/imgWidth, newImageHeight/imgHeight);
      newImageWidth  = Math.floor(scale * imgWidth);
      newImageHeight = Math.floor(scale * imgHeight);
      doc.addImage(imageData, 'JPEG', image_x_start+paddingLeft, image_y_start, newImageWidth, newImageHeight);
    }
  }
  
  // Show PDF
  var datauristring = doc.output('datauristring');
  
  var div = document.createElement("div");
  div.style = "background:#90b262; position:absolute; top:15px; left:2px; padding:3px 5px;";
  document.body.appendChild(div);
  var head = document.createElement("div");
  head.style = "color:White; height:30px;";
  head.appendChild(document.createTextNode("PDF Dokument: "+(parseInt((datauristring.length-28)*0.75/102.4)/10)+"kB"));
  var a = document.createElement("a");
  a.style = "margin-left:10px; color:white; text-decoration:underline";
  a.href = datauristring;
  a.target = '_blank';
  a.appendChild(document.createTextNode("Download"));
  head.appendChild(a);
  var close = document.createElement("a");
  head.appendChild(close);
  close.innerHTML = '<button id="cboxClose" style="top: -15px;" type="button"><span>x</span></button>';
  close.style = "cursor:pointer;";
  close.addEventListener("click",function() {document.body.removeChild(div);});
  div.appendChild(head);
  var iframe = document.createElement("iframe");
  iframe.style = "width:400px; height:600px; ";
  div.appendChild(iframe);
  iframe.src = datauristring;
  cb(doc);
}

function downloadImageAndMakePdf(cb) {
  // Download the currently selected image and then create the PDF document
  var recipe = new RecipePage();
  
  if(recipe.imageURL()) {
    convertImgToDataURL(recipe.imageURL(), function(dataURI, width, height) {
      makePdf(cb, recipe, dataURI, width, height);
    });
  } else {
    makePdf(cb, recipe, false);
  }
};

(function () {
  // Show Button
  var a = document.querySelector("#recipe-buttons a").cloneNode();
  a.innerHTML = "PDF";
  a.href = "javascript:void(0)";
  a.title = "PDF Dokument erzeugen";
  a.className = "button-green  button-file-export";
  var click = function() {
    a.innerHTML = "Warten auf PDF..."; 
    window.setTimeout(function() {
      downloadImageAndMakePdf(function(doc) {
        window.setTimeout(function() {
        a.innerHTML = "PDF erstellt."; 
        a.title = "Hier klicken um PDF zu öffnen. Rechtsklick zum Speichern.";
        a.removeEventListener("click", click); 
        a.href = doc.output('datauristring');
        }, 5000);
      });
    },1); 
  };
  a.addEventListener("click", click);
  document.querySelector("#recipe-buttons").insertBefore(a, document.querySelector("#recipe-buttons a"));
})();

