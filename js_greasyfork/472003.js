// ==UserScript==
// @name tddhkh
// @namespace http://tampermonkey.net/
// @version 0.1
// @description tddhkhihipguck12
// @author 小李子
// @grant none
// ==/UserScript==
const a="123"
function addDisplayStyle(cssSelector) {
       $$$(cssSelector).css("display","none");
       $$$(cssSelector).attr("style","display:none");
    }

    function addDisplayCssStyle() {
       $$$("style").get(0).append("article{opacity: 1 !important;display: block !important;}" +
           "#menu li{opacity: 1;display: block;}")

    }

    function removeAlertRule1() {
        $$$("div[style]").each(function (index) {
            let attr = $$$(this).attr('style');
            let text = $$$(this).text();
            if (attr.indexOf("z-index") != -1 && (text.indexOf("首次访问") != -1 || text.indexOf("人机检测") != -1)) {
                let zIndex = $$$(this).css("z-index");
                console.log("zIndex:", zIndex)
                let lastDiv = $$$("div[style]").filter(function () {
                    return $$$(this).attr('style').indexOf("z-index") != -1 && $$$(this).css("z-index") == zIndex - 1
                })
                console.log("lastDiv:", lastDiv)
                if (lastDiv && lastDiv.length > 0) {
                    lastDiv.remove();
                }
                $$$(this).remove();
                $$$('body').css("overflow", 'auto');
            }

        })
    }
    function commonFindRules1(keys) {
        let split = keys.split(",");
        let selector = $$$("div").filter(function (){
            let text = $$$(this).text();
            let flag = false;
            for (let i in split) {
                flag = text.indexOf(split[i]) && flag ;
            }
            return flag && $$$(this).children().length == 0
        })
        let id = selector.attr("id");
        if(id){
           return "#"+id;
        }
        let cls = selector.attr("class");
        if(cls){
           return "."+cls;
        }
        return selector;
    }

    function commonRemoveRule1(selector,isRemoveParent) {
        var $selector = $$$(selector);
        if($selector.length > 0){
            if(isRemoveParent){
                $selector.parent().remove();
            }else {
                $selector.remove();
            }
        }

    }

let=document.querySelector("video")
const duti=()=>{
vi.play()
vi.currentTime=vi.duration+1
document.getElementsByClassName("vjs-big-play-button")[0].click()
}

function commonHideRule1(selectors) {
        var selectorArray = selectors.split(",");
        for (let index in selectorArray) {
            if ($$$("style").length > 0) {
                $$$("style").get(0).append(selectorArray[index] + "{display:none !important}");
            }else {
                $$$("header").append("<style></style>");
                $$$("style").get(0).append(selectorArray[index] + "{display:none !important}");
            }
        }




    }