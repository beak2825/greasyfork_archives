// ==UserScript==
// @name         JackboxDrawer
// @description  Allows custom brush sizes, colors, and even importing images into Jackbox's drawing games!
// @namespace    ipodtouch0218/JackboxDrawer
// @version      1.6.1
// @include      *://jackbox.tv/*
// @downloadURL https://update.greasyfork.org/scripts/406893/JackboxDrawer.user.js
// @updateURL https://update.greasyfork.org/scripts/406893/JackboxDrawer.meta.js
// ==/UserScript==

//Catch outgoing messages through stringify and replace drawing data.
//Has to be done through eval to break through GreaseMonkey's sandboxing.
window.eval(`
ignore = 0
oldStringify = JSON.stringify
JSON.stringify = function(arg) {
  if (ignore > 0) {
    console.log('ignoring ' + arg.params)
    ignore--
    return oldStringify(arg)
  }
  if (typeof(arg.params) == 'undefined' || arg.params == null) {
    return oldStringify(arg)
  }
  data = arg.params
  if (typeof(tempvar) == 'undefined' || tempvar === null) {
    //No custom code ready, most likely a vanilla subimssion. Ignore this one.
    return oldStringify(arg)
  }
  eval(tempvar)
  tempvar = null
  return oldStringify(arg)
}
`)

