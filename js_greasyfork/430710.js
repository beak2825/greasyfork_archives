// ==UserScript==
// @name         JackboxDrawer-Lite
// @description  Adds a button to import images into Jackbox drawing-based games!
// @namespace    ipodtouch0218/JackboxDrawer-Lite
// @version      1.0.0
// @include      *://jackbox.tv/*
// @downloadURL https://update.greasyfork.org/scripts/430710/JackboxDrawer-Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/430710/JackboxDrawer-Lite.meta.js
// ==/UserScript==

//Catch outgoing messages through stringify and replace drawing data.
//Has to be done through eval to break through GreaseMonkey's sandboxing.
window.eval(`
tempvar = null
ignore = 0
oldStringify = JSON.stringify
JSON.stringify = function(arg) {
  if (ignore > 0) {
    ignore--
    return oldStringify(arg);
  }
  if (typeof(arg.params) == 'undefined' || arg.params == null) {
    return oldStringify(arg);
  }
  data = arg.params
  if (typeof(tempvar) == 'undefined' || tempvar === null) {
    //No custom code ready, most likely a vanilla subimssion. Ignore this one.
    return oldStringify(arg);
  }
  eval(tempvar);
  tempvar = null;
  return oldStringify(arg);
}
`)

//Game variables
var currentGameId = null;
var button = null;
var games = {
  "drawful_1": {
    submitDrawing: function(img) {
      window.eval("tempvar = \"var test = '" + img + "'; if (typeof (data.body.picture) !== 'undefined') { data.body.picture = test; } else { data.body.drawing = test; }\"");
      document.getElementById("drawful-submitdrawing").click();
    },
    isInDrawingMode: function() {
      return !document.getElementsByClassName("state-draw")[0].getAttribute("class").includes("pt-page-off");
    },
    getSketchpad: function() {
      return document.getElementsByClassName("sketchpad")[0];
    },
    isActiveGame: function() {
      return document.getElementById("page-drawful") != null;
    },
    addImportButton: function() {
      button = document.createElement("input");
      button.setAttribute("type", "file");
      button.setAttribute("class", "button-drawful button-large pure-button pure-input-1");
      button.setAttribute("id", "import-button");
      button.setAttribute("accept", "image/*");
      button.setAttribute("style", "margin: 0 auto;");
      button.addEventListener("change", uploadBitmapImage);
      
      attach = document.getElementsByClassName("state-draw")[0];
      attach.appendChild(button);
    }
  },
  /*
  "drawful_2": {
    submitDrawing: function() {
      document.getElementById("submitdrawing").click()
    },
    isInDrawingMode: function() {
      return document.getElementsByClassName("Draw")[0] != null
    },
    getSketchpad: function() {
      return document.getElementById("fullLayer")
    }
  },
  */
  "bidiots": {
    submitDrawing: function(img) {
      window.eval("tempvar=\"data.body.drawing='" + img + "'\"");
      document.getElementById("auction-submitdrawing").click();
    },
    isInDrawingMode: function() {
      return !document.getElementById("state-draw").getAttribute("class").includes("pt-page-off");
    },
    getSketchpad: function() {
      return document.getElementById("auction-sketchpad");
    },
    isActiveGame: function() {
      return document.getElementById("page-auction") !== null;
    },
    addImportButton: function() {
      button = document.createElement("input");
      button.setAttribute("type", "file");
      button.setAttribute("class", "container button-auction button-large pure-button");
      button.setAttribute("id", "import-button");
      button.setAttribute("accept", "image/*");
      button.setAttribute("style", "margin: 0 auto;");
      button.addEventListener("change", uploadBitmapImage);
      
      attach = document.getElementById("state-draw");
      attach.appendChild(button);
    }
  },
  "tee_ko": {
	scaling: 5,
    submitDrawing: function(img) {
      window.eval("img=" + JSON.stringify(img).replace("\\",""));
      window.eval("tempvar='data.body.pictureLines=img'");
      document.getElementById("awshirt-submitdrawing").click();
    },
    isInDrawingMode: function() {
      return !document.getElementById("state-draw").getAttribute("class").includes("pt-page-off");
    },
    getSketchpad: function() {
      return document.getElementsByClassName("awshirt-sketchpad")[0];
    },
    isActiveGame: function() {
      return document.getElementById("page-awshirt") !== null;
    },
    addImportButton: function() {
      button = document.createElement("input");
      button.setAttribute("type", "file");
      button.setAttribute("class", "awshirt-button btn btn-block");
      button.setAttribute("id", "import-button");
      button.setAttribute("accept", "image/*");
      button.addEventListener("change", uploadVectorImage);
      
      attach = document.getElementsByClassName("post-sketchpad")[0];
      attach.appendChild(button);
    }
  },
  "push_the_button": {
	scaling: 6,
    submitDrawing: function(img) {
      img.forEach(line => {
        points = "";
        line["points"].forEach(point => {
          points += point["x"] + "," + point["y"] + "|";
        });
        line["points"] = points.substring(0,points.length-1)
      });
      window.eval("img=" + JSON.stringify(img).replace("\\",""));
      window.eval("tempvar='data.body.lines=img'");
      document.getElementById("submitdrawing").click();
    },
    isInDrawingMode: function() {
      return document.getElementsByClassName("Draw")[0] != null;
    },
    getSketchpad: function() {
      return document.getElementById("fullLayer");
    },
    isActiveGame: function() {
      return document.getElementsByClassName("pushthebutton")[0] != null;
    },
    addImportButton: function() {
      if (document.getElementsByClassName("Draw")[0] == null)
        return;
      button = document.createElement("input");
      button.setAttribute("type", "file");
      button.setAttribute("class", "button");
      button.setAttribute("id", "import-button");
      button.setAttribute("accept", "image/*");
      button.setAttribute("style", "margin: 0 auto;");
      button.addEventListener("change", uploadVectorImage);
      
      attach = document.getElementById("post-sketchpad");
      attach.appendChild(button);
    }
  },
  "trivia_murder_party_1": {
    submitDrawing: function(img) {
      window.eval("tempvar=\"data.body.drawing='" + img + "'\"");
      document.getElementById("enter-single-drawing-submit").click();
    },
    isInDrawingMode: function() {
      return !document.getElementById("state-enter-single-drawing").getAttribute("class").includes("pt-page-off");
    },
    getSketchpad: function() {
      return document.getElementById("sketchpad");
    },
    isActiveGame: function() {
      return document.getElementById("page-triviadeath") !== null;
    },
    addImportButton: function() {
      button = document.createElement("input");
      button.setAttribute("type", "file");
      button.setAttribute("class", "light-text button-game button-large pure-button pure-input-1");
      button.setAttribute("id", "import-button");
      button.setAttribute("accept", "image/*");
      button.setAttribute("style", "margin: 0 auto; color: white;");
      button.addEventListener("change", uploadBitmapImage);
      
      attach = document.getElementById("state-enter-single-drawing");
      attach.appendChild(button);
    }
  },
  /*
  "patentlystupid": {
    submitDrawing: function() {
      document.getElementById("submitdrawing").click()
    },
    isInDrawingMode: function() {
      return document.getElementsByClassName("Draw")[0] != null
    },
    getSketchpad: function() {
      return document.getElementById("fullLayer")
    }
  },
  */
  "champd_up": {
	scaling: 8,
    submitDrawing: function(img) {
      if (document.getElementsByClassName("button choice-button btn btn-lg")[0].innerText == "SUBMIT") {
        img.forEach(line => {
          points = "";
          line["points"].forEach(point => {
            points += point["x"] + "," + point["y"] + "|";
          });
          line["points"] = points.substring(0,points.length-1)
        });
        window.eval("img=" + JSON.stringify(img).replace("\\",""));
        window.eval("tempvar='data.val.lines=img'");
		document.getElementsByClassName("button choice-button btn btn-lg")[0].click();
      }
    },
    submitName: function() {
      btn = document.getElementsByClassName("button choice-button btn btn-lg")[0];
      if (btn.getAttribute("data-action") == "name") {
        btn.click();
        document.getElementsByClassName("swal2-input")[0].value = "test";
        document.getElementsByClassName("swal2-confirm swal2-styled")[0].click();
      }
    },
    canSubmitNormally: function() {
      return document.getElementsByClassName("button choice-button btn btn-lg")[0].innerText == "SUBMIT";
    },
    isInDrawingMode: function() {
      return document.getElementsByClassName("Draw")[0] != null;
    },
    getSketchpad: function() {
      return document.getElementsByClassName("sketchpad fullLayer")[0];
    },
    isActiveGame: function() {
      return document.getElementsByClassName("worldchamps")[0] != null;
    },
    addImportButton: function() {
      if (document.getElementsByClassName("Draw")[0] == null)
        return;
      button = document.createElement("input");
      button.setAttribute("type", "file");
      button.setAttribute("class", "button btn btn-lg");
      button.setAttribute("id", "import-button");
      button.setAttribute("accept", "image/*");
      button.setAttribute("style", "margin: 0 auto;");
      button.addEventListener("change", uploadVectorImage);
      
      attach = document.getElementsByClassName("choices")[0];
      attach.appendChild(button);
    }
  }
}

