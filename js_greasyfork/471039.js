// ==UserScript==
// @name         GPT语音助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  通Hook fetch函数，直接调用微软tts接口。兼容性很强。
// @author       lsamchn
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471039/GPT%E8%AF%AD%E9%9F%B3%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/471039/GPT%E8%AF%AD%E9%9F%B3%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      translate.volcengine.com
// @connect      southeastasia.api.speech.microsoft.com

(function() {
    'use strict';

    if(typeof unsafeWindow === "undefined"){
       var unsafeWindow = window;
        }
    var oldFetch = "fetch" + Math.random()
    unsafeWindow[oldFetch] = unsafeWindow.fetch;
    unsafeWindow.fetch = HookFetch;

/* 这个函数根据请求地址是否为api服务器，自动中间人读取数据包 */
function HookFetch(...args){
    if(!/\/v1\/chat\/completions($|\?[\s\S]*?)/i.test(args[0])){
        return unsafeWindow[oldFetch](...args)
    }
    return new Promise(async function(resolve,reject){
        try{
    var resp = await unsafeWindow[oldFetch](...args);
      }catch(e){reject(e)}
    var reader = resp.body.getReader();
    var stream = (new ReadableStream({
      start(controller) {
        // The following function handles each data chunk
        function push() {
          // "done" is a Boolean and value a "Uint8Array"
          reader.read().then(({ done, value }) => {
            // If there is no more data to read
            if (done) {
              //console.log('done', done);
              controller.close();
                generalWord("。")
              return;
            }
            // Get the data and send it to the browser via the controller
            controller.enqueue(value);
            try{ generalText(value)} catch(e) {console.error(e)}
            // Check chunks by logging to the console
            //console.log(done, value);
            push();
          });
        }
        push();
      },
    }))
     resolve(new Response(stream, {
        headers: resp.headers,
        ok: resp.ok,
        redirected: resp.redirected,
        status: resp.status,
        statusText: resp.statusText,
        type: resp.type,
        url: resp.url,
        bodyUsed: false
    }))

    });
}


var utf8decoder = new TextDecoder();
var totalData = "";
var readIndex = 0;
/* 这个函数用于提取响应JSON中的content值 */
function generalText(data){
    totalData += utf8decoder.decode(data)
            for(let splitData = totalData.split(/(\n|^)data:/);readIndex<splitData.length;readIndex++){
              if(splitData[readIndex]){
                try{
                  var json = JSON.parse(splitData[readIndex])
                  if(json.choices[0].delta.content) {
                      //console.log(json.choices[0].delta.content)
                      generalWord(json.choices[0].delta.content)
                  }
                }catch(e){}

              }
            }
}

var totalText = ""
var Words = [];
/* 这个函数按照标点符号截断文本，以提取完整的句子，流式调用TTS */
function generalWord(text){
totalText += text;
totalText = totalText.split(/。|！|？|\!|\?|，|,|、|：|:|\]|】/)
for(let i=0;i<totalText.length-1;i++){
    var word = totalText.shift().trim();
    if(word) generalSound(word);
}
totalText = totalText.join(',');
}

var audioQueue = [];
var audioQueueX = [];
var speakFuncRunning = false;
/* 这个函数用于给每个句子生成语音 */
function generalSound(word){
audioQueue.push({  text: word  })
    console.log(word)

if(speakFuncRunning) return;
var waitFormuti = 3;
//等待积攒了三个语音再开始播放
setTimeout(() =>{ waitFormuti = 0},1000)
//或者等待3s，使语言更连续
var audio = document.createElement("audio");
if (!speakFuncRunning) { (async function() {
        while (true) {

            try {
                if (audioQueueX.length <= waitFormuti) {
                    await sleep(100);
                    continue;
                }
                waitFormuti = 0;
                var audio_bloburl = await audioQueueX[0].blob;
                audioQueueX.shift()
                /*while (! (audio.duration > 0)) {
                    await sleep(10)
                }*/
                if(audio.src.indexOf("blob:")===0) {
                    var oldsrc= audio.src;
                    //console.log(audio.src)
                    audio.src = audio_bloburl;
                    URL.revokeObjectURL(oldsrc);
                }else{
                    audio.src = audio_bloburl;
                }

                audio.play() ;
                //console.log(audio.duration)
                var ms = await ( new Promise((resolve) => { audio.ontimeupdate=()=>{ if(!audio.duration) return; console.log(`currentTime: ${audio.currentTime} , duration: ${audio.duration}`);audio.ontimeupdate=null;resolve(audio.duration - audio.currentTime) }}))
                console.log(ms)
                await sleep((1000 * ms))
                //await sleep(audio.duration * 1000 - 10)
                //await (()=>{return new Promise((resolve) => {audio.onended=resolve;audio.play();setTimeout(resolve,50000)})})()
            } catch(e) {}
        }

    })();

(async function() {
        while (true) {
            try {
                await sleep(400);
                if (audioQueue.length === 0) continue;

                var audio = audioQueue[0];
                audioQueue.shift()

                if (!audio.blob) audio.blob = autoRefetch(audio.text).then(response =>{
                   // console.log("已加载：" + url);
                    return response//response.blob()
                })/*.then(blob =>{

                    return URL.createObjectURL(blob);
                })*/
                audioQueueX.push(audio)

                //
                //await (()=>{return new Promise((resolve) => {audio.onended=resolve;audio.play()})})()


            } catch(e) {}
        }

    })()
}

    speakFuncRunning = true;
    }


/* 自动重试函数 */
function autoRefetch(speak_text,retries = 10) {
    return runAsync(speak_text).
    catch(error =>{
        if (retries === 0) {
            throw error;
        }
        console.log(`Retrying ${retries} retries left.`);
        return autoRefetch(speak_text, retries - 1);
    });
}

/*function runAsync(speak_text) {
    //["zh_male_rap","zh_male_zhubo","zh_female_zhubo","tts.other.BV021_streaming","tts.other.BV026_streaming","tts.other.BV025_streaming","zh_female_sichuan","zh_male_xiaoming","zh_female_qingxin","zh_female_story"]
    var p = new Promise((resolve, reject)=> {
GM_xmlhttpRequest({
  method: "POST",
  url: "https://translate.volcengine.com/web/tts/v1/",
  headers: {
        "Content-Type": "application/json"
   },
  data:JSON.stringify({"text":speak_text,"speaker":"tts.other.BV025_streaming","language":"zh"}),
  onload: function(response){
      //console.log("请求成功");
      //console.log(response.responseText);

      resolve("data:audio/wav;base64,"+JSON.parse(response.responseText).audio.data);

  },
   onerror: function(response){
    //console.log("请求失败");
       reject("请求失败");
  }
});
    })
    return p;
  }*/
async function runAsync(speak_text) {
    return tts(speak_text)
}

/*
function runAsync(speak_text) {
var p = new Promise((resolve, reject)=> {
GM_xmlhttpRequest({
  method: "POST",
    responseType: 'blob',
  url: "https://southeastasia.api.speech.microsoft.com/accfreetrial/texttospeech/acc/v3.0-beta1/vcg/speak",
  headers: {
        "Content-Type": "application/json",
      'Origin': 'https://speech.microsoft.com'
   },
  data:JSON.stringify({"ssml":"<!--ID=B7267351-473F-409D-9765-754A8EBCDE05;Version=1|{\"VoiceNameToIdMapItems\":[{\"Id\":\"5f55541d-c844-4e04-a7f8-1723ffbea4a9\",\"Name\":\"Microsoft Server Speech Text to Speech Voice (zh-CN, XiaoxiaoNeural)\",\"ShortName\":\"zh-CN-XiaoxiaoNeural\",\"Locale\":\"zh-CN\",\"VoiceType\":\"StandardVoice\"},{\"Id\":\"26014551-90d7-4f55-a622-779b8263e006\",\"Name\":\"Microsoft Server Speech Text to Speech Voice (zh-CN, YunyeNeural)\",\"ShortName\":\"zh-CN-YunyeNeural\",\"Locale\":\"zh-CN\",\"VoiceType\":\"StandardVoice\"},{\"Id\":\"1011ca97-3e33-4e7c-8dda-a22dc244bafc\",\"Name\":\"Microsoft Server Speech Text to Speech Voice (zh-CN, YunxiNeural)\",\"ShortName\":\"zh-CN-YunxiNeural\",\"Locale\":\"zh-CN\",\"VoiceType\":\"StandardVoice\"}]}-->\n<speak version=\"1.0\" xmlns=\"http://www.w3.org/2001/10/synthesis\" xmlns:mstts=\"http://www.w3.org/2001/mstts\" xmlns:emo=\"http://www.w3.org/2009/10/emotionml\" xml:lang=\"zh-CN\"><voice name=\"zh-CN-XiaoxiaoNeural\"><mstts:express-as style=\"chat\">"+JSON.stringify(speak_text)+"</mstts:express-as></voice></speak>","ttsAudioFormat":"audio-16khz-32kbitrate-mono-mp3","offsetInPlainText":0,"lengthInPlainText":131,"properties":{"SpeakTriggerSource":"AccTuningPagePlayButton"}}),
  onload: function(response){
      //console.log("请求成功");
      console.log(response);
      var blob_url = URL.createObjectURL(response.blob())
console.log(blob_url)
      resolve(blob_url);

  },
   onerror: function(response){
    console.log("请求失败");
       reject("请求失败");
  }
});
    })
    return p;
  }*/

/* 经典sleep函数 */
function sleep(time) {
    return new Promise((resolve) =>{
        setTimeout(() =>{
            resolve();
        }, time);
    });
}


    unsafeWindow.tts = tts;
   var ws_clients_num = 0;
    var ws_clients =[];
    var ws_pool = [];
   var  lookuprunning=false;
    async function lookup(){
        var counts = 3;
        for(let i=0;i<counts;i++){
            ws_pool.push(await newWS());

        }

        while(true){
            await sleep(200);

            if(ws_pool.length>counts) {
                ws_pool = ws_pool.slice(-counts)
            }
            while (ws_clients_num<counts && ws_clients.length>0){
                console.log(666)
                var resolve = ws_clients.shift()
                if(resolve) resolve();
            }
        }
    }

         function tts(speak_text)
         {
             if(lookuprunning === false){
                 lookuprunning = true;
                 lookup()
             }

             return new Promise(async (resolve,reject)=>{
            if (!("WebSocket" in window))
            {
              reject("您的浏览器不支持 WebSocket!");
                return
            }
               // 打开一个 web socket
             try{
                 await (new Promise((resolve111)=>{
                 ws_clients.push(resolve111)
                 }))
                 var ws ;
                 for(ws=ws_pool.shift();!(ws&&ws.readyState === ws.OPEN); ws=ws_pool.shift()){
                     if(ws_pool.length===0){
                         ws_pool.push(await newWS())
                     }else{
                         newWS().then(e=>{ws_pool.push(e)})
                     }
                 }
                ws_clients_num += 1;
             }catch(e){
                 reject(e)
                 console.error(e)
                 return
             }
        var _voice = "zh-CN-XiaoxiaoNeural"
			 var _voiceLocale = "zh-CN"
             //<prosody pitch="+0Hz" rate="50" volume="80"></prosody>
            var d = unsafeWindow.document.createElement('div');
                 d.textContent= speak_text;
                speak_text =  d.innerHTML;
				var requestSSML = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${_voiceLocale}"><voice name="${_voice}"><prosody pitch="+0Hz" rate="1.4" volume="80">${speak_text}</prosody></voice></speak>`;
var  requestId = (Math.random()+"8").substring(2,18)+(Math.random()+"8").substring(2,18);
        var  request = `X-RequestId:${requestId}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${Date.now()}Z\r\nPath:ssml\r\n\r\n` + requestSSML.trim();
ws.send(request)
             var mp3_blob = new Blob([],{type:"audio/mpeg"});
                 var blob_url ="";
               ws.onmessage = function (evt)
               {
                  var received_msg = evt.data;
				  if(typeof evt.data !== "string"){
					  mp3_blob = new Blob([mp3_blob,evt.data.slice(130)],{type:"audio/mpeg"});
					//console.log(evt.data)
			   }else{
				   //console.log(666,mp3_blob.size)
				   if(mp3_blob.size>0){
					   blob_url = URL.createObjectURL(mp3_blob);
                       //ws.close()
                       ws_clients_num -= 1;
                       ws_pool.push(ws)
					   resolve(blob_url)
					   //console.log(blob_url)
				   }
			   }
                 // alert("数据已接收...");
               };
ws.onerror = function(evt) {
 setTimeout(async()=>{
                       if(!blob_url){
                       console.error(evt);
                       ws_clients_num -= 1;
                      reject(evt);
ws_pool.push(await newWS())
                   }
                   },2000);

    };
               ws.onclose = async function()
               {
                  // 关闭 websocket
                  //alert("连接已关闭...");
                   //ws_pool.push(await newWS())
                   setTimeout(async ()=>{
                       if(!blob_url){
                       console.error("连接意外关闭");
                       ws_clients_num -= 1;
                       reject("连接意外关闭");
ws_pool.push(await newWS())
                   }
                   },2000);


               };
            }

         );
         }


    function newWS(){



        return new Promise((resolve)=>{
        var ws = new WebSocket("wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=6A5AA1D4EAFF4E9FB37E23D68491D6F4");
            ws.onerror =async function(evt) {
                ws.onopen = ()=>{}
                await sleep(100)
      resolve( await newWS())

    };

         ws.onopen = function()
               {
                  ws.send(`Content-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n{
                        "context": {
                            "synthesis": {
                                "audio": {
                                    "metadataoptions": {
                                        "sentenceBoundaryEnabled": false,
                                        "wordBoundaryEnabled": false
                                    },
                                    "outputFormat": "audio-24khz-48kbitrate-mono-mp3"
                                }
                            }
                        }
                    }`);
                  //alert("数据发送中...");
resolve(ws)
               };
})
    }


})();