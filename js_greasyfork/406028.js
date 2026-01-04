// ==UserScript==
// @name     SWGBBO isolation club Firefox dragging/resizing fix
// @description Fixes the twitch player so it can be dragged around and resized properly
// @version  1
// @include  https://fak.ovh/hotel
// @grant    none
// @run-at   document-start
// @namespace https://greasyfork.org/users/651033
// @downloadURL https://update.greasyfork.org/scripts/406028/SWGBBO%20isolation%20club%20Firefox%20draggingresizing%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/406028/SWGBBO%20isolation%20club%20Firefox%20draggingresizing%20fix.meta.js
// ==/UserScript==

window.addEventListener('beforescriptexecute',
  function(event)
  {
    if(/\/swaeg-player\.js$/.test(event.target.src)) 
    {
      event.preventDefault()
      event.stopPropagation()
      var script = document.createElement('script');
      script.innerHTML = patched.toString().replace(/^function.*{|}$/g, '')
      document.getElementsByTagName("body")[0].appendChild(script)
    }
  }
);

function patched() {
  var swaegPlayer = {
    // currently playing video id - this will loaded when swgbbo loads
    videoId: "swgstrategic",

    // fallbackVideoId is the default video that will be played
    // if the room doesn't have a custom video id in the roomVideos map
    fallbackVideoId: "swgstrategic",

    // room video map
    // add your custom video here -> roomId: videoId
    roomVideos: {
      547: "So_W6Nwdd5k",  // science
      604: "So_W6Nwdd5k",  // science	
      //513: "Ep0ImStp81A", // bacchus
      454: "Ep0ImStp81A", //say
      457: "Ep0ImStp81A", // say
      581: "Ep0ImStp81A", // otto
      148: "Ep0ImStp81A", // OLDSKOOL
      1156: "Ep0ImStp81A", // tylllero
      764: "onr2DDVJT4Q", // Aamu
          89: "onr2DDVJT4Q",
          625: "ZSDF9Qwt2hU", // chiptune	
          1313: "Ep0ImStp81A", //ambulanssikuski
      //2: "V2CM356M6kQ", //club room 1
      //1: "V2CM356M6kQ", //club room 3
      //8: "V2CM356M6kQ", // club room 2
      //89: "V2CM356M6kQ", // ambient grove
      //114: "V2CM356M6kQ", //sauna
      //320: "l1wZdA5JNP4", //rookipaikka
    },

    roomTwitch: {
      // 513: "insomniac",
      548: "samulitanner", // ullakko
      535: "samulitanner", // ullakko
      508: "samulitanner", // ullakko
      812: "samulitanner",
      814: "samulitanner",
      780: "samulitanner",
      811: "samulitanner",
      810: "samulitanner",
      779: "samulitanner",
      556: "samulitanner",
      735: "samulitanner",
      1276: "chomemoontv",
      1160: "chomemoontv",
      1304: "chomemoontv",
      1292: "idnetaudioforum",
      //2: "V2CM356M6kQ", //club room 1
      //1: "V2CM356M6kQ", //club room 3
      //8: "V2CM356M6kQ", // club room 2
      //89: "V2CM356M6kQ", // ambient grove
      //114: "V2CM356M6kQ", //sauna
      //320: "l1wZdA5JNP4", //rookipaikka
    },

    // default video size on load
    videoWidth: 512,
    videoHeight: 288,

    mute: 1,
    autoplay: 1,

    muteTwitch: false,
    autoplayTwitch: true,

    // root element
    root: null,
    // draggable wrapper for the iframe
    dragelem: null,
    resizeElem: null,

    // video dom element (iframe)
    vde: null,

    mouseX: 0.0,
    mouseY: 0.0,
    elemX: 0.0,
    elemY: 0.0,
    resizeX: 0.0,
    resizeY: 0.0,
    
    notResizing: false,
    
    videoHidden: false,
    lastVideoHeight: 0.0,
    
    dragTarget: document.createElement('div'),
    resizeIndicator: document.createElement('h2'),
    indicatorAdded: false,

    init: function() {
      console.log("init swag player");
      var os = this.detectOS();

      var hotelContainer = document.getElementById("hotel-container")
      this.dragTarget.id = "drag-target"
      /*document.addEventListener("dragover", function(e) {
        e.dataTransfer.dropEffect = "move"
        e.preventDefault();
      }, false);*/
      this.dragTarget.style.width = "100%"
      this.dragTarget.style.height = "100%"
      this.dragTarget.style.position = "absolute"
      this.dragTarget.style.left = "0"
      this.dragTarget.style.top = "0"
      this.dragTarget.style.display = "none"
      hotelContainer.appendChild(this.dragTarget)
      
      this.resizeIndicator.textContent = "Resizing..."
      this.resizeIndicator.style.color = "#000"
      this.resizeIndicator.style.display = "none"
      
      this.dragTarget.addEventListener("dragover", function(e) {
        e.preventDefault();
        // console.log("dragovered", e)
      }, false);
      
      this.dragTarget.addEventListener("drop", this.dragFF.bind(this));
      
      this.root = document.getElementById("tubeplayer");
      if (this.root === null || typeof this.root === "undefined") {
        console.log("fatal: no root element found");
        return;
      }
      /*this.root.addEventListener("dragover", function(e) {
        e.dataTransfer.dropEffect = "move"
        e.preventDefault();
      });*/

      // check for existing video player
      var player = document.getElementById("swg-drag");
      //console.log(player);
      if (player !== null) {
        console.log("player found");
        return;
      }

      // draggable border
      var d = document.createElement("div");
      d.id = "swg-drag";
      d.setAttribute("draggable", "true");
      d.style.position = "absolute";
      d.className = "grabbable";

      // get browser width
      var bWidth = this.getWidth();
      // calculate position for window
      var vpx = bWidth - (this.videoWidth + 12) - 6;
      console.log("vpx", vpx);
      d.style.left = vpx + "px";
      d.style.top = "75px";

      /*var topbar = document.createElement("div");
      topbar.className = "top-bar";
      var bottombar = document.createElement("div");
      bottombar.className = "bottom-bar";*/

      // icons
      var dragIcon = document.createElement("img");
      dragIcon.src = "/assets/images/drag.svg";
      dragIcon.className = "drag-icon";

      // windows supports this reliably - need to possbily stop using dnd api
      if (os === "Windows") {
        var resizeIcon = document.createElement("img");
        resizeIcon.src = "/assets/images/resize.svg";
        resizeIcon.setAttribute("draggable", "true");
        resizeIcon.addEventListener("dragstart", this.onResizeStart.bind(this));
        resizeIcon.addEventListener("drag", this.onResize.bind(this));
        // resizeIcon.addEventListener("dragend", this.dragFF.bind(this));
        resizeIcon.className = "resize-icon grabbable";
        this.resizeElem = resizeIcon;
      }

      //relem.appendChild(resizeIcon);

      var minIcon = document.createElement("img");
      minIcon.src = "/assets/images/min.svg";
      minIcon.className = "min-icon";
      minIcon.addEventListener("click", this.minimizeToggle.bind(this));

      // video iframe
      var v = document.createElement("iframe");
      v.setAttribute("width", this.videoWidth);
      v.setAttribute("height", this.videoHeight);
      v.setAttribute("frameborder", 0);
      v.setAttribute("allow", "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture");
      v.id = "swg-player";
          //v.src = "https://www.youtube.com/embed/" + this.fallbackVideoId + "?autoplay=" + this.autoplay + "&mute=" + this.mute;
          v.src = "https://player.twitch.tv/?channel=" + this.videoId + "&parent=fak.ovh" + "&autoplay=" + this.autoplayTwitch + "&mute=" + this.muteTwitch;


      // border event listeners for drag & drop
      d.addEventListener("dragstart", this.onDragStart.bind(this));
      // d.addEventListener("dragend", this.onDragEnd.bind(this));
      d.addEventListener("drag", this.onDrag.bind(this));

      // adds icons to border
      //topbar.appendChild(dragIcon);
      //topbar.appendChild(minIcon);
      d.appendChild(dragIcon);
      d.appendChild(minIcon);
      if (os === "Windows") {
        d.appendChild(resizeIcon);
      }
      //bottombar.appendChild(resizeIcon);

      this.vde = v;
      this.dragelem = d;

      //this.dragelem.appendChild(topbar);
      this.dragelem.appendChild(this.vde);
      //this.dragelem.appendChild(bottombar);
      this.root.appendChild(this.dragelem);
    },

    switchVideo: function(roomId) {
      if (this.roomVideos.hasOwnProperty(roomId)) {
        //console.log("switching video ", this.roomVideos[roomId]);
        var newVideo = this.roomVideos[roomId];
        if (newVideo !== this.videoId) {
          var player = document.getElementById("swg-player");
          if (player !== null) {
            player.src = "https://www.youtube.com/embed/" + newVideo + "?autoplay=" + this.autoplay + "&mute=" + this.mute;
            this.videoId = newVideo;
          }
        }
      } else if (this.roomTwitch.hasOwnProperty(roomId)) {
        //console.log("switching video ", this.roomVideos[roomId]);
        var newVideo = this.roomTwitch[roomId];
        if (newVideo !== this.videoId) {
          var player = document.getElementById("swg-player");
          if (player !== null) {
            player.src = "https://player.twitch.tv/?channel=" + newVideo + "&parent=fak.ovh" + "&autoplay=" + this.autoplayTwitch + "&mute=" + this.muteTwitch;
            this.videoId = newVideo;
          }
        }
      } else {
        // use default video if roomID is not found
        if (this.videoId !== this.fallbackVideoId) {
          var player = document.getElementById("swg-player");
          if (player !== null) {
            //player.src = "https://www.youtube.com/embed/" + this.fallbackVideoId + "?autoplay=" + this.autoplay + "&mute=" + this.mute;
            player.src = "https://player.twitch.tv/?channel=" + this.fallbackVideoId + "&parent=fak.ovh" + "&autoplay=" + this.autoplayTwitch + "&mute=" + this.muteTwitch;
            this.videoId = this.fallbackVideoId;
          }
        }
      }
    },

    resizeVideoElement: function() {
      if (this.vde !== null && typeof this.vde !== "undefined") {
        this.vde.setAttribute("width", this.videoWidth);
        this.vde.setAttribute("height", this.videoHeight);
      }
    },

    minimizeToggle: function(e) {
      if (!this.videoHidden) {
        this.lastVideoHeight = this.videoHeight;
        this.videoHeight = 0;
        this.videoHidden = true;
        this.resizeVideoElement();
        return;
      }
      this.videoHeight = this.lastVideoHeight;
      this.resizeVideoElement();
      this.videoHidden = false;
    },
    
    dragFF: function(e) {
      //console.log("not resizing?", swaegPlayer.notResizing)
      document.getElementById("swg-player").style.display = "block"
      //console.log(e)
      e.preventDefault();
      e.target.style.display = "none"
      if (swaegPlayer.notResizing) {
        var el = swaegPlayer.dragelem
        var curX = el.offsetLeft
        var curY = el.offsetTop
        var newX = e.clientX - swaegPlayer.old_mouseX
        var newY = e.clientY - swaegPlayer.old_mouseY
        el.style.left = (curX + newX) + "px"
        el.style.top = (curY + newY) + "px"
      } else {
        swaegPlayer.onResizeEnd(e)
      }
    },

    onDragStart: function(e) {
      swaegPlayer.dragTarget.style.display = "block"
      if (swaegPlayer.dragelem.style.paddingBottom !== "5px") {
        swaegPlayer.dragelem.style.paddingBottom = "5px"
      }
      if(e.target !== this.resizeElem) {
        swaegPlayer.notResizing = true
        // console.log("dragging (started)", e);
        var clientRect = this.dragelem.getBoundingClientRect();
        e.dataTransfer.setData("text", event.target.id);
        e.dataTransfer.setDragImage(this.vde, e.clientX - clientRect.left, e.clientY - clientRect.top);
        e.dataTransfer.effectAllowed = "move";
        /*this.elemX = e.clientX - this.dragelem.offsetLeft;
        this.elemY = e.clientY - this.dragelem.offsetTop;*/
        
        swaegPlayer.old_mouseX = e.clientX
        swaegPlayer.old_mouseY = e.clientY
      }
    },

    onDrag: function(e) {
      // console.log("dragging", e);
      e.preventDefault();
    },

    onDragEnd: function(e) {
      if (typeof this.dragelem !== "undefined" && e.target !== this.resizeElem) {
        // console.log("drop", e);
        this.dragelem.style.left = (swaegPlayer.clientXff - this.elemX) + "px";
        this.dragelem.style.top = (swaegPlayer.clientYff - this.elemY) + "px";
      }
    },

    onResizeStart: function(e) {
      if (typeof this.dragelem !== "undefined" && !swaegPlayer.indicatorAdded) {
        this.dragelem.appendChild(swaegPlayer.resizeIndicator)
        swaegPlayer.indicatorAdded = true
      }

      swaegPlayer.notResizing = false;
      // console.log("resize", e);
      e.dataTransfer.effectAllowed = "move";
      var clientRect = this.dragelem.getBoundingClientRect();
      e.dataTransfer.setDragImage(this.vde, e.clientX - clientRect.left, e.clientY - clientRect.top);

      //var pr = window.devicePixelRatio;
      this.resizeX = e.clientX;
      this.resizeY = e.clientY;
      // console.log(this.resizeX, this.resizeY);
      //e.preventDefault();
    },

    onResize: function(e) {
      //console.log("resizing", e);
      swaegPlayer.vde.style.display = "none"
      swaegPlayer.resizeIndicator.style.display = "block"
      e.preventDefault();
    },

    onResizeEnd: function(e) {
      // console.log("resizeend", e);
      swaegPlayer.resizeIndicator.style.display = "none"
      //var pr = window.devicePixelRatio;
      var diffX = this.resizeX - (e.clientX);
      var diffY = this.resizeY - (e.clientY);
      //var pos = this.findPosition(this.dragelem);

      //var diffX = this.resizeX - pos[0];
      //var diffY = this.resizeY - pos[1];

      console.log(diffX, diffY);

      this.videoWidth = this.videoWidth - diffX;
      this.videoHeight = this.videoHeight - diffY;
      this.resizeVideoElement();
    },

    findPosition: function(obj) {
      var curleft = curtop = 0;
      if (obj.offsetParent) {
        do {
          curleft += obj.offsetLeft;
          curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
      }
      return [curleft, curtop];
    },

    detectOS: function() {
      var OSName="Unknown OS";
      if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
      if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
      if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
      if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";
      return OSName;
    },

    getWidth: function() {
      return Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
      );
    }, 
  };

  window.onload = function() {
    swaegPlayer.init();

  };

  window.addEventListener("message", function(e) {
    //console.log(e);
    if (typeof e.data.n !== "undefined" && e.data.n !== null) {
      var roomData = JSON.parse(e.data.n);
      if (roomData.header === "room_data") {
        swaegPlayer.switchVideo(roomData.data.id);
      }
    }
  }, false);

  console.log("successfully patched video player, drag and resize to your heart's desire")
}