function uploadBitmapImage() {
  debug("Bitmap upload");
  createImageBitmap(button.files[0]).then(function(img) {
    sketchpad = games[currentGameId]["getSketchpad"]();
    ctx = sketchpad.getContext("2d");
    ctx.drawImage(img, 0, 0, sketchpad.width, sketchpad.height);
    debug("Canvas populated");

    uri = sketchpad.toDataURL('image/png');
    uri = uri.replace(/^data:image.+;base64,/, '');
      
    submitImage(uri);
  });
}

function uploadVectorImage() {
  scale = games[currentGameId]["scaling"];
  debug("Vector upload");
  
  createImageBitmap(button.files[0]).then(function(img) {
    sketchpad = games[currentGameId]["getSketchpad"]();
    ctx = sketchpad.getContext("2d");
    ctx.drawImage(img, 0, 0, (sketchpad.width/scale), (sketchpad.height/scale));
    debug("Canvas populated");
    
    resizedImage = ctx.getImageData(0, 0, (sketchpad.width/scale), (sketchpad.height/scale));
    
    submitImage(vectorizeImage(resizedImage, (sketchpad.width/scale), (sketchpad.height/scale), scale));
  });
}

function colorDistanceSquared(color1, color2) {
  redAvg = (color1["red"] + color2["red"]) / 2;
  redDiff = color2["red"]-color1["red"];
  greenDiff = color2["green"]-color1["green"];
  blueDiff = color2["blue"]-color1["blue"];
  if (redAvg < 128) {
    return (2 * (redDiff * redDiff)) + 
      (4 * (greenDiff * greenDiff)) +
      (3 * (blueDiff * blueDiff)); 
  } else {
    return (3 * (redDiff * redDiff)) + 
      (4 * (greenDiff * greenDiff)) +
      (2 * (blueDiff * blueDiff)); 
  }
}

