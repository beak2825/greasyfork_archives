// ==UserScript==
// @name       backToTop
// @namespace  https://github.com/archion/
// @version    0.1
// @description  add backtotop button for all site
// @match      http://*/*
// @match      https://*/*
// @copyright  2014+, archion
// @icon       data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAQAAACQ9RH5AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJb0ZGcwAAAAAAAAAFAKddQosAAAAJcEhZcwAADdcAAA3XAUIom3gAAAMQSURBVFjDxdk9T1NRGMDxP2pIKyFgjKQyMRBIoL6UBJ1kcNAPIC/usoifQXSAbyAMwsgCI7BAIu1mJ2qJOCgR7aCGBHBR6IvU4VIovefcPuf0FM6zkXvvj3v63PP2NCBvTXQQpZdO2mnlKleAAn/5zQ+22GSTbf5IH9YguirEHR7xkB6uc1lzzT92+UScFdIcGryOtrUwzCJ7FIWxxxIjtNaGhhkkTlaMliJHgiHCtmyMeQ6M0VIcsECfORpijIw1WooMY4RM2Agz5GpmvU6f5aaU7WbVCVqKVbolbJSkU7ZIkSS3qr+te9ajA9864riTz3a49rcOMVM3tkiRWd2XPeYok/UZ/kLFxgy/222mmOKr0T0Z/5ASZt7oESn6Aehn3ei+hcruHjQaHFPETu68a0QfMFTOthC3ZM3pRPnMNWKQVpWsKZ3j6elntFQTa0ovlyaOe+JpXsea0fvc92556YA1o8cBmllzwprQcZqhj5+OWDn9iz54JshoKSul84zCG6eslJ6Gd1UuWTdkZfQafHHOSugtAr/hYLaHXmt6n4DlejAbI8WHwJVzEJ2DI0t2XZB4evpIB8tYe/pI3dUpMWtL51TJtcOA4YOC6QfsqJLrs++PiYB9nq7rguiQYpmxpRpANmgzTpYg+gZp1QDiHzILTNIo+G1ldCMTFHzXTqsniSyvfXQ1Vk038kqRvnlGIaacFitpCeun1ezxtKhbCJTTUvYsrWOPFwL6pU+WSdoIM0BKzHr0AGHamNAOx+Pef6Zf7BVIk1B8hdVihwRpRUp5cbLYM1neuohlQnAJOGSOPOfV8sydHsCZbWFqi8TZwzezTZt9VGzazLeptrHgnwdMN+Y2kVGvWC7oKOI8Dl+0x4sRVurGrgYfLXbxvi5ssvqxYrQOdJKoZGzpctzhwkNU77d+6+zYeIaIlPUy/Dnfa2aND8q9VmtpYN6mNFB67ydWxZAscQbtiyFe88o/u2J0j0WGaan2WGnB6zaPRQWvNVbYkBS8ZLDXmuiglyidtHOtrMS3f1zi+8g3eYnvP8iktgs0QF6yAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE0LTA5LTE0VDE5OjA4OjM3KzA4OjAwLN1sPgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNC0wOS0xNFQxOTowODozNyswODowMF2A1IIAAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/5051/backToTop.user.js
// @updateURL https://update.greasyfork.org/scripts/5051/backToTop.meta.js
// ==/UserScript==
if (window.top != window.self) { return; }  //don't run on frames or iframes
var af=document.createElement("link");
af.rel="stylesheet";
af.href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css";
document.head.appendChild(af);
var tp=document.createElement("span");
tp.className="fa fa-chevron-circle-up fa-2x top";
tp.setAttribute("style","cursor: pointer; opacity:0; position: fixed; right: 40px; bottom: 25px; transition: opacity 0.7s;z-index: 999999;");
document.body.appendChild(tp);
//var tp=document.querySelector("span.top")
tp.addEventListener('click',function(e){
    var sm=function(){
        if((document.body.scrollTop||document.documentElement.scrollTop)==0){
            return;
        }else{
            scroll(0,(document.body.scrollTop||document.documentElement.scrollTop)*0.9);
            setTimeout(sm,0.1);
        }
    };
    sm();
},false)
window.addEventListener("keydown", function(e) {
    if (e.altKey && e.keyCode == 84) {
        var sm=function(){
            if((document.body.scrollTop||document.documentElement.scrollTop)==0){
                return;
            }else{
                scroll(0,(document.body.scrollTop||document.documentElement.scrollTop)*0.9);
                setTimeout(sm,0.1);
            }
        };
        sm();
    }
}, false);
window.onscroll=function(){
    if((document.body.scrollTop||document.documentElement.scrollTop)>window.innerHeight/2){
        document.querySelector("span.top").style.opacity=0.8;
        document.querySelector("span.top").style.cursor="pointer";
    }else{
        document.querySelector("span.top").style.opacity=0;
        document.querySelector("span.top").style.cursor="initial";
    }
}
