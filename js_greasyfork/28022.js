// ==UserScript==
// @name         KF Preview
// @namespace    http://tampermonkey.net/
// @author       nsps5606
// @version      2017.03.11.1
// @include      http://bbs.2dkf.com/thread.php?fid=*
// @include      http://bbs.9moe.com/thread.php?fid=*
// @include      http://bbs.kfgal.com/thread.php?fid=*
// @include      https://kf.miaola.info/thread.php?fid=*
// @require      http://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @grant        GM_xmlhttpRequest
// @description  預覽帖子內的圖
// @downloadURL https://update.greasyfork.org/scripts/28022/KF%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/28022/KF%20Preview.meta.js
// ==/UserScript==

(function() {

    var imgDiv = document.createElement("div");
    imgDiv.style.cssText = 'max-width: 510px; max-height: 510px; position: fixed; top: 10px; right: 10px; padding: 5px; background-color: #F9E47D; font-size: 24px;';
    imgDiv.id = "imgDiv";
    document.body.appendChild(imgDiv);

    var _imgs;
    var index = 0;
    var onHoverLink;
    var isStillOnHover = false;
    var tID = -1;
    var Links = $(".threadtit1 a");

    Links.mouseenter(function(){
        onHoverLink = this.href;
        isStillOnHover = true;
        tID = setTimeout(function(){
            updateImg(1);
            getLink();
        }, 500);
    });

    Links.mouseleave(function(){
        isStillOnHover = false;
        clearTimeout(tID);
        updateImg(5);
    });

    function getLink()
    {
        GM_xmlhttpRequest({
            method : 'GET',
            synchronous : false,
            url : onHoverLink,
            onload : function (response) {

                if(isStillOnHover)
                {
                    var parser = new DOMParser();
                    var responseDoc = parser.parseFromString(response.responseText, "text/html");

                    var _1F = responseDoc.getElementsByClassName("readtext")[0];
                    _1F.querySelectorAll(".readidms, .readidm")[0].innerHTML = ""; //去掉頭像
                    _imgs = _1F.querySelectorAll("img:not([src*='\/post\/smile\/em\/em'])"); //去掉表情

                    if(_imgs.length == 0)
                    {
                        updateImg(2);
                    }
                    else
                    {
                        index = 0;
                        getNextImg();
                    }
                }

            }
        });
    }

    function getNextImg()
    {
        var newImg = new Image();
        newImg.onload = function(event) {

            index++;
            if(this.naturalHeight > 200 && this.naturalWidth > 200)
            {
                updateImg(4);
                this.style.cssText = "max-width: 500px; max-height: 500px;";
                imgDiv.appendChild(this);
            }
            else if(index >= _imgs.length)
            {
                updateImg(3);
            }
            else if(isStillOnHover)
            {
                getNextImg();
            }
        };
        newImg.src = _imgs[index].src;
    }

    function updateImg(code)
    {
        if(code == 1)
        {
            imgDiv.innerHTML = "<div><b>Loading...</b></div>";
            imgDiv.style.display = "block";
        }
        else if(code == 2 && isStillOnHover)
        {
            imgDiv.innerHTML = "<div><b>沒有圖片</b></div>";
            imgDiv.style.display = "block";
        }
        else if(code == 3 && isStillOnHover)
        {
            imgDiv.innerHTML = "<div><b>沒有大尺寸圖片</b></div>";
            imgDiv.style.display = "block";
        }
        else if(code == 4 && isStillOnHover)
        {
            imgDiv.innerHTML = "";
            imgDiv.style.display = "block";
        }
        else if(code == 5)
        {
            imgDiv.style.display = "none";
            imgDiv.innerHTML = "";
        }
    }

})();