function mixColors(color1, color2, t) {
  if (color1 == null) return color2;
  if (color2 == null) return color1;
  t2 = 1-t;
  return createColor(Math.floor((t * color1["red"]) + (t2 * color2["red"])), 
    Math.floor((t * color1["green"]) + (t2 * color2["green"])),
    Math.floor((t * color1["blue"]) + (t2 * color2["blue"])),
    1);
}

function createColor(red, green, blue, alpha) {
  return {"red": red, "green": green, "blue": blue, "alpha": alpha};
}

function colorToHex(color) {
  r = Number(color["red"]).toString(16);
  g = Number(color["green"]).toString(16);
  b = Number(color["blue"]).toString(16);
  return "#" + 
    (r.length == 1 ? "0" : "") + r + 
    (g.length == 1 ? "0" : "") + g + 
    (b.length == 1 ? "0" : "") + b;
}

function createPoint(x, y) {
  return {"x": x, "y": y};
}

function createLine(thickness, points, color) {
  return {"thickness": thickness, "points": points, "color": colorToHex(color)};
}    

function vectorizeImage(img, w, h, thickness) {
  lines = [];
  data = img.data;
  for (x = 0; x < w; x++) {
    currentLine = null;
    currentColor = null;
    colorCount = 1;
    for (y = 0; y < h; y++) {
      point = createPoint(x * thickness, y * thickness);
      pixelColor = createColor(data[(x + (y * w))*4 + 0],
        data[(x + (y * w))*4 + 1],
        data[(x + (y * w))*4 + 2],
        data[(x + (y * w))*4 + 3]);
      
      if (pixelColor.alpha < 70) {
        if (currentLine != null) {
          currentLine["points"].push(point);
          currentLine = null;
        }
        continue;
      }
      
      //first line of a row
      if (currentLine == null) {
        currentLine = createLine(thickness+1, [point], pixelColor);
        currentColor = pixelColor;
        colorCount = 1;
        lines.push(currentLine);
        continue;
      }
      
      if (y+1 >= h) {
        currentLine["points"].push(createPoint(x*thickness, y*thickness));
        break;
      }
      
      colorDistance = colorDistanceSquared(currentColor, pixelColor);
      //debug(colorDistance);
      if (colorDistance > 6400) {
        //too different to be grouped
        currentLine["points"].push(point);
        
        colorCount = 1;
        currentLine = createLine(thickness+1, [point], pixelColor);
        currentColor = pixelColor;
        lines.push(currentLine);
      } else {
        //group points... but not for some games. ugh.
        currentColor = mixColors(currentColor, pixelColor, 1-(1/++colorCount));
        currentLine["color"] = colorToHex(currentColor);
        
        if (currentGameId == "champd_up" || currentGameId == "push_the_button") {
          currentLine["points"].push(point);
        }
      }
    }
  }
  return lines;
}

