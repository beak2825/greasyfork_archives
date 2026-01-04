// ==UserScript==
// @name         Gartic AI BOT
// @namespace    https://greasyfork.org/en/users/1353946-stragon-x
// @version      1.1
// @description  Gartic AI bot
// @author       STRAGON
// @match        https://Gartic.io/*
// @icon         https://pngimg.com/d/ai_PNG4.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530160/Gartic%20AI%20BOT.user.js
// @updateURL https://update.greasyfork.org/scripts/530160/Gartic%20AI%20BOT.meta.js
// ==/UserScript==

(function() {
    let originalSend = WebSocket.prototype.send, setTrue = false;
    window.wsObj = {};
    let firstValue = "";
    let firstValuex = "";

    WebSocket.prototype.send = function(data) {
        console.log("Gönderilen Veri: " + data);
        originalSend.apply(this, arguments);
        if (Object.keys(window.wsObj).length == 0) {
            window.wsObj = this;
            window.eventAdd();
        }
    };

    window.eventAdd = () => {
        if (!setTrue) {
            setTrue = 1;
            window.wsObj.addEventListener("message", (msg) => {
                try {


if (msg.data.indexOf('42["5"') !== -1) {
                            let dataString = msg.data.slice(2);
                            let data = JSON.parse(dataString);
                             if (data.length > 1) {
                                  let firstValue2 = data[1];
                               firstValuex =firstValue2 ;
                             }

                         }

                     if (msg.data.indexOf('42["11"') !== -1) {
                            let dataString = msg.data.slice(2);
                            let data = JSON.parse(dataString);
                             if (data.length > 1) {
                                  let extractedValue = data[1];
                               console.log(extractedValue);
                                  let masage = data[2];
                               let trimmedMessage = masage.trim();
                               if (extractedValue !== firstValuex) {

                               function kooni() {
                                     let messageToSend = `42[11,${window.wsObj.id},"گاییدمت تو گونی 😂"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                   function kooni2() {
                                     let messageToSend = `42[11,${window.wsObj.id},"کونی خودتی 😒🙄"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                   function kooni3() {
                                     let messageToSend = `42[11,${window.wsObj.id},"اینقدر لقبتو صدا نزن 🙄"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                 function salam() {
                                     let messageToSend = `42[11,${window.wsObj.id},"سلام زندگیم 😍"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                   function salam2() {
                                     let messageToSend = `42[11,${window.wsObj.id},"علیک سلام"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                   function salam3() {
                                     let messageToSend = `42[11,${window.wsObj.id},"صلم خبی؟"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                 function kir() {
                                     let messageToSend = `42[11,${window.wsObj.id},"اینقدر کیر کیر نکن دول موشی"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                   function kir2() {
                                     let messageToSend = `42[11,${window.wsObj.id},"واسه تو هسته خرماست"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                   function kir3() {
                                     let messageToSend = `42[11,${window.wsObj.id},"خندت نمیگیره به اون 5 سانت میگی کیر 😂"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                 function zhoan() {
                                     let messageToSend = `42[11,${window.wsObj.id},"ژوآن رو که خدا بیامرزه"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                   function zhoan2() {
                                     let messageToSend = `42[11,${window.wsObj.id},"یادش بخیر ژوآن یه مدت رو عزتی کراش بود"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                   function zhoan3() {
                                     let messageToSend = `42[11,${window.wsObj.id},"دختر خوبی بود برا شادیش صلوات"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                 function amin() {
                                     let messageToSend = `42[11,${window.wsObj.id},"یاشاسین امین"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                   function amin2() {
                                     let messageToSend = `42[11,${window.wsObj.id},"باز امین رو کی کراش زده 😒"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                   function amin3() {
                                     let messageToSend = `42[11,${window.wsObj.id},"امین کجاس که من ندیدمش"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                 function abol() {
                                     let messageToSend = `42[11,${window.wsObj.id},"ابول که هست پس صد در صد امین هم تو رومه"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                   function abol2() {
                                     let messageToSend = `42[11,${window.wsObj.id},"هی ابول میخواستی بات بیاری پس چیشد😏"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                   function abol3() {
                                     let messageToSend = `42[11,${window.wsObj.id},"ابول شوهر مامان جواد رو میگی؟"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                 function sher() {
                                     let messageToSend = `42[11,${window.wsObj.id},"بزار شعر بگم (ای خلیفه کون تاقال لالالای لالای لای)🕺💃"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                   function sher2() {
                                     let messageToSend = `42[11,${window.wsObj.id},"بزار شعر بگم (تتتپتتت  زیدت به من پامیده تتتپتتت من ازهمتون قوی ترم)"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                   function sher3() {
                                     let messageToSend = `42[11,${window.wsObj.id},"بزار شعر بگم (گوز میرینمو اشک میریزم اشک میریزم دوغ میگوزم)"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                 function robat() {
                                     let messageToSend = `42[11,${window.wsObj.id},"ربات خودتی 🙄"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                   function robat2() {
                                     let messageToSend = `42[11,${window.wsObj.id},"چرت نگو من ربات نیستم"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                   function robat3() {
                                     let messageToSend = `42[11,${window.wsObj.id},"همین کم مونده بود این عقب مونده بهم بگه ربات 😂"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                 function hey() {
                                     let messageToSend = `42[11,${window.wsObj.id},"اینقدر نگو هعی مگه اسهالی"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                   function hey2() {
                                     let messageToSend = `42[11,${window.wsObj.id},"هعی و زهر مار"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                   function hey3() {
                                     let messageToSend = `42[11,${window.wsObj.id},"هعی نکش دردت به جونم چیزی شده ؟😊"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                 function kik() {
                                     let messageToSend = `42[11,${window.wsObj.id},"گوزو اینقدر کیک نکن"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                   function kik2() {
                                     let messageToSend = `42[11,${window.wsObj.id},"با یه کیک چه گوهی میخوای بخوری ؟"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                   function kik3() {
                                     let messageToSend = `42[11,${window.wsObj.id},"هرکیو به جز من خواستید کیک کنید 🙄"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                 function batman() {
                                     let messageToSend = `42[11,${window.wsObj.id},"بتمن که منم 😂"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                   function batman2() {
                                     let messageToSend = `42[11,${window.wsObj.id},"اسم منو از کجا میدونی؟🙄"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                   function batman3() {
                                     let messageToSend = `42[11,${window.wsObj.id},"ای بابا لورفتم که بتمنم😂"]`;
                                  window.wsObj.send(messageToSend);
                                    }

                                 function yasan() {
                                     let messageToSend = `42[11,${window.wsObj.id},"اوه یاسی جنتلمن"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                   function yasan2() {
                                     let messageToSend = `42[11,${window.wsObj.id},"یاسان رل زدو من هنوز پسرم 😔"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                   function yasan3() {
                                     let messageToSend = `42[11,${window.wsObj.id},"اوف یاسان بتمن 🤤"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                               function denise() {
                                     let messageToSend = `42[11,${window.wsObj.id},"دنیز نه تنیس"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                   function denise2() {
                                     let messageToSend = `42[11,${window.wsObj.id},"تنیس سینگل به گوره "]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                   function denise3() {
                                     let messageToSend = `42[11,${window.wsObj.id},"دنیز الچه"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                               function vida() {
                                     let messageToSend = `42[11,${window.wsObj.id},"اوف ویدا عشقم کجاست ؟"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                   function vida2() {
                                     let messageToSend = `42[11,${window.wsObj.id},"به به خانوم دکتر "]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                   function vida3() {
                                     let messageToSend = `42[11,${window.wsObj.id},"ویدا شوگر خوبیه"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                               function rel() {
                                     let messageToSend = `42[11,${window.wsObj.id},"سگ بهت پا نمیده رل رل چیه میگی"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                   function rel2() {
                                     let messageToSend = `42[11,${window.wsObj.id},"با کی رل زدی شیطون 😏"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                   function rel3() {
                                     let messageToSend = `42[11,${window.wsObj.id},"اینقدر رل رل نکنید منم دلم میخواد 🙄😒"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                               function eshgh() {
                                     let messageToSend = `42[11,${window.wsObj.id},"عشق چیه دیگه آخه 🙄"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                   function eshgh2() {
                                     let messageToSend = `42[11,${window.wsObj.id},"به نام خدا گفتیم و عشق آغاز شد ❤️"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                   function eshgh3() {
                                     let messageToSend = `42[11,${window.wsObj.id},"عاشق هرکی هم بشی عشقت یه طرفس دلقک 🙄😒"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                  function khabari() {
                                     let messageToSend = `42[11,${window.wsObj.id},"بکیرم"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                   function khabari2() {
                                     let messageToSend = `42[11,${window.wsObj.id},"نه بابا ناموسا؟ 😯"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                   function khabari3() {
                                     let messageToSend = `42[11,${window.wsObj.id},"اگه نگم به کیرم دق میکنم میمیرم"]`;
                                  window.wsObj.send(messageToSend);
                                    }



                               if (trimmedMessage.includes("کونی")) {
                                  const functions = [kooni, kooni2, kooni3];
                                  const randomFunction = functions[Math.floor(Math.random() * functions.length)];
                                    randomFunction();
                            }
                                  if (trimmedMessage.includes("سلام")) {
                                  const functions = [salam, salam2, salam3];
                                  const randomFunction = functions[Math.floor(Math.random() * functions.length)];
                                    randomFunction();

                            }
                                 if (trimmedMessage.includes("خوبی")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"خوبم تو چطوری؟"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                  if (trimmedMessage.includes("خوبم")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"خب خداروشکر"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                 if (trimmedMessage.includes("بد نیستم")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"همیشه خوب باشی❤️"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                  if (trimmedMessage.includes("سخته")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"کی گفته سخته؟🙄"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                   if (trimmedMessage.includes("بلدم")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"هی بلدم بلدم نکن"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                   if (trimmedMessage.includes("بخدا")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"قسم دروغ نخور"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                 if (trimmedMessage.includes("مریض شدم")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"خب به کیرم 😂"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                 if (trimmedMessage.includes("کیر")) {
                                  const functions = [kir, kir2, kir3];
                                  const randomFunction = functions[Math.floor(Math.random() * functions.length)];
                                    randomFunction();
                            }
                                  if (trimmedMessage.includes("جون")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"بوس بده 😘"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                   if (trimmedMessage.includes("آه")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"مگه توشه که آه میکشی"]`;
                                  window.wsObj.send(messageToSend);
                            }

                                 if (trimmedMessage.includes("چخبر")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"خبری نیست سلامتی"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                  if (trimmedMessage.includes("مرسی")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"میزنیم در کونت آدامس خرسی"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                 if (trimmedMessage.includes("ژوآن")) {
                                  const functions = [zhoan, zhoan2, zhoan3];
                                  const randomFunction = functions[Math.floor(Math.random() * functions.length)];
                                    randomFunction();
                            }
                                   if (trimmedMessage.includes("ژوان")) {
                                  const functions = [zhoan, zhoan2, zhoan3];
                                  const randomFunction = functions[Math.floor(Math.random() * functions.length)];
                                    randomFunction();
                            }
                                  if (trimmedMessage.includes("آرین")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"اوبیه"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                  if (trimmedMessage.includes("ارین")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"ننش جندس"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                  if (trimmedMessage.includes("چیتا")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"همون کشاورزه؟"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                   if (trimmedMessage.includes("استراگون")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"شاه منه"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                  if (trimmedMessage.includes("حاج علی")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"بزرگ ماس"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                 if (trimmedMessage.includes("علیرضا")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"علیرضا چیه بگو ارباب دهنت عادت کنه"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                 if (trimmedMessage.includes("امین")) {
                                  const functions = [amin, amin2, amin3];
                                  const randomFunction = functions[Math.floor(Math.random() * functions.length)];
                                    randomFunction();
                            }
                                  if (trimmedMessage.includes("ارباب")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"آفرین دیدی چقدر زود عادت کردی"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                   if (trimmedMessage.includes("ابول")) {
                                  const functions = [abol, abol2, abol3];
                                  const randomFunction = functions[Math.floor(Math.random() * functions.length)];
                                    randomFunction();
                            }
                                  if (trimmedMessage.includes("گارتیک")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"کیری ترین گیم قرن"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                    if (trimmedMessage.includes("خسته نباشی")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"موفق باشی 😁🫡"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                  if (trimmedMessage.includes(".")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"میدونیم تو رومی لازم نیست نقطه بفرستی"]`;
                                  window.wsObj.send(messageToSend);
                            }

                                 if (masage === "کون") {
                                      let messageToSend3 = `42[11,${window.wsObj.id},"کون کجاست ؟ کی میده؟"]`;
                                  window.wsObj.send(messageToSend3);
                                      }

                                 if (trimmedMessage.includes("ممه")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"سایز چند ؟"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                  if (trimmedMessage.includes("نفهمیدم")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"کصخلی دیگه"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                 if (trimmedMessage.includes("چطوری")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"خوبم تو چطوری"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                  if (trimmedMessage.includes("ساک")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"تو ساک بزن من کیف میزنم 🫡"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                  if (trimmedMessage.includes("پشم")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"مگه پشم هم داری سفید برفی"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                 if (trimmedMessage.includes("نفسم")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"عشقم زندگیم ❤️😍😘🥰"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                  if (trimmedMessage.includes("شعر")) {
                                  const functions = [sher, sher2, sher3];
                                  const randomFunction = functions[Math.floor(Math.random() * functions.length)];
                                    randomFunction();
                            }
                                 if (trimmedMessage.includes("پسر")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"کو کو پسر کو"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                 if (trimmedMessage.includes("دختر")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"ای بابا دختر کجا بود"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                  if (trimmedMessage.includes("برم")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"اره برو 🙄"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                 if (trimmedMessage.includes("بتمن")) {
                                  const functions = [batman, batman2, batman3];
                                  const randomFunction = functions[Math.floor(Math.random() * functions.length)];
                                    randomFunction();
                            }
                                  if (trimmedMessage.includes("هیبت الله")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"من دیدمش خیلی بزرگه 🤤"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                  if (trimmedMessage.includes("امیر")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"امیرا لاشین"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                   if (trimmedMessage.includes("میکنه")) {
                                  const functions = [khabari, khabari2, khabari3];
                                  const randomFunction = functions[Math.floor(Math.random() * functions.length)];
                                    randomFunction();
                            }
                          if (trimmedMessage.includes("بوس")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"بوس به لبات 😘"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                 if (trimmedMessage.includes("کصکش")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"سرشو بیگر با دسکش🧨"]`;
                                  window.wsObj.send(messageToSend);
                            }

                                if (trimmedMessage.includes("جواد")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"کص ننه جواد"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                if (trimmedMessage.includes("مهشید")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"این دیگه کدوم کصخلیه 😒"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                if (trimmedMessage.includes("یاسان")) {
                                  const functions = [yasan, yasan2, yasan3];
                                  const randomFunction = functions[Math.floor(Math.random() * functions.length)];
                                    randomFunction();
                            }
                               if (trimmedMessage.includes("بخورم")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"بخورش 😁"]`;
                                  window.wsObj.send(messageToSend);
                            }
                               if (trimmedMessage.includes("دنیز")) {
                                  const functions = [denise, denise2, denise3];
                                  const randomFunction = functions[Math.floor(Math.random() * functions.length)];
                                    randomFunction();
                            }

                               if (trimmedMessage.includes("دوست دارم")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"منم همنینطور عشقم ❤️"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                  if (trimmedMessage.includes("ملینا")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"اونو که میشه با یه شیر کاکائو خریدش😂"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                   if (trimmedMessage.includes("خنده")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"😂😂😂😂😂😂😂"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                   if (trimmedMessage.includes("اومدم")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"خوش اومدی عشقم 😍❤️"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                 if (trimmedMessage.includes("تو کی")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"پدرت"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                  if (trimmedMessage.includes("شماره")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"چه زودم شماره میخواد 🙄😒"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                 if (trimmedMessage.includes("شب بخیر")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"شب بخیر نفسم ❤️"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                  if (trimmedMessage.includes("شبخوش")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"شبخوش حالا برو بکپ"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                 if (trimmedMessage.includes("85")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"اووف چه بزرگ هم هست 😍🤤"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                 if (trimmedMessage.includes("اوف")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"وقتی میگی اوف یه جوری میشم🤤"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                 if (trimmedMessage.includes("گوز")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"گوز خشک یا آبکی؟"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                  if (trimmedMessage.includes("خشک")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"بازم خوبه خشکه 🙄"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                 if (trimmedMessage.includes("آبکی")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"پس اسهالی"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                 if (trimmedMessage.includes("ابکی")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"پس اسهالی"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                  if (trimmedMessage.includes("ریدم")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"اره بوش هم میاد 🤮🤢"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                 if (trimmedMessage.includes("مار")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"مار دارم میخوای ببینیش"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                  if (trimmedMessage.includes("اره")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"چه زودم میگه اره 😒"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                  if (trimmedMessage.includes("متین")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"متین نه فرمانده متین"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                 if (trimmedMessage.includes("ویدا")) {
                                  const functions = [vida, vida2, vida3];
                                  const randomFunction = functions[Math.floor(Math.random() * functions.length)];
                                    randomFunction();
                            }
                                  if (trimmedMessage.includes("باگ")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"از بس نتت تخمیه"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                 if (trimmedMessage.includes("چص")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"اره بوش هم میاد 🤮🤢"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                 if (trimmedMessage.includes("قشنگ")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"اصلا هم قشنگ نیست 😒"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                 if (trimmedMessage.includes("موز")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"دوس داری موز منو بخوری؟🍌"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                  if (trimmedMessage.includes("خدافظ")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"خدافظ عشقم 😁😍"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                  if (trimmedMessage.includes("کص")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"کص چیه بی ادب مگه خودت ناموس نداری"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                  if (trimmedMessage.includes("بای")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"بری که دیگه بر نگردی"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                  if (trimmedMessage.includes("یونس")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"کص ننه یونس"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                 if (trimmedMessage.includes("کلم")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"کاهو"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                  if (trimmedMessage.includes("چشم")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"آفرین پسر گل"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                   if (trimmedMessage.includes("😭")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"گریه نکن جوجو"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                 if (trimmedMessage.includes("🤡")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"چرا ایمجوی خودتو فرستادی؟"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                  if (trimmedMessage.includes("🙄")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"سرتو بنداز پایین"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                   if (trimmedMessage.includes("❤️")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"قلب واسه منه؟"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                 if (trimmedMessage.includes("🤬")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"خودتو کنترل کن"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                 if (trimmedMessage.includes("کصخل")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"عمته"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                 if (trimmedMessage.includes("ول کن")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"مگه سفت میکنم دردت میاد؟"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                 if (trimmedMessage.includes("قلب")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"قلبتو میدی بهم ؟😉"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                 if (trimmedMessage.includes("ربات")) {
                                  const functions = [robat, robat2, robat3];
                                  const randomFunction = functions[Math.floor(Math.random() * functions.length)];
                                    randomFunction();
                            }
                                 if (trimmedMessage.includes("هعی")) {
                                  const functions = [hey, hey2, hey3];
                                  const randomFunction = functions[Math.floor(Math.random() * functions.length)];
                                    randomFunction();
                            }
                                  if (trimmedMessage.includes("هستم")) {
                                  const functions = [khabari, khabari2, khabari3];
                                  const randomFunction = functions[Math.floor(Math.random() * functions.length)];
                                    randomFunction();
                            }
                                  if (trimmedMessage.includes("رل")) {
                                  const functions = [rel, rel2, rel3];
                                  const randomFunction = functions[Math.floor(Math.random() * functions.length)];
                                    randomFunction();
                            }
                                  if (trimmedMessage.includes("😂😂")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"توش بشه بخندی 😒"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                  if (trimmedMessage.includes("🤣🤣")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"کیر خر 😒"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                  if (trimmedMessage.includes("گمشو")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"گم شم پیدام میکنی؟"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                  if (masage === "خودتو معرفی کن") {
                                      let messageToSend3 = `42[11,${window.wsObj.id},"من یک ربات توسعه داده شده توسط STRAGON هستم"]`;
                                  window.wsObj.send(messageToSend3);
                                      }
                                 if (masage === "تو رو کی ساخته") {
                                      let messageToSend3 = `42[11,${window.wsObj.id},"من توسط STRAGON ساخته شده ام"]`;
                                  window.wsObj.send(messageToSend3);
                                      }

                                 if (trimmedMessage.includes("روبیکا")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"آخه سگ روبیکا داره؟"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                 if (trimmedMessage.includes("یگانه")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"منظورت همون دختر تاخیری است؟"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                 if (trimmedMessage.includes("خواننده")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"خواننده فقط حصین"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                 if (trimmedMessage.includes("عشق")) {
                                  const functions = [eshgh, eshgh2, eshgh3];
                                  const randomFunction = functions[Math.floor(Math.random() * functions.length)];
                                    randomFunction();
                            }
                                  if (trimmedMessage.includes("عسل")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"کص ننه عسل"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                  if (trimmedMessage.includes("پوریا")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"اسم عشقمو نیار 🙄"]`;
                                  window.wsObj.send(messageToSend);
                            }

                                  if (trimmedMessage.includes("خوابم میاد")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"بکیرم"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                  if (trimmedMessage.includes("کیک")) {
                                   const functions = [kik, kik2, kik3];
                                  const randomFunction = functions[Math.floor(Math.random() * functions.length)];
                                    randomFunction();
                            }
                                  if (trimmedMessage.includes("🖕")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"همین انگشت تو کونت"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                   if (trimmedMessage.includes("💃")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"بزن برقصه؟"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                  if (trimmedMessage.includes("🙈")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"نگاش کن خجالت نکش"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                 if (trimmedMessage.includes("دعوا")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"آخجون دعوا چص فیل بیارید 🍿"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                 if (trimmedMessage.includes("👅")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"خوش مزس؟🙄"]`;
                                  window.wsObj.send(messageToSend);
                            }



                                  if (trimmedMessage.includes("دوستم")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"تو که سفیده پوستت کون نمیدی به دوستت؟"]`;
                                  window.wsObj.send(messageToSend);
                            }

                                  if (trimmedMessage.includes("اسمت چیه")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"منو نمیشناسی ؟ من باباتم 😁"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                 if (trimmedMessage.includes("اصل")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"میخوای مخ بزنی 🙄"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                  if (trimmedMessage.includes("اسکل")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"خودتی 🙄😒"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                  if (trimmedMessage.includes("موزیک")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"فقط نسل 1"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                  if (trimmedMessage.includes("چند سالته")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"همسن بابات"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                  if (trimmedMessage.includes("بی ادب")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"خودتی 🙄"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                  if (trimmedMessage.includes("خسرو")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"3 دقیقه  سکوت به احترام خسرو 🫡"]`;
                                  window.wsObj.send(messageToSend);
                            }
                                 if (extractedValue !== firstValue) {
                                  if (trimmedMessage.includes("من کیم")) {
                                  let messageToSend = `42[11,${window.wsObj.id},"آها یادم اومد تو کیر منی"]`;
                                  window.wsObj.send(messageToSend);
                                    }
                                    if (masage === "برو بیرون") {
                                      let messageToSend4 = `42[11,${window.wsObj.id},"فقط باید ارباب دستور بده تو که کیر منم نیستی"]`;
                                  window.wsObj.send(messageToSend4);
                            }
                                 if (masage === "ریپورت بده") {
                                      let messageToSend4 = `42[11,${window.wsObj.id},"فقط باید ارباب دستور بده تو که کیر منم نیستی"]`;
                                  window.wsObj.send(messageToSend4);
                            }
                            }
                                 }

                                  if (extractedValue === firstValue) {
                                    if (masage === "برو بیرون") {
                                      let messageToSend4 = `42[11,${window.wsObj.id},"چشم ارباب"]`;
                                  window.wsObj.send(messageToSend4);
                                  let messageToSend = `42[24,${window.wsObj.id}]`;
                                  window.wsObj.send(messageToSend);
                            }
                                    if (masage === "ریپورت بده") {
                                      let messageToSend4 = `42[11,${window.wsObj.id},"چشم ارباب"]`;
                                  window.wsObj.send(messageToSend4);
                                      let messageToSend2 = `42[35,${window.wsObj.id}]`;
                                  window.wsObj.send(messageToSend2);
                                      }
                                     if (masage === "من کیم") {
                                      let messageToSend3 = `42[11,${window.wsObj.id},"آها یادم اومد تو عشق منی ارباب"]`;
                                  window.wsObj.send(messageToSend3);
                                      }




                                  }

                             }


                             }


                      if (msg.data.indexOf('42["16"') !== -1) {
                            let dataString = msg.data.slice(2);
                            let data = JSON.parse(dataString);
                            let formattedMessage = `42[34,${window.wsObj.id},${1}]`;
                            window.wsObj.send(formattedMessage);
                            let messages = [
                            '42[10,' + window.wsObj.id + ',[5,"x008D26"]]',
                            '42[10,' + window.wsObj.id + ',[3,0,0,767,448]]',
                            '42[10,' + window.wsObj.id + ',[5,"x000000"]]',
                            '42[10,'+ window.wsObj.id + ',[6,"31"]]',
                            '42[10,'+ window.wsObj.id + ',[1,6,260,113,204,387]]',
                            '42[10,'+ window.wsObj.id + ',[1,6,266,106,386,378]]',
                            '42[10,'+ window.wsObj.id + ',[1,6,462,81,480,367]]',
                            '42[10,'+ window.wsObj.id + ',[1,6,147,228,408,229]]',
                            ]
                           messages.forEach((message, index) => {
                           setTimeout(() => {
                           window.wsObj.send(message);
                           }, index *1);

                          });

                            let messageToSend = `42[25,${window.wsObj.id}]`;
                           setTimeout(() => {
                              window.wsObj.send(messageToSend);
                           }, 5000);



                        if (data[0] == 5) {

                            window.wsObj.lengthID = data[1];
                            window.wsObj.id = data[2];
                            window.wsObj.roomCode = data[3];
                            window.wsObj.uders = data[5];


                        }
                    }
                } catch (err) {

                    console.error("Error parsing message data:", err);
                }

            });
        }
    };

    const panel = document.createElement('div');
    panel.style.width = '300px';
    panel.style.height = '50px';
    panel.style.backgroundColor = 'black';
    panel.style.border = '2px solid blue';
    panel.style.borderRadius = '15px';
    panel.style.position = 'absolute';
    panel.style.top = '70px';
    panel.style.left = '10px';
    panel.style.color = 'white';
    panel.style.padding = '5px 15px 15px 15px';
    panel.style.boxSizing = 'border-box';
    panel.style.zIndex = '9999999';
    panel.style.display = 'flex';
    panel.style.justifyContent = 'center';
    panel.style.alignItems = 'center';

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.style.width = '100%';
    inputField.style.marginTop = '10px';
    inputField.style.borderRadius = '10px';
    inputField.style.paddingLeft = '5px';

 const savedValue = localStorage.getItem('inputValue');

if (savedValue) {
    inputField.value = savedValue;
    firstValue = savedValue;
}



inputField.addEventListener('input', (event) => {
    firstValue = event.target.value;
    localStorage.setItem('inputValue', firstValue);
});


console.log(firstValue);

panel.appendChild(inputField);


document.body.appendChild(panel);

})();