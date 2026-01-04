// ==UserScript==
// @name            exmail.qq.com_contacts_plus
// @description     通讯录增强，在邮件列表展示头像（需要先进通讯录收集头像）
// @version         1.5
// @namespace       https://wanyaxing.com/blog/20190123201508.html
// @author          wyx@wanyaxing.com
// @include         https://exmail.qq.com/cgi-bin/mail_list*
// @include         https://exmail.qq.com/cgi-bin/laddr_list*
// @include         https://exmail.qq.com/cgi-bin/readmail*
// @grant           GM_getValue
// @grant           GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/377058/exmailqqcom_contacts_plus.user.js
// @updateURL https://update.greasyfork.org/scripts/377058/exmailqqcom_contacts_plus.meta.js
// ==/UserScript==


function setCheckout(check,fuc,time){
    if (check())
    {
        fuc();
    }
    else
    {
        setTimeout(function(){
            setCheckout(check,fuc,time);
        },time);
    }
}

function bindImageEvent(imgNode)
{
    imgNode.onmouseover = function(event){
        hintImageShow(this,event);
    }
    imgNode.onmouseout = function(event){
        hintImageHide(this,event);
    }
    imgNode.onclick = function(event){
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                }
}

function hintImageShow(imgNode,event)
{
    console.log(imgNode,event);
    var hintNode = document.getElementById('hint_with_mouse');
    if (!hintNode)
    {
        hintNode = document.createElement('div');
        hintNode.setAttribute('id','hint_with_mouse');
        hintNode.style.cssText = 'position:absolute;z-index:999999;';
        document.body.append(hintNode);
    }
    hintNode.innerHTML='<img src="'+imgNode.getAttribute('src')+'"/>';
    hintNode.style.left = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft + 6 +'px';
    hintNode.style.top = event.clientY + document.body.scrollTop + document.documentElement.scrollTop + 9 +'px';
    hintNode.style.display="block";
}

function hintImageHide(imgNode,event)
{
    var hintNode = document.getElementById('hint_with_mouse');
    if (hintNode)
    {
        hintNode.style.display="none";
    }
}

// 遍历存储头像
if (document.querySelector('.contacts #list')) {
    var needCheckLis;
    function checkPhotos()
    {
        needCheckLis = [];
        document.querySelectorAll('#list li[data-id]').forEach(function(liNode){
            var email = liNode.querySelector('.email').innerText;
            email = email.replace(/;.*/,'');
            var photo = GM_getValue(email + '_photo');
            if (!photo || liNode.className=='item_current')
            {
                needCheckLis.push(liNode);
            } else {
                var imgNode = document.createElement('img');
                imgNode.src=photo;
                imgNode.style.cssText = '    height: 100%;position: absolute;left: 50px;';
                var nameNode = liNode.querySelector('.name');
                nameNode.style.cssText = 'position:relative;';
                nameNode.appendChild(imgNode);
            }
        });
    }

    function getBase64Image(img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var dataURL = canvas.toDataURL("image/png");
        return dataURL; // return dataURL.replace("data:image/png;base64,", "");
    }

    function checkEmailIds()
    {
        if (needCheckLis.length>0) {
            var liNode = needCheckLis.shift();
            var email = liNode.querySelector('.email').innerText;
            liNode.click();
            setCheckout(function(){
                return document.querySelector('.detail_mail') && email.indexOf(document.querySelector('.detail_mail').innerText)>=0;
            },function(){
                var imgNode = document.querySelector('.avatar_img');
                if (imgNode && imgNode.getAttribute('src').indexOf('default')<0) {
                    var dataURL = getBase64Image(imgNode);
                    document.querySelectorAll('.detail_mail').forEach(function(child){
                        var detail_mail = child.innerText;
                        GM_setValue(detail_mail + '_photo',dataURL);
                    });
                }
                var nameNode = document.querySelector('.info_name');
                if (nameNode) {
                    document.querySelectorAll('.detail_mail').forEach(function(child){
                        var detail_mail = child.innerText;
                        GM_setValue(detail_mail + '_name',nameNode.innerText);
                    });
                }
                // console.log(imgNode.getAttribute('src'),GM_getValue(email + '_photo'));
                checkEmailIds();
            },1000);
        }
    }

    var aNode = document.createElement('a');
    aNode.innerHTML = '遍历刷新头像';
    aNode.className="button_gray ft_topbar_btn";
    aNode.onclick = function(){
        checkPhotos();
        checkEmailIds();
    }
    document.querySelector('#bar .tool').appendChild(aNode);

    checkPhotos();
}


// 邮件列表简情处理
if (document.getElementById('frm')) {

    function  checkEmailAvatar() {
        document.getElementById('frm').querySelectorAll('.toarea>table').forEach(function(child){
            var formNode       = child.querySelector('.tl');

            var email = formNode.getAttribute('title');
            if (formNode.innerText.indexOf('@')!==false){
                var name = GM_getValue(email + '_name');
                if (name) {
                    formNode.querySelector('nobr').innerHTML = name;
                }
            }
            var photo = GM_getValue(email + '_photo');
            if (photo) {
                var imgNode = document.createElement('img');
                imgNode.src=photo;
                imgNode.style.cssText = 'height: 18px;right: 60px;position:absolute;z-index:99999;';
                formNode.style.cssText = 'position:relative;';
                bindImageEvent(imgNode);
                formNode.appendChild(imgNode);
            }
        });
    }

    setTimeout(function(){
         checkEmailAvatar();
    },1);
}


//邮件详情显示头像
if (document.getElementById("mainmail"))
{
    document.querySelectorAll('span[e]').forEach(function(itemNode){
        var email = itemNode.getAttribute('e');
        var photo = GM_getValue(email + '_photo');
        if (photo) {
            var imgNode = document.createElement('img');
            imgNode.src=photo;
            imgNode.style.cssText = 'height: 15px;position: relative;top: 2px;';
            bindImageEvent(imgNode);
            itemNode.insertBefore(imgNode,itemNode.firstChild);
        }
    });
    document.querySelectorAll('#contentDiv a').forEach(function(itemNode){
        var href = itemNode.getAttribute('href');
        if (href && href.indexOf('mailto:')==0){
            var email = href.replace('mailto:','');
            var name = GM_getValue(email + '_name');
            if (name) {
                itemNode.innerHTML = '<span>'+name + '&lt;' + email + '&gt;'+'</span>';
            }
            var photo = GM_getValue(email + '_photo');
            if (photo) {
                var imgNode = document.createElement('img');
                imgNode.src=photo;
                imgNode.style.cssText = 'height: 15px;position: relative;top: 2px;';
                bindImageEvent(imgNode);
                if (itemNode.firstChild){
                    itemNode.insertBefore(imgNode,itemNode.firstChild);
                } else {
                    itemNode.append(imgNode);
                }
            }
        }
    });

}