function submitImage(data) {
  submit = true;
  if (currentGameId == "patentlystupid") {
    window.eval("ignore = 1");
  } else if (currentGameId == "champd_up") {
    if (games[currentGameId]["canSubmitNormally"]()) {
      window.eval("ignore = 1");
    } else {
      alert("You must submit a name first!\nUse the text box and \"Submit\" button under the color picker first!");
      submit = false;
	  button.value = null;
    }
  }
  
  //Simulate drawing on the sketchpad with mouse events. We can't access the sketchpad's info directly
  //as it's kept track of internally, and the game never attempts to send any data if it's blank.
  var rect = sketchpad.getBoundingClientRect();
  var mouseEvent = document.createEvent('MouseEvents');
  
  mouseEvent.clientX = rect.x + rect.width / 2;
  mouseEvent.clientY = rect.y + rect.height / 2;
  mouseEvent.initEvent("mousedown", true, false);
  sketchpad.dispatchEvent(mouseEvent);
  mouseEvent.clientX += 2;
  mouseEvent.initEvent("mousemove", true, false);
  sketchpad.dispatchEvent(mouseEvent);
  mouseEvent.initEvent("mouseup", true, false);
  sketchpad.dispatchEvent(mouseEvent);
    
  //Submit drawing and get ready to switch-a-roo.
  if (submit) {
    games[currentGameId]["submitDrawing"](data);
    button.value = null;
  }
}

//Observer stuff
var callback = function(mutations, observer) {
  for (var game in games) {
    if (games[game]["isActiveGame"]()) {
      currentGameId = game;
      debug("Game set to " + game);
      if (document.getElementById("import-button") == null)
        games[game]["addImportButton"]();
      break;
    }
  }
}

setTimeout(function() {
  observer = new MutationObserver(callback);
  targetNode = document.getElementById("app");
  config = { attributes: false, childList: true, subtree: true };
  observer.observe(targetNode, config);
  
  debug("Started observer");
}, 500);

function debug(message) {
  console.log("[JackboxDrawer-Lite] " + message);
}