// ==UserScript==
// @name         有道翻译听写
// @namespace    page
// @version      0.1
// @description  有道翻译进行听写,提升英语能力
// @author       page
// @match        https://fanyi.youdao.com/*
// @icon         <$ICON$>
// @grant        none
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467937/%E6%9C%89%E9%81%93%E7%BF%BB%E8%AF%91%E5%90%AC%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/467937/%E6%9C%89%E9%81%93%E7%BF%BB%E8%AF%91%E5%90%AC%E5%86%99.meta.js
// ==/UserScript==
window.sentense =[];
window.currentIndex=0;
window.word_g="";
(function() {
    'use strict';

    // Your code here...
    //播放声音
    function play(index){
        //重放不请求接口
        if(index==0&&document.getElementsByClassName('voice')[0].src){
            document.getElementsByClassName('voice')[0].currentTime =0
            document.getElementsByClassName('voice')[0].play();
            document.getElementsByClassName('mySentense')[0].focus()
            document.getElementsByClassName('tab-body-border-box')[0].style.display ='none'
            return
        }
        let sum = window.currentIndex + index
        if(sum<0||sum>=window.sentense.length){
            return alert('结束标记')
        }
        window.currentIndex = sum;
        document.getElementsByClassName('voice')[0].src =`https://dict.youdao.com/dictvoice?audio=${window.sentense[sum]}&le=eng`
	document.getElementsByClassName('voice')[0].playbackRate =localStorage.getItem("rate")?localStorage.getItem("rate"):1.0
    document.getElementsByClassName('voice')[0].play();
    document.getElementsByClassName('mySentense')[0].focus()
    document.getElementsByClassName('tab-body-border-box')[0].style.display ='none'

}



    //刷新
    function refresh(){
        window.sentense=[]
        document.getElementsByClassName('checkbox color_text_3')[0].click()
        setTimeout(()=>{
            document.getElementsByClassName('checkbox color_text_3')[0].click()
            setTimeout(()=>{
                //刷新句子
                let text = document.getElementsByClassName('src')

                if(text.length&&window.sentense.length==0){

                    for(let i=0;i<text.length;i++){
                        console.log(text[i].innerHTML)
                        window.sentense.push(text[i].innerHTML)
                    }
                }
                //重置src
                document.getElementsByClassName('voice')[0].src = `https://dict.youdao.com/dictvoice?audio=${window.sentense[0]}&le=eng`
		},1000)
    },1000)

    window.currentIndex = 0
}
    //播放声音
    function voicePlay(){
        if(localStorage.getItem("rate")&&document.getElementsByClassName('rate')[0]){
            document.getElementsByClassName('rate')[0].value = localStorage.getItem("rate")
        }
        let dom = document.getElementById('YOUDAO_SELECTOR_IFRAME').contentDocument.getElementById('title')
        console.log(1)

        if(!dom)return
        if(!document.getElementById('YOUDAO_SELECTOR_IFRAME').contentDocument.getElementsByClassName('voice')[0])window.word_g=''

        let word = dom.innerHTML.split('<')[0]
        if(window.word_g==''){
            if(word != window.word_g){
                dom.innerHTML = dom.innerHTML.replace('<','<span></span><audio class="voice" > </audio><span class="voicePlay" style="cursor: pointer;">🔉</span><')
                document.getElementById('YOUDAO_SELECTOR_IFRAME').contentDocument.getElementsByClassName('voice')[0].src =`https://tts.youdao.com/fanyivoice?word=${word}&le=eng&keyfrom=speaker-target`
			document.getElementById('YOUDAO_SELECTOR_IFRAME').contentDocument.getElementsByClassName('voice')[0].play();
                document.getElementById('YOUDAO_SELECTOR_IFRAME').contentDocument.getElementsByClassName('voicePlay')[0].onclick=()=>{
                    document.getElementById('YOUDAO_SELECTOR_IFRAME').contentDocument.getElementsByClassName('voice')[0].playbackRate =localStorage.getItem("rate")?localStorage.getItem("rate"):1.0;
                    document.getElementById('YOUDAO_SELECTOR_IFRAME').contentDocument.getElementsByClassName('voice')[0].play();
                }
                window.word_g =word;
            }
        }
    }

    function format (text){
        let rule = localStorage.getItem("rule")
        let finalText = text
        for(let i =0;i<rule.length;i++){
            finalText = finalText.replaceAll(rule[i],'')
        }
        return finalText.toUpperCase().trim();
    }


    //初始化
    window.onload=()=>{
        setInterval(()=>{voicePlay()},1000)
        setTimeout(()=>{
            if(localStorage.getItem("rate")&&document.getElementsByClassName('rate')[0]){
                document.getElementsByClassName('rate')[0].value =localStorage.getItem("rate")
            }

            let html =`
			<div>
				<audio class='voice' > </audio>
				<button class = "pre tab-item color_text_3" style="margin-left: 38px;" >播放上一条</button>
				<button class = "current tab-item color_text_3" >播放</button>
				<button class = "next tab-item color_text_3">播放下一条</button>
				<button class = "refresh tab-item color_text_3" >刷新</button>
				<button class = "lookEnglish tab-item color_text_3" >展示</button>
				<input class="rule" value=",!?:."/>
				<select class="rate">
					<option value ="0.5">0.5</option>
					<option value ="0.75">0.75</option>
					<option value ="1.0" selected  =  "selected" >1.0</option>
					<option value="1.25">1.25</option>
				</select>
			</div>
			<span class='successTip' style="font-size: 40px; color: green;font-weight: bold;visibility: hidden;">√</span>
			<input class="mySentense" type="text" style="
					width: 1217px;
					height: 60px;
					font-size: 26px;
					text-align: center;
			">
		`
		document.getElementsByClassName('footer')[0].style.textAlign ='center'
        document.getElementsByClassName('footer')[0].innerHTML = html
        if(localStorage.getItem("rule")&&document.getElementsByClassName('rule')[0]){
            document.getElementsByClassName('rule')[0].value =localStorage.getItem("rule")
        }
        document.getElementsByClassName('mySentense')[0].oninput=(e)=>{
            let text = e.target.value
            let input = text.toUpperCase()

            for(let i =0;i<input.length;i++){
                let phrase = format(window.sentense[window.currentIndex])
                if(input[i] == phrase[i]){
                    document.getElementsByClassName('mySentense')[0].style.color='green'
                    if(phrase.length == i+1){
                        document.getElementsByClassName('successTip')[0].style.visibility=''
                    }else{
                        document.getElementsByClassName('successTip')[0].style.visibility='hidden'
                    }
                }else{
                    document.getElementsByClassName('mySentense')[0].style.color='red'
                    break;
                }
            }
        }
        document.getElementsByClassName('mySentense')[0].onkeydown=(e)=>{
            if(e.key =='ArrowDown'){
                play(0)
            }

            if(e.key =='Enter'&&document.getElementsByClassName('successTip')[0].style.visibility!='hidden'){
                console.log(window.currentIndex , window.sentense.length-1)
                if(window.currentIndex == window.sentense.length-1){
                    document.getElementsByClassName('tab-body-border-box')[0].style.display ='block'
                }else{
                    play(1)
                }
                document.getElementsByClassName('mySentense')[0].value=""
                document.getElementsByClassName('successTip')[0].style.visibility='hidden'
            }
        }
        document.getElementsByClassName('pre')[0].onclick=()=>{
            play(-1)
        }
        document.getElementsByClassName('current')[0].onclick=()=>{
            play(0)
        }
        document.getElementsByClassName('next')[0].onclick=()=>{
            play(1)
        }
        document.getElementsByClassName('refresh')[0].onclick=()=>{
            refresh();
        }
        document.getElementsByClassName('rate')[0].onchange=(e)=>{
            localStorage.setItem("rate",e.target.value)
        }
        document.getElementsByClassName('rule')[0].onchange=(e)=>{
            localStorage.setItem("rule",e.target.value)
        }
        document.getElementsByClassName('lookEnglish')[0].onclick=()=>{
            document.getElementsByClassName('tab-body-border-box')[0].style.display ='block'
        }
        document.getElementById('inputOriginal').oninput=(e)=>{
            //let text = e.target.value.replaceAll('\t',' ')
            //document.getElementById('inputOriginal').value = text.split('.').join('\n')
            //sentense = text.indexOf('\n\n')!=-1? text.split('\n\n') :text.split('\n')
        }
    },2000)

}



})();