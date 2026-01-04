// ==UserScript==
// @name         通用ai语音脚本8测试2
// @namespace    http://tampermonkey.net/
// @version      17
// @license MIT
// @description  使用脚本链接GPT-SoVITS。支持酒馆和www.perplexity.ai
// @author       从前跟你一样
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect       192.168.10.2
// @connect      127.0.0.1
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect         *
// @connect     matce.cn
// @downloadURL https://update.greasyfork.org/scripts/499119/%E9%80%9A%E7%94%A8ai%E8%AF%AD%E9%9F%B3%E8%84%9A%E6%9C%AC8%E6%B5%8B%E8%AF%952.user.js
// @updateURL https://update.greasyfork.org/scripts/499119/%E9%80%9A%E7%94%A8ai%E8%AF%AD%E9%9F%B3%E8%84%9A%E6%9C%AC8%E6%B5%8B%E8%AF%952.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let uRL="http://192.168.10.2:9880";//语音的ip地址。请一并修改上面的@connet 地址
    let PlayOther = true;// 是否播放旁白。是为true，否为false
    let timbre=true;// 是否区分音色。是为true，否为false

    // 存储待播放的音频URL队列
    const audioQueue = {};
    // 存储播放的音频对象
    const audios = {};
    // 是否有音频正在播放
    let isPlaying = false;
    //播放的序号
    let playnum = 0;
    //是否停止接收
    let iscont = true;
    //是否停止播放；
    let isstop = true;
    //正在获取语音
    let iswork=false;
   //正在播放的媒体
    let nowaudio="";

    let clickp="";
    // 存储已经绑定过按钮的 div 元素
    const boundDivs = new Set();
    //用于存放当前播放的div
    let isPlayingDiv = "";
    //即将播放的div
    let nextPlayingDiv = "";

    const statements = {
        元气少女音: "?text=你好&text_lang=中文&ref_audio_path=yuyin/元气少女音/香菱/闲聊/3.闲聊·觅食_嗯，闲着也是闲着，还不如一起找找食材去！.mp3&prompt_text=嗯，闲着也是闲着，还不如一起找找食材去！&prompt_lang=中文&text_split_method=按标点符号切&sweight=SoVITS_weights/xiangling-e15.pth&gweight=GPT_weights/xiangling_e8_s192.ckpt" ,
        大叔音: "?text=你好&text_lang=中文&ref_audio_path=yuyin/大叔音/钟离/闲聊/1.闲聊·旅程_旅程总有一天会迎来终点，不必匆忙。.mp3&prompt_text=旅程总有一天会迎来终点，不必匆忙。&prompt_lang=中文&text_split_method=按标点符号切&sweight=SoVITS_weights/zhongli_e16_s432.pth&gweight=GPT_weights/zhongli-e30.ckpt",
        萝莉音: "?text=你好&text_lang=中文&ref_audio_path=yuyin/萝莉音/可莉/闲聊/1.闲聊·收获_可莉今天又勇敢地抓到了花纹奇怪的蜥蜴！从没见过这种图案，你要看看吗？.mp3&prompt_text=可莉今天又勇敢地抓到了花纹奇怪的蜥蜴！从没见过这种图案，你要看看吗？&prompt_lang=中文&text_split_method=按标点符号切&sweight=SoVITS_weights/keli_e8_s248.pth&gweight=GPT_weights/keli-e15.ckpt",
        正太音: "?text=你好&text_lang=中文&ref_audio_path=yuyin/正太音/班尼特/闲聊/3.闲聊·调侃_俗话说「等在原地是不会有好事发生的」，当然以我的运气来说，往哪里走都一样啦….mp3&prompt_text=俗话说「等在原地是不会有好事发生的」，当然以我的运气来说，往哪里走都一样啦…&prompt_lang=中文&text_split_method=按标点符号切&sweight=SoVITS_weights/bannite_e8_s200.pth&gweight=GPT_weights/bannite-e15.ckpt",
        御姐音: "?text=你好&text_lang=中文&ref_audio_path=yuyin/御姐音/八重神子/闲聊/1.闲聊·创作体裁_最近八重堂穿越异世的小说也太多了，哼，就对自己的世界如此不满吗。.mp3&prompt_text=最近八重堂穿越异世的小说也太多了，哼，就对自己的世界如此不满吗。&prompt_lang=中文&text_split_method=按标点符号切&sweight=SoVITS_weights/bachongshenzi_e8_s256.pth&gweight=GPT_weights/bachongshenzi-e15.ckpt",
        青年音二: "?text=你好&text_lang=中文&ref_audio_path=yuyin/青年音二/达达利亚/闲聊/0.初次见面…_我是愚人众执行官第十一席，「公子」达达利亚。而你——哈，也是能招致纷争之人，实在愉快。我们应该会很合得来吧？.mp3&prompt_text=我是愚人众执行官第十一席，「公子」达达利亚。而你——哈，也是能招致纷争之人，实在愉快。我们应该会很合得来吧？&prompt_lang=中文&text_split_method=按标点符号切&sweight=SoVITS_weights/dadaliya_e8_s200.pth&gweight=GPT_weights/dadaliya-e15.ckpt",
        //  旁白: "?text=你好&text_lang=中文&ref_audio_path=./smoke.wav&prompt_text=啊,是老公啊,啊&prompt_lang=中文&text_split_method=按标点符号切&sweight=SoVITS_weights/smoke_e8_s104.pth&gweight=GPT_weights/smoke-e15.ckpt",
        旁白: "?text=你好&text_lang=中文&ref_audio_path=./smoke.wav&prompt_text=啊,是老公啊,啊&prompt_lang=中文&text_split_method=按标点符号切&sweight=SoVITS_weights/smoke_e4_s52.pth&gweight=GPT_weights/smoke-e15.ckpt",
        青年混混音: "?text=你好&text_lang=中文&ref_audio_path=yuyin/青年混混音/荒泷一斗/闲聊/41.收到赠礼·其二_好！你今天孝敬本大爷的，我都记在账上了。.mp3&prompt_text=好！你今天孝敬本大爷的，我都记在账上了。&prompt_lang=中文&text_split_method=按标点符号切&sweight=SoVITS_weights/huanglongyidou_e8_s248.pth&gweight=GPT_weights/huanglongyidou-e15.ckpt",
        青年音: "?text=你好&text_lang=中文&ref_audio_path=yuyin/青年音/五郎/闲聊/3.闲聊·体格_魁梧的体格是力量的象征，对鼓舞士气也很有帮助。我得再加把劲啊！.mp3&prompt_text=魁梧的体格是力量的象征，对鼓舞士气也很有帮助。我得再加把劲啊！&prompt_lang=中文&text_split_method=按标点符号切&sweight=SoVITS_weights/wulang_e8_s208.pth&gweight=GPT_weights/wulang-e15.ckpt",
        少萝音: "?text=你好&text_lang=中文&ref_audio_path=yuyin/少萝音/迪奥娜/闲聊/47.突破的感受·承_猫的耳朵，听得见地上最细微的脚步声。.mp3&prompt_text=猫的耳朵，听得见地上最细微的脚步声。&prompt_lang=中文&text_split_method=按标点符号切&sweight=SoVITS_weights/diaona_e8_s200.pth&gweight=GPT_weights/diaona-e15.ckpt",
        少年音: "?text=你好&text_lang=中文&ref_audio_path=yuyin/少年音/米卡/闲聊/5.打雷的时候…_雷声可以掩盖行动的声响，是我们的好朋友。.mp3&prompt_text=雷声可以掩盖行动的声响，是我们的好朋友。&prompt_lang=中文&text_split_method=按标点符号切&sweight=SoVITS_weights/mika_e8_s264.pth&gweight=GPT_weights/mika-e15.ckpt",
        少女御音: "?text=你好&text_lang=中文&ref_audio_path=yuyin/少女御音/珐露珊/闲聊/9.早上好…_年轻人，早上就该拿出点精气神来！快重新向我问候一遍。.mp3&prompt_text=年轻人，早上就该拿出点精气神来！快重新向我问候一遍。&prompt_lang=中文&text_split_method=按标点符号切&sweight=SoVITS_weights/falushan_e8_s240.pth&gweight=GPT_weights/falushan-e15.ckpt",
        温柔少女音: "?text=你好&text_lang=中文&ref_audio_path=yuyin/温柔少女音/神里绫华/闲聊/11.中午好…_午安。茶饭之后，难免略有困倦。是否有兴致下盘棋提神呢？.mp3&prompt_text=午安。茶饭之后，难免略有困倦。是否有兴致下盘棋提神呢？&prompt_lang=中文&text_split_method=按标点符号切&sweight=SoVITS_weights/shenlilinghua_e8_s224.pth&gweight=GPT_weights/shenlilinghua-e15.ckpt",
        英气御姐音: "?text=你好&text_lang=中文&ref_audio_path=yuyin/英气御姐音/迪希雅/闲聊/2.闲聊·沙漠_沙漠是个难相处的对手，但至少它足够光明磊落，把所有艰险挑战都放在台面上给你看。.mp3&prompt_text=沙漠是个难相处的对手，但至少它足够光明磊落，把所有艰险挑战都放在台面上给你看。&prompt_lang=中文&text_split_method=按标点符号切&sweight=SoVITS_weights/dixiya_e8_s200.pth&gweight=GPT_weights/dixiya-e15.ckpt",
        御中音: "?text=你好&text_lang=中文&ref_audio_path=yuyin/御中音/迪卢克/闲聊/0.初次见面…_蒙德城的迪卢克，应约而来。闲聊恕不奉陪，如果你是想做一番大事，我倒有点兴致。.mp3&prompt_text=蒙德城的迪卢克，应约而来。闲聊恕不奉陪，如果你是想做一番大事，我倒有点兴致。&prompt_lang=中文&text_split_method=按标点符号切&sweight=SoVITS_weights/diluke2_e8_s240.pth&gweight=GPT_weights/diluke2-e15.ckpt",
        御中音二: "?text=你好&text_lang=中文&ref_audio_path=yuyin/御中音二/赛诺/闲聊/6.打雷的时候…_在一些传说中，雷电是神明对人间降下的审判。.mp3&prompt_text=在一些传说中，雷电是神明对人间降下的审判。&prompt_lang=中文&text_split_method=按标点符号切&sweight=SoVITS_weights/sainuo_e8_s208.pth&gweight=GPT_weights/sainuo-e15.ckpt",
        御中音三: "?text=你好&text_lang=中文&ref_audio_path=yuyin/御中音三/神里绫人/闲聊/4.下雨的时候…_暂且先避下雨吧，不必着急，很快就会有人来送伞了。.mp3&prompt_text=暂且先避下雨吧，不必着急，很快就会有人来送伞了。&prompt_lang=中文&text_split_method=按标点符号切&sweight=SoVITS_weights/shenlilingren_e8_s224.pth&gweight=GPT_weights/shenlilingren-e15.ckpt",
    };





    // 检测并插入播放按钮的函数
    function checkAndInsertPlayButton() {
        const divElements = document.querySelectorAll('.mes_text');
        if(!divElements){
            return;

        }

        // alert(boundDivs.size);

        divElements.forEach(div => {
            if (!boundDivs.has(div)&&!div.textContent.trim().includes("SillyTavern")&&div.parentNode.classList.contains('mes_block') ) {

                if (div.nextSibling&&div.nextSibling.tagName === 'BUTTON') {
                    div.nextSibling.remove();
                }
                const playButton = document.createElement('button');
                var uniqueId = "button_awv" + Math.random().toString(36).substr(2, 9);
                playButton.id = uniqueId;
                playButton.textContent = '播放';
                playButton.style.backgroundColor = '#4CAF50'; // 设置按钮背景颜色
                playButton.style.color = 'white'; // 设置按钮文字颜色
                playButton.style.padding = '8px 16px'; // 设置按钮内边距
                playButton.style.border = 'none'; // 移除按钮边框
                playButton.style.borderRadius = '4px'; // 设置按钮圆角
                playButton.style.cursor = 'pointer'; // 设置鼠标指针样式
                // if(div.nextSibling.textContent=='播放'){
                //    div.nextSibling.remove();
                //    }
                var uniqueId2 = "button_div" + Math.random().toString(36).substr(2, 9);
                div.id=uniqueId2;
                playButton.dataset.link=uniqueId2;

                div.parentNode.insertBefore(playButton, div.nextSibling);

                if(!div.parentNode.hasclik){
                    div.parentNode.hasclik=true;
                    div.parentNode.addEventListener('click',async function(){
                        if (event.target.tagName === 'BUTTON') {
                            // 获取按钮的id

                        }else{

                            return;
                        }

                        var button1=event.target;
                        const div = document.getElementById(button1.dataset.link);
                        if(button1.textContent == '播放'){

                            isstop=false;
                            playnum = 0;
                            audios[isPlayingDiv.id]=[];
                            button1.textContent = '停止';
                            if(nowaudio!=""){

                                nowaudio.pause();

                            }
                            if(isPlayingDiv!=""&&isPlayingDiv!=div){

                                isPlayingDiv.nextSibling.textContent = '播放';

                            }
                            playAudios();

                        }else{
                            isstop=true;

                            button1.textContent = '播放';
                        }

                        nextPlayingDiv = div;
                    });
                   let clickCount = 0;
                    let clickTimer = null;
                   div.parentNode.addEventListener('click',async function(){

                       if (event.target.tagName.toLowerCase() === 'p') {
                           clickCount++;
                           console.log('点击/触摸了 p 标签:', event.target);

                           if (clickCount === 1) {
                               clickp=event.target;
                               clickTimer = setTimeout(function() {
                                   clickCount = 0;
                                   // 单击事件处理（如果需要）

                               }, 300);
                           } else if (clickCount === 2) {
                                if(clickp==event.target){

                               clearTimeout(clickTimer);
                               clickCount = 0;
                               console.log('自定义双击事件触发');
                               event.target.style.color = 'red';
                               const a=splitNarration(event.target.textContent)[0];
                               if(audios==""||isPlayingDiv==""||!isPlaying||!audios[isPlayingDiv.id]){

                                 return ;
                               }
                               audios[isPlayingDiv.id].forEach((item, index)=> {

                               // 在这里添加你想要执行的双击操作

                                if(item[1]==a){


                                    playnum = index;


                                }


                                });
                           }


                           }}


                   });


                }

                boundDivs.add(div); // 将已经绑定过按钮的 div 元素添加到集合中
            }

        });


    }

    // 每隔 5 秒检测一次 div 元素
    setInterval(checkAndInsertPlayButton, 5000);
    setInterval(playNextAudio, 1000);
    //播放div中的音频
    async  function playAudios(){
        if(iswork){

            return;
        }


        if(nextPlayingDiv==""){
            return;
        }
        if(isstop){
            return;
        }
        if(nextPlayingDiv != isPlayingDiv){
            // audioQueue.length = 0;
            audios.length=0;
            playnum = 0;
            isPlayingDiv=nextPlayingDiv;
        }

        const div=isPlayingDiv;
        const text = div.textContent.trim();
        const quotes1 = extractElements(text);

        if(!audios[isPlayingDiv.id]){

            audios[isPlayingDiv.id]=[];
        }

        if(quotes1.length==audios[isPlayingDiv.id].length){
            return;
        }




        let quotes2=[];
        let i = audios.length;
        audios[isPlayingDiv.id]=quotes1;

        for ( i ;i <= quotes1.length-1; i++) {
            quotes2.push(quotes1[i]);

            //  alert("储存");
            //   alert(audios[isPlayingDiv.id][0][0]);
        }
        iswork=true;
        for (const quote of quotes2) {
            if(isstop){
                iswork=false;
                return;
            }
            if(quote[0]=="旁白"&&PlayOther==false){

            }else{
                if(!audioQueue[quote[1]]){
                    if(nextPlayingDiv != isPlayingDiv){
                        iswork=false;
                        return;
                    }
                    await fetchAudioAndAddToQueue(updateUrlWithText(uRL, quote),div,quote[1]);
                }
            }

        }
        iswork=false;
    };
    // 每隔 2秒播放语音
    setInterval(playAudios, 2000);

    // 使用 GM_xmlhttpRequest 获取音频并添加到播放队列
    function fetchAudioAndAddToQueue(url,div,txt) {
        if(isstop){
            iswork=false;
            return Promise.resolve();
        }
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                responseType: 'blob',
                //  signal: abortController.signal,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        const audioUrl = window.URL.createObjectURL(response.response);
                        audioQueue[txt]=audioUrl;
                        if(isstop){
                            iswork=false;
                            reject(new Error('isstop audio'));
                        }
                        resolve();
                    } else {
                        reject(new Error('Failed to load audio'));
                    }
                },
                onerror: function() {
                    reject(new Error('Network error'));
                }
            });
        });
    }

    // 播放队列中的下一个音频
    function playNextAudio(div) {

        if(isstop){
            iswork=false;
            return;
        }
        if(nextPlayingDiv != isPlayingDiv){
            isPlaying = false;
            return;

        }


        if (isPlaying ) {
            return;
        }
        if ( audioQueue.length>0&&audioQueue.length-1 < playnum ){
            //   isPlayingDiv.nextSibling.textContent='播放';
            // alert("2");
            //    isstop=true;
            return;
        }
        if (!isPlayingDiv==""&&!audios[isPlayingDiv.id][playnum] ) {
            return;
        }

        // alert("bof");


        if(audioQueue[audios[isPlayingDiv.id][playnum][0]]=="旁白"&&PlayOther==false){

            playnum=playnum+1;

            if ( audioQueue.length-1 < playnum ){
                isPlayingDiv.nextSibling.textContent='播放';
                // alert("2");
                return;
            }
        }
        const audioUrl = audioQueue[audios[isPlayingDiv.id][playnum][1]]; // 获取队列中的音频URL
        if(!audioUrl){

            return;
        }
        playnum=playnum+1;
        const audio = new Audio(audioUrl);
        isPlaying = true;
        nowaudio=audio;
      //  changeColorByText(audios[isPlayingDiv.id][playnum][1], "red")
        audio.play();
        audio.onended = function() {
            isPlaying = false;
            playNextAudio(div); // 播放完毕后继续播放下一个
        };

    }


    const punctuationRegex = /[….;:!?。；：！？\n\r]/g;

    function splitNarration(narration, isLast = false) {  //分割字符
        const sentences = narration.split(punctuationRegex).map(sentence => sentence.trim()).filter(Boolean);
        if (isLast && !punctuationRegex.test(narration[narration.length - 1])) {
            sentences.pop();
        }
        return sentences;
    }



    function extractElements(text) {  //区分旁白和对话
        text=text.replace(/“|”/g, '"').replace(/（/g, '(').replace(/）/g, ')').replace(/\s*"\s*/g, '"');
        //alert(text);
        let dialogueRegex= /(\(.+?\))"(.+?)"/g;

        const elements = [];
        let match;
        let lastIndex = 0;

        //if((match = dialogueRegex.exec(text)) !== null){
        //不区分音色
        let dialogueRegex2= /"(.+?)"/g;
        while ((match = dialogueRegex2.exec(text)) !== null) {
            const [_, content] = match;
            const character = '对话';

            // 提取话语前的旁白
            const narration = text.slice(lastIndex, match.index).trim();
            if (narration&&PlayOther) {
                const sentences = splitNarration(narration);
                sentences.forEach(sentence => {
                    elements.push(['旁白', sentence]);
                });
            }
            // 提取话语
            const sentences2 = splitNarration(content);
            sentences2.forEach(sentence2 => {
                elements.push([character, sentence2]);
            });

            lastIndex = dialogueRegex2.lastIndex;
        }
        // 提取最后一段旁白
        const finalNarration = text.slice(lastIndex).trim();
        const regex = /"/g;
        let matches =finalNarration.match(regex);
        let goon=false;
        if(matches){
            // alert(matches.length);
            goon=matches.length % 2 === 0;
        }
        if (finalNarration&&(!finalNarration.includes('"')||goon)&&PlayOther ){
            const sentences = splitNarration(finalNarration, true);
            if (sentences.length > 0) {
                const lastSentence = sentences[sentences.length - 1];
                sentences.forEach(sentence => {
                    elements.push(['旁白', sentence]);
                });
            }
        };
        if(elements.length<1){
            elements.push(['旁白', "没有找到对话哦"]);
        }
        return elements;
    }







    // 更新 URL 中的 text 参数
    function updateUrlWithText(uRl, quote) {
        // alert(quote[0]);
        const speak=statements[quote[0]];
        if(speak==null){
            quote[0]="旁白"
        }
        if(speak=="对话"){
            quote[0]="旁白"
        }
        const url=uRl+statements[quote[0]];
        const urlObj = new URL(url);
        urlObj.searchParams.set('text', quote[1]);
        return urlObj.toString();
    }





    //https://fs.firefly.matce.cn/file=
    let wavs = JSON.parse(GM_getValue("wavs", "{}"));

    //GM_getValue("wav", {});
    //let wavs=  GM_setValue("wav", {"aaa":""});
    let a=true;
    let b= true;

    function gee(){
        // alert("chazhao");
        // const element = document.querySelector('.svelte-1gfkn6j');
        const element = document.getElementById('asd');
        if(element&&a){

            alert(element.value)
            // clearInterval(id);
            element.addEventListener('click', function(event) {


                getspeak(element.value,"迪尔菲_JP","sft_new/Genshin_ZH/八重神子/ffcaaba86c71f02b.wav_part277");
            });

            a=false;

        };

        const  element2  = document.getElementById('ads');

        if(element2&&b){
            element2.addEventListener('click', function(event) {

                alert("bof")
                playa();


            });
            b=false;
        }
    }

    function playa(){
        wavs = JSON.parse(GM_getValue("wavs"));
        let arr = [];
        for (let [key, value] of Object.entries(wavs)) {
            //  const audio = new Audio(value);
            //  let audioUrls = Object.values(wavs);
            arr.push(value)
            //    audio.currentTime = 0;
            //   audio.play();

        }

        playSequentially(arr);

    }

    function playSequentially(urls, index = 0) {
        if (index >= urls.length) {
            console.log("所有音频播放完毕");
            return;
        }

        let audio = new Audio(urls[index]);

        audio.onended = function() {
            playSequentially(urls, index + 1);
        };

        audio.onerror = function() {
            console.error("音频加载失败:", urls[index]);
            playSequentially(urls, index + 1);
        };

        audio.play().catch(e => {
            console.error("播放失败:", e);
            playSequentially(urls, index + 1);
        });
    }



    let id=  setInterval(gee, 2000);



    //获取路径
    function  getspeak(txt,name,speak_sft){
        let  session_hash;
        const Speaker = new WebSocket('wss://fs.firefly.matce.cn/queue/join');

        Speaker.onopen = function(event) {
            console.log('Speaker连接已建立');
            const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
            const length = 12;
            let result = '';

            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            session_hash=result;
            // 发送消息给服务器
            //  socket.send('Hello, server!');
        };
        Speaker.onmessage = function(event) {
            var message = event.data;
            var data = JSON.parse(message);
            if (data.msg === "send_hash") {

                const jsonData = {"fn_index":3,"session_hash":session_hash} ;

                const jsonString = JSON.stringify(jsonData);
                Speaker.send(jsonString);
            }
            console.log('收到服务器消息:', event.data);
            if (data.msg === "send_data"){
                const jsonData = {"data":[speak_sft],"event_data":null,"fn_index":3,"session_hash":session_hash} ;
                const jsonString = JSON.stringify(jsonData);
                Speaker.send(jsonString);
            }

            if (data.msg === "process_completed"){

                console.log("txt---"+txt,"data==="+data.output.data[0].name,data.output.data[1]);
                const audioUrl= getwav(txt,data.output.data[0].name,name,data.output.data[1]);


            }

        };

        // 连接关闭时触发
        Speaker.onclose = function(event) {
            console.log('WebSocket连接已关闭');
        };

        // 发生错误时触发
        Speaker.onerror = function(error) {
            console.error('WebSocket发生错误:', error);
        };


    }

    //获取url
    function getwav(txt,wav,name,wavtxt){
        let  session_hash;
        // 创建WebSocket连接
        const socket = new WebSocket('wss://fs.firefly.matce.cn/queue/join');
        // 连接成功建立时触发
        socket.onopen = function(event) {
            console.log('WebSocket连接已建立');
            const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
            const length = 12;
            let result = '';

            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            session_hash=result;
            // 发送消息给服务器
            //  socket.send('Hello, server!');
        };

        // 接收到服务器消息时触发
        socket.onmessage = function(event) {
            var message = event.data;
            var data = JSON.parse(message);
            if (data.msg === "send_hash") {

                const jsonData = {
                    "fn_index": 1,
                    "session_hash": session_hash
                };
                const jsonString = JSON.stringify(jsonData);
                socket.send(jsonString);
            }
            console.log('收到服务器消息:', event.data);
            if (data.msg === "send_data"){

                const jsonData = {"data":[txt,true,{"name":wav,"data":"https://fs.firefly.matce.cn/file="+wav,"is_file":true,"orig_name":"audio.wav"},wavtxt,0,90,0.7,1.5,0.7,name],"event_data":null,"fn_index":4,
                                  "session_hash": session_hash
                                 }
                ;
                const jsonString = JSON.stringify(jsonData);
                socket.send(jsonString);
            }

            if (data.msg === "process_completed"){
                if(data.success==false){
                    return getwav(txt,wav,name,wavtxt)
                }
                console.log(data.output.data[0].name);
                // return data.output.data[1].name;
                const  url="https://fs.firefly.matce.cn/file="+data.output.data[0].name
                console.log("url",url);


                const audioUrl= downloadQueue(url);

                audioUrl.then(audioUrl => {
                    const audio = new Audio(audioUrl);


                    // const wav= GM_getValue("wav");
                    wavs = JSON.parse(GM_getValue("wavs", "{}"));

                    wavs[txt]=audioUrl;

                    GM_setValue("wavs", JSON.stringify(wavs));

                    audio.load();
                    audio.currentTime = 0;
                    audio.play();
                }).catch(error => {
                    console.error('播放音频时发生错误:', error);
                });

                return
            }


        };

        // 连接关闭时触发
        socket.onclose = function(event) {
            console.log('WebSocket连接已关闭');
        };

        // 发生错误时触发
        socket.onerror = function(error) {
            console.error('WebSocket发生错误:', error);
        };
    }

    function downloadQueue(url) {
        //下载音频
        const response = new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                responseType: 'blob',
                //  signal: abortController.signal,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        const audioBlob = new Blob([response.response], { type: 'audio/wav' });
                        const audioUrl = window.URL.createObjectURL(audioBlob);

                        return resolve(audioUrl);
                    } else {
                        reject(new Error('Failed to load audio'));
                    }
                },
                onerror: function() {
                    reject(new Error('Network error'));
                }
            });
        });
        return response;
    }





})();
