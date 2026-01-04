// ==UserScript==
// @name         friend-system-mykirito
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  try to take over the world!
// @author       cinnamomum
// @grant        none
// @match        https://mykirito.com/profile*
// @downloadURL https://update.greasyfork.org/scripts/403235/friend-system-mykirito.user.js
// @updateURL https://update.greasyfork.org/scripts/403235/friend-system-mykirito.meta.js
// ==/UserScript==

(function() {

    //未完成，臨時可用版本

    var url = document.location.href;
    //下方player為名單
    var player = ["無法","樟樹cinnamomum","成韻","Pacifist","石頭吐司","詩乃警局看板娘","異域獾","西衛V","卑鄙援之助","黑漆漆雙刀怪","快樂賣水仔","廉人","我來殺你啦","熔岩巧克力","山中竹子","ppodds","呆呆小法師","Lalaz","無能的大佐","星星爆爆","八加九柴犬","D","StarskyXIII","圭月","Hypnos活佛","春夢貓女你今夜的惡夢","StarskyXV","はちゃまっちゃま","當我舉起第二把劍","渴望性愛的64歲女大生","愛國者你怎麼死的那麼慘","10秒是吧","WhiteBear","天轟回來到牙齒對郎造","翻滾的牛肉飯","背骨背骨背骨你","VV","FAL","恐龍","魔法阿嬤師匠","Shield","Poppyer","可可可test專用沙包","可可可","嬌弱的小花花","我永遠喜歡湊あくあ","我在雨中星爆爆","人間鯊魚","閃閃","CutyIMoDo","1024"]
    var test = 0;
    //var button2 = document.getElementsByClassName("sc-AxgMl hMeozO")[0].disabled;
    //var button1 = document.getElementsByClassName("sc-AxgMl llLWDd")[0].disabled;

    async function namecheck(name) {
        var _name = name;
        console.log(_name);
        player.forEach(function(item, index, array) {
            if (_name == item) {
                test = 1;
            }
        })

        if (test == 1) {
            alert("這是微笑噁男成員，別打喔");
        }
    }



    if (url.indexOf("https://mykirito.com/profile") === 0) {

        var xhr = new XMLHttpRequest();
        xhr.open("get","URL");
        xhr.send(null);
        xhr.onload = function() {

            var name1 = document.getElementsByClassName("sc-AxhUy dRdZbR")[16].innerHTML;
            namecheck(name1);

        }


    }


})();