//Handle games and their differences.
var games = {
  "drawful_1": {
    submitDrawing: function() {
      document.getElementById("drawful-submitdrawing").click()
    },
    isInDrawingMode: function() {
      return !document.getElementsByClassName("state-draw")[0].getAttribute("class").includes("pt-page-off")
    },
    getSketchpad: function() {
      return document.getElementsByClassName("sketchpad")[0]
    }
  },
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
  "bidiots": {
    submitDrawing: function() {
      document.getElementById("auction-submitdrawing").click()
    },
    isInDrawingMode: function() {
      return !document.getElementById("state-draw").getAttribute("class").includes("pt-page-off")
    },
    getSketchpad: function() {
      return document.getElementById("auction-sketchpad")
    }
  },
  "tee_ko": {
    submitDrawing: function() {
      document.getElementById("awshirt-submitdrawing").click()
    },
    isInDrawingMode: function() {
      return !document.getElementById("state-draw").getAttribute("class").includes("pt-page-off")
    },
    getSketchpad: function() {
      return document.getElementsByClassName("awshirt-sketchpad")[0]
    }
  },
  "push_the_button": {
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
  "trivia_murder_party_1": {
    submitDrawing: function() {
      document.getElementById("enter-single-drawing-submit").click()
    },
    isInDrawingMode: function() {
      return !document.getElementById("state-enter-single-drawing").getAttribute("class").includes("pt-page-off")
    },
    getSketchpad: function() {
      return document.getElementById("sketchpad")
    }
  },
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
  "champd_up": {
    submitDrawing: function() {
      if (document.getElementsByClassName("button choice-button btn btn-lg")[0].innerText == "SUBMIT") {
        document.getElementsByClassName("button choice-button btn btn-lg")[0].click()
      }
    },
    submitName: function() {
      btn = document.getElementsByClassName("button choice-button btn btn-lg")[0]
      if (btn.getAttribute("data-action") == "name") {
        btn.click()
        document.getElementsByClassName("swal2-input")[0].value = "test"
        document.getElementsByClassName("swal2-confirm swal2-styled")[0].click()
      }
    },
    canSubmitNormally: function() {
      return document.getElementsByClassName("button choice-button btn btn-lg")[0].innerText == "SUBMIT"
    },
    isInDrawingMode: function() {
      return document.getElementsByClassName("Draw")[0] != null
    },
    getSketchpad: function() {
      return document.getElementsByClassName("sketchpad fullLayer")[0]
    }
  }
}
//Keeps track of the game we're currently playing.
gameID = null

function updateGame(id) {
  gameID = id
  if (typeof(socket) !== 'undefined' && socket !== null) {
    //Update the drawing app on what game we're playing.
    socket.send("updategame:" + id)
  }
}

//Is ran every time the document changes. Useful for finding which game we're currently playing.
var callback = function(mutationsList, observer) {
  if (document.getElementById("page-drawful") != null) {
	updateGame("drawful_1")
  } else if (document.getElementsByClassName("drawful2international")[0] != null) {
	updateGame("drawful_2")
  } else if (document.getElementById("page-auction") !== null) {
    updateGame("bidiots")
  } else if (document.getElementById("page-awshirt") !== null) {
    //Fun fact. Tee KO is actually internally called "awshirt" both on the website and in the game files.
    updateGame("tee_ko")
  } else if (document.getElementsByClassName("pushthebutton")[0] != null) {
    //Yes, the class name has spaces.
    updateGame("push_the_button")
  } else if (document.getElementById("page-triviadeath") !== null) {
    updateGame("trivia_murder_party_1")
  } else if (document.getElementsByClassName("worldchamps")[0] != null) {
    updateGame("champd_up")
  } else if (document.getElementsByClassName("patentlystupid")[0] != null) {
	updateGame("patentlystupid")
  }
}

//chrome doesn't like the observer being setup now, lets just add it later???
setTimeout(function() {
  //Initiate the DOM observer to run "callback" every time it changes.
  var observer = new MutationObserver(callback)
  var targetNode = document.getElementById('app')
  var config = { attributes: true, childList: true, subtree: true }
  observer.observe(targetNode, config)
}, 1000)

//Info related to communicating with the Java app.
var socket = null
var open = false
var firsttry = false

//We want to automatically attempt reconnects if the connection is dropped, use setInterval with some
//checks to make sure we don't make multiple connections.
setInterval(function() {
  if (open || socket !== null) {
    return
  }
  socket = new WebSocket("ws://127.0.0.1:2460")
  
  socket.onopen = function(e) {
    alert("Connection established with JackboxDrawer program.")
    open = true
    callback(null,null)
  }
  
  socket.onmessage = function(event) {
	
    //Check for the proper version.
    if (event.data.startsWith("version")) {
        var version = event.data.split(":")[1]
        if (version > 161) {
            alert("Please update the JackboxDrawer Greasemonkey script!\nThe download can be found here: https://greasyfork.org/en/scripts/406893-jackboxdrawer")
        } else if (version < 161) {
            alert("Please update the JackboxDrawer Java program!\nThe download can be found here: https://github.com/ipodtouch0218/JackboxDrawer/releases")
        }
        return
    }
    
    //Save incoming code from the websocket in "tempvar". Needs to be eval'd to get through Greasemonkey's sandboxing.
    //We could also use window.wrappedJSObject but this is what I thought of first. Either way, potental security breach right here.
    window.eval("var tempvar = `" + event.data.replace("SUBMITNAME;","") + "`")
    
    //Check to make sure we can actually DRAW right now.
    //If not, even attempting to submit a drawing can easily crash our webpage.
    
    var currentGame = games[gameID]
    if (typeof (currentGame) === 'undefined' || currentGame === null) {
      alert("Game not supported!")
      return
    }
    
    if (!currentGame.isInDrawingMode()) {
      alert("Cannot submit: Not in drawing mode!")
      window.eval("var tempvar = null")
      return
    }
    
    if (gameID == "champd_up") {
      if (event.data.startsWith("SUBMITNAME;")) {
        currentGame.submitName()
        return
      }
    }
    
    //Find the current sketchpad. We need it for later...
    var sketchpad = currentGame.getSketchpad()
    if (sketchpad === null) {
      //Couldn't find it, we're probably can't draw right now. Somehow, the previous checks failed.
      return
    }
    
    submit = true
	if (gameID == "patentlystupid") {
		window.eval("ignore = 1")
	} else if (gameID == "champd_up") {
      if (currentGame.canSubmitNormally()) {
        window.eval("ignore = 1")
      } else {
		alert("You must submit a name first!\nUse the text box and \"Submit\" button under the color picker first!");
        submit = false
      }
    }
    
    //Simulate drawing on the sketchpad with mouse events. We can't access the sketchpad's info directly
    //as it's kept track of internally, and the game never attempts to send any data if it's blank.
    var rect = sketchpad.getBoundingClientRect()
    var mouseEvent = document.createEvent('MouseEvents')
  
    mouseEvent.clientX = rect.x + rect.width / 2
    mouseEvent.clientY = rect.y + rect.height / 2
    mouseEvent.initEvent("mousedown", true, false)
    sketchpad.dispatchEvent(mouseEvent)
    mouseEvent.clientX += 2
    mouseEvent.initEvent("mousemove", true, false)
    sketchpad.dispatchEvent(mouseEvent)
    mouseEvent.initEvent("mouseup", true, false)
    sketchpad.dispatchEvent(mouseEvent)
    
    //Submit drawing and get ready to switch-a-roo.
    
    if (submit)
    	currentGame.submitDrawing()
  }
  
  //Socket died, my dude.
  socket.onclose = function(event) {
    if (!open) return
    alert("Connection lost with JackboxDrawer program. Retrying...")
    open = false
    socket = null
  }
  
  //Socket died PAINFULLY, my dude.
  socket.onerror = function(error) {
    if (!firsttry) {
      alert("Failed to connect to JackboxDrawer. \nI will attempt to reconnect in the background...")
      firsttry = true
    }
    socket = null
  }
}, 1000)
