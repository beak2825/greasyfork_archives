/*jshint esversion: 6 */

// ==UserScript==
// @name        Script to switch recommended works on pixiv to show only R-18 works
// @name:ja           pixivの関連作品をR-18オンリーと切り替えるスクリプト
// @name:zh-CN     将pixiv上的推荐作品切换为只显示R-18的Script
// @name:ko        pixiv의 관련 작품을 R-18온리와 바꾸는 스크립트
// @description allows you to display only R-18 works in the recommended works at the bottom of the artwork page.
// @description:ja pixivの作品画面の下部に表示される関連作品を、R-18作品に絞って表示することができます。
// @description:zh-cn 它可以让您在作品页面底部的推荐作品中只显示R-18作品。
// @description:ko pixiv의 작품 화면의 하부에 표시되는 관련 작품을, R-18작품으로 좁혀 표시할 수 있습니다.
// @version        0.5.7
// @author         Qappendix
// @license        GPL v3; https://www.gnu.org/copyleft/gpl.html
// @match          *://www.pixiv.net/*
// @grant          GM.setValue
// @grant          GM.getValue
// @namespace https://greasyfork.org/users/724570
// @downloadURL https://update.greasyfork.org/scripts/419760/Script%20to%20switch%20recommended%20works%20on%20pixiv%20to%20show%20only%20R-18%20works.user.js
// @updateURL https://update.greasyfork.org/scripts/419760/Script%20to%20switch%20recommended%20works%20on%20pixiv%20to%20show%20only%20R-18%20works.meta.js
// ==/UserScript==

(function() {
    //変数初期化
    let recommendSection = null;
    let href;
    let artworkUrl = /^(http|https):\/\/(www)?\.pixiv\.net\/artworks\/.*/;

    let isEnabled = GM.getValue('isEnabled', true);
    let isArtworkURL = false;

    let allIllustsSet = new Set();
    let sensitiveIllustsSet = new Set();
    let notSensitiveIllustsSet = new Set();

    ///ボタン要素追加
    let switchButton = document.createElement('button');
    let switchButtonStyle = 'position: fixed; bottom: 10px; right: 10px; padding: 6px 40px; z-index: 101;';
    let ONText = 'R-18 only: ON';
    let OFFText = 'R-18 only: OFF';

    isEnabled ? switchButton.innerHTML = ONText : switchButton.innerHTML = OFFText;

    switchButton.id = 'switch_button';
    switchButton.setAttribute('Style', switchButtonStyle)

    document.body.appendChild(switchButton);

    //非R-18作品閲覧時メッセージ追加
    let messageText = "Viewing work is not R-18 work. R-18 only mode is off.";
    let messageElement = document.createElement('div');
    let messageStyle = 'display: none; width: calc(100vw - (100vw - 100%)); height: 2vh; position: -webkit-sticky; position: sticky; top: 98vh; background-color: gray; z-index: 100;';

    messageElement.id = 'non_R18_Message';
    messageElement.setAttribute('Style', messageStyle)
    messageElement.innerHTML = messageText;
    document.body.prepend(messageElement);

    //ボタンクリック時イベント定義
    switchButton.addEventListener('click', function(){
        isEnabled =! isEnabled;

        if(isEnabled){
            switchButton.innerHTML = ONText;
            recommendObserver.observe(recommendSection, {attributes: true, subtree: true});
            toggleDisplayIllusts();
            toggleNonR18Message();
        }else{
            switchButton.innerHTML = OFFText;
            toggleDisplayIllusts();
            toggleNonR18Message();
        }
        GM.setValue('isEnabled',isEnabled);
    });

    ///MutationObserver定義

    //ページ遷移検出、初期化
    let documentObserver = new MutationObserver( function(){
        if(href !== location.href){
            href = location.href;
            recommendSection = null;
            recommendObserver.disconnect();
            allIllustsSet.clear();
            sensitiveIllustsSet.clear();
            artworkUrl.test(href) ? isArtworkURL = true : isArtworkURL = false;
        }
        if(isArtworkURL){
            updateRecommendSection();
            if(recommendSection){
                recommendObserver.observe(recommendSection, {attributes: true, subtree: true});
                updateIllustsSet(recommendSection);
                toggleDisplayIllusts();
            }
        }
        toggleNonR18Message();
    })

    let recommendObserver = new MutationObserver( function(){
        updateIllustsSet(recommendSection);
        toggleDisplayIllusts();
    })

    //文書全体の変更を監視
    documentObserver.observe(document, {attributes: true, subtree: true});

    ///関数定義

    function updateRecommendSection(){
        for(let section of document.body.getElementsByTagName("section")){
            for(let div of section.getElementsByTagName("div")){
                if(div.textContent == "関連作品" || div.textContent == "おすすめ作品"){
                    recommendSection = section;
                }
            }
        }
    }

    function updateIllustsSet(recom){
        Array.prototype.forEach.call(recom.getElementsByTagName("li"), function(li){
            allIllustsSet.add(li);
            if(li.textContent.indexOf("R-18")!=-1){
                sensitiveIllustsSet.add(li);
            }
        })
        for(let work of allIllustsSet){
            if(!sensitiveIllustsSet.has(work)){
                notSensitiveIllustsSet.add(work);
            }
        }
    }

    function toggleDisplayIllusts(){
        if(sensitiveIllustsSet.size!=0){
            if(isEnabled){
                for(let work of notSensitiveIllustsSet){
                    work.style.display="none";
                }
            }else{
                for(let work of notSensitiveIllustsSet){
                    work.style.display="block";
                }
            }
        }
    }

    function toggleNonR18Message(){
        var non_R18_Message = document.getElementById("non_R18_Message");
        if(allIllustsSet.size!=0){
            if(sensitiveIllustsSet.size==0 && isArtworkURL && isEnabled){
                non_R18_Message.style.display="block";
            }else{
                non_R18_Message.style.display="none";
            }
        }
    }

})()