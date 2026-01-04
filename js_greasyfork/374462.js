function onLongPress(dom,callback,ms=1000){
  if(!dom){
    console.error("dom不存在");
    return;
  }else if(dom.toString()=="[object NodeList]"){
    for(let i of dom){
      onLongPress(i,callback,ms)
    }
    return;
  }
  
  if(dom["data-Longpress"]){
    return ;
  }
  dom["data-Longpress"] = "true";
  function MouseUpHandler(e){
    dom.mouseDownFlag = false;
    document.removeEventListener("mouseup",MouseUpHandler)
    document.removeEventListener("mousemove",MouseMoveHandler)
  }
  function MouseMoveHandler(e){
    if(e.target != dom){
      dom.mouseDownFlag = false;
      document.removeEventListener("mouseup",MouseUpHandler)
    document.removeEventListener("mousemove",MouseMoveHandler)
    }
  }
  dom.addEventListener("click",(e)=>{
    if(dom.HandledLongPress){
      dom.HandledLongPress = false;
      e.stopPropagation();
      e.cancelBubble = true;
      e.preventDefault();
      return false;
    }
  },true)
  
  let origin_click_function = dom.onclick||function(){};
  dom.onclick = function(e){
    if(dom.HandledLongPress){
    }else{
      origin_click_function(e);
    }
  }
  
  dom.addEventListener("mousedown",()=>{
    dom.mouseDownFlag = true;
    let ts = setTimeout(()=>{
      document.removeEventListener("mouseup",MouseUpHandler);
      document.removeEventListener("mousemove",MouseMoveHandler)
      if(dom.mouseDownFlag){
        callback(dom);
        dom.mouseDownFlag = false;
        dom.HandledLongPress = true;
      }
    },ms);
    document.addEventListener("mouseup",MouseUpHandler);
    document.addEventListener("mousemove",MouseMoveHandler);
  })
}
