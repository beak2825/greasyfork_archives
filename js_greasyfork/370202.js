function mouseEvent(type, sx, sy, cx, cy) {
  var evt;
  var e = {
    bubbles: true,
    cancelable: (type != "mousemove"),
    view: window,
    detail: 0,
    screenX: sx, 
    screenY: sy,
    clientX: cx, 
    clientY: cy,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    button: 0,
    relatedTarget: undefined
  };
  if (typeof( document.createEvent ) == "function") {
    evt = document.createEvent("MouseEvents");
    evt.initMouseEvent(type, 
      e.bubbles, e.cancelable, e.view, e.detail,
      e.screenX, e.screenY, e.clientX, e.clientY,
      e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
      e.button, document.body.parentNode);
  } else if (document.createEventObject) {
    evt = document.createEventObject();
    for (prop in e) {
    evt[prop] = e[prop];
  }
    evt.button = { 0:1, 1:4, 2:2 }[evt.button] || evt.button;
  }
  return evt;
}
var a = document.getElementsByClassName("spinner")[0],
	b = document.getElementById("speed");
a.addEventListener("mousemove", function(e){console.log("clientX:" + e.clientX +", clientY:" + e.clientY +", screenX:" + e.screenX +", screenY:" + e.screenY +", movementX:" + e.movementX);});

function bootRot(x, y){
	a.dispatchEvent(mouseEvent("mousemove", x, y, x, y));
}
