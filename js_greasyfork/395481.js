// ==UserScript==
// @name         source.io autocomplete bot
// @namespace    http://www.gann.be/
// @require https://unpkg.com/tesseract.js@v2.0.0-alpha.13/dist/tesseract.min.js
// @require https://unpkg.com/string-similarity/umd/string-similarity.min.js
// @version      0.1
// @description  Auto complete bot for source.io s0urce.io cheat hack triche robot remplissage automatique
// @author       Morgan Schaefer www.gann.be
// @match        ://s0urce.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395481/sourceio%20autocomplete%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/395481/sourceio%20autocomplete%20bot.meta.js
// ==/UserScript==



(function() {
   'use strict';

   // Your code here...

   let ancienneliste = [
      "account",
      "accountname",
      "add",
      "add",
      "anon",
      "batchallfiles",
      "bit",
      "blockthreat",
      "buffer",
      "bufferpingset",
      "bytes",
      "call",
      "callmodule",
      "changepassword",
      "changeusername",
      "channel",
      "channelsetpackage",
      "checkhttptype",
      "client",
      "com",
      "command",
      "config",
      "connect",
      "constructor",
      "cookies",
      "count",
      "create2axisvector",
      "create3axisvector",
      "createfilethread",
      "createnewpackage",
      "createnewsocket",
      "data",
      "datatype",
      "decrypt",
      "decryptdatabatch",
      "decryptfile",
      "delete",
      "delete",
      "deleteallids",
      "destroybatch",
      "dir",
      "dir",
      "disconnect",
      "disconnectchannel",
      "disconnectserver",
      "dodecahedron",
      "domain",
      "download",
      "emit",
      "emitconfiglist",
      "encode",
      "encodenewfolder",
      "encrypt",
      "encryptfile",
      "encryptunpackedbatch",
      "event",
      "eventlistdir",
      "eventtype",
      "export",
      "exportconfigpackage",
      "file",
      "file",
      "filedir",
      "fileexpresslog",
      "filetype",
      "fillgrid",
      "findpackage",
      "generate",
      "generatecodepack",
      "get",
      "getdatapassword",
      "getfile",
      "getfirewallchannel",
      "getid",
      "getinfo",
      "getkey",
      "getlog",
      "getmysqldomain",
      "getpartoffile",
      "getpass",
      "getping",
      "getxmlprotocol",
      "ghost",
      "ghostfilesystem",
      "global",
      "gridheight",
      "gridwidth",
      "handle",
      "hexagon",
      "host",
      "hostnewserver",
      "hostserver",
      "http",
      "httpbuffersize",
      "includedirectory",
      "info",
      "init",
      "intel",
      "join",
      "joinnetworkclient",
      "key",
      "left",
      "length",
      "list",
      "listconfig",
      "load",
      "loadaltevent",
      "loadbytes",
      "loadloggedpassword",
      "loadregisterlist",
      "log",
      "loop",
      "mergesocket",
      "module",
      "mysql",
      "net",
      "newhost",
      "newline",
      "newserver",
      "num",
      "number",
      "package",
      "part",
      "pass",
      "password",
      "patcheventlog",
      "ping",
      "point",
      "poly",
      "port",
      "process",
      "protocol",
      "proxy",
      "remove",
      "removenewcookie",
      "removeoldcookie",
      "reset",
      "responder",
      "respondertimeout",
      "response",
      "right",
      "root",
      "rootcookieset",
      "send",
      "sendintelpass",
      "server",
      "serverproxy",
      "set",
      "setnewid",
      "setnewproxy",
      "setping",
      "setport",
      "setstats",
      "signal",
      "size",
      "sizeof",
      "sizeofhexagon",
      "socket",
      "stat",
      "status",
      "statusofprocess",
      "syscall",
      "system",
      "systemgridtype",
      "systemportkey",
      "temp",
      "tempdatapass",
      "thread",
      "threat",
      "type",
      "unpacktmpfile",
      "upload",
      "uploaduserstats",
      "url",
      "urlcheck",
      "user",
      "userid",
      "username",
      "userport",
      "val",
      "vector",
      "wordcounter",
      "write",
      "writefile",
      "xml"
   ];

   //var cookie = document.cookie;
   //console.log("cookies = "+cookie);
   var myImage = document.getElementById("tool-type").childNodes[0].src;
   const { TesseractWorker } = Tesseract;
   const worker = new TesseractWorker();
   let ancientext;
   let url;
   let ancienurl;
   let defaulturl = "http://s0urce.io/client/img/words/template.png";
   let codes = [
      {url:"", mot:""}
   ];
   codes["http://s0urce.io/client/img/word/e/36"] = "add";
   codes["http://s0urce.io/client/img/word/e/50"] = "delete";
   codes["http://s0urce.io/client/img/word/e/56"] = "add";
   codes["http://s0urce.io/client/img/word/e/31"] = "bytes";
   codes["http://s0urce.io/client/img/word/e/49"] = "port";
   codes["http://s0urce.io/client/img/word/m/44"] = "channel";
   codes["http://s0urce.io/client/img/word/e/32"] = "client";
   codes["http://s0urce.io/client/img/word/e/12"] = "com";
   codes["http://s0urce.io/client/img/word/m/5"] = "command";
   codes["http://s0urce.io/client/img/word/m/11"] = "config";
   codes["http://s0urce.io/client/img/word/m/1"] = "connect";
   codes["http://s0urce.io/client/img/word/m/57"] = "constructor";
   codes["http://s0urce.io/client/img/word/e/37"] = "right";
   codes["http://s0urce.io/client/img/word/e/27"] = "ghost";
   codes["http://s0urce.io/client/img/word/e/6"] = "data";
   codes["http://s0urce.io/client/img/word/m/7"] = "module";
   codes["http://s0urce.io/client/img/word/e/25"] = "domain";
   codes["http://s0urce.io/client/img/word/e/1"] = "dir";
   codes["http://s0urce.io/client/img/word/m/34"] = "disconnect";
   codes["http://s0urce.io/client/img/word/e/13"] = "dir";
   codes["http://s0urce.io/client/img/word/m/62"] = "download";
   codes["http://s0urce.io/client/img/word/e/54"] = "global";
   codes["http://s0urce.io/client/img/word/m/10"] = "encryptfile";
   codes["http://s0urce.io/client/img/word/e/19"] = "load";
   codes["http://s0urce.io/client/img/word/e/21"] = "event";
   codes["http://s0urce.io/client/img/word/e/20"] = "file";
   codes["http://s0urce.io/client/img/word/m/28"] = "generate";
   codes["http://s0urce.io/client/img/word/e/14"] = "poly";
   codes["http://s0urce.io/client/img/word/m/32"] = "getfile";
   codes["http://s0urce.io/client/img/word/m/52"] = "getfile";
   codes["http://s0urce.io/client/img/word/m/18"] = "userport";
   codes["http://s0urce.io/client/img/word/m/40"] = "getinfo";
   codes["http://s0urce.io/client/img/word/m/12"] = "getkey";
   codes["http://s0urce.io/client/img/word/m/8"] = "gridwidth";
   codes["http://s0urce.io/client/img/word/m/17"] = "getpass";
   codes["http://s0urce.io/client/img/word/m/53"] = "getping";
   codes["http://s0urce.io/client/img/word/m/6"] = "getping";
   codes["http://s0urce.io/client/img/word/e/53"] = "add";
   codes["http://s0urce.io/client/img/word/e/44"] = "send";
   codes["http://s0urce.io/client/img/word/m/39"] = "gridheight";
   codes["http://s0urce.io/client/img/word/e/48"] = "pass";
   codes["http://s0urce.io/client/img/word/m/38"] = "hexagon";
   codes["http://s0urce.io/client/img/word/m/30"] = "listconfig";
   codes["http://s0urce.io/client/img/word/m/61"] = "hostserver";
   codes["http://s0urce.io/client/img/word/e/57"] = "part";
   codes["http://s0urce.io/client/img/word/e/41"] = "temp";
   codes["http://s0urce.io/client/img/word/e/4"] = "intel";
   codes["http://s0urce.io/client/img/word/e/24"] = "url";
   codes["http://s0urce.io/client/img/word/e/60"] = "size";
   codes["http://s0urce.io/client/img/word/e/46"] = "reset";
   codes["http://s0urce.io/client/img/word/e/38"] = "buffer";
   codes["http://s0urce.io/client/img/word/m/15"] = "loadbytes";
   codes["http://s0urce.io/client/img/word/e/16"] = "remove";
   codes["http://s0urce.io/client/img/word/e/10"] = "init";
   codes["http://s0urce.io/client/img/word/e/45"] = "loop";
   codes["http://s0urce.io/client/img/word/m/58"] = "module";
   codes["http://s0urce.io/client/img/word/m/31"] = "mysql";
   codes["http://s0urce.io/client/img/word/m/2"] = "newhost";
   codes["http://s0urce.io/client/img/word/m/59"] = "newhost";
   codes["http://s0urce.io/client/img/word/m/54"] = "newline";
   codes["http://s0urce.io/client/img/word/m/47"] = "newserver";
   codes["http://s0urce.io/client/img/word/e/22"] = "handle";
   codes["http://s0urce.io/client/img/word/e/52"] = "num";
   codes["http://s0urce.io/client/img/word/m/26"] = "number";
   codes["http://s0urce.io/client/img/word/m/13"] = "package";
   codes["http://s0urce.io/client/img/word/m/21"] = "package";
   codes["http://s0urce.io/client/img/word/e/3"] = "root";
   codes["http://s0urce.io/client/img/word/e/11"] = "http";
   codes["http://s0urce.io/client/img/word/e/0"] = "poly";
   codes["http://s0urce.io/client/img/word/e/59"] = "system";
   codes["http://s0urce.io/client/img/word/m/46"] = "process";
   codes["http://s0urce.io/client/img/word/m/63"] = "proxy";
   codes["http://s0urce.io/client/img/word/m/65"] = "proxy";
   codes["http://s0urce.io/client/img/word/e/2"] = "cookies";
   codes["http://s0urce.io/client/img/word/m/64"] = "responder";
   codes["http://s0urce.io/client/img/word/m/50"] = "response";
   codes["http://s0urce.io/client/img/word/e/39"] = "call";
   codes["http://s0urce.io/client/img/word/e/18"] = "ping";
   codes["http://s0urce.io/client/img/word/e/51"] = "write";
   codes["http://s0urce.io/client/img/word/m/60"] = "setcookie";
   codes["http://s0urce.io/client/img/word/e/8"] = "host";
   codes["http://s0urce.io/client/img/word/m/55"] = "setcookie";
   codes["http://s0urce.io/client/img/word/m/19"] = "setnewid";
   codes["http://s0urce.io/client/img/word/m/20"] = "setping";
   codes["http://s0urce.io/client/img/word/m/14"] = "setport";
   codes["http://s0urce.io/client/img/word/m/35"] = "setstats";
   codes["http://s0urce.io/client/img/word/e/15"] = "key";
   codes["http://s0urce.io/client/img/word/e/47"] = "signal";
   codes["http://s0urce.io/client/img/word/e/40"] = "size";
   codes["http://s0urce.io/client/img/word/m/24"] = "sizeof";
   codes["http://s0urce.io/client/img/word/e/28"] = "socket";
   codes["http://s0urce.io/client/img/word/e/58"] = "upload";
   codes["http://s0urce.io/client/img/word/e/29"] = "stat";
   codes["http://s0urce.io/client/img/word/e/34"] = "stat";
   codes["http://s0urce.io/client/img/word/e/42"] = "point";
   codes["http://s0urce.io/client/img/word/e/55"] = "com";
   codes["http://s0urce.io/client/img/word/e/5"] = "temp";
   codes["http://s0urce.io/client/img/word/m/27"] = "thread";
   codes["http://s0urce.io/client/img/word/m/25"] = "threat";
   codes["http://s0urce.io/client/img/word/e/23"] = "anon";
   codes["http://s0urce.io/client/img/word/e/35"] = "url";
   codes["http://s0urce.io/client/img/word/m/45"] = "userid";
   codes["http://s0urce.io/client/img/word/m/33"] = "userid";
   codes["http://s0urce.io/client/img/word/m/48"] = "username";
   codes["http://s0urce.io/client/img/word/m/4"] = "userport";
   codes["http://s0urce.io/client/img/word/e/26"] = "val";
   codes["http://s0urce.io/client/img/word/m/37"] = "vector";
   codes["http://s0urce.io/client/img/word/m/29"] = "writefile";
   codes["http://s0urce.io/client/img/word/e/30"] = "xml";
   codes["http://s0urce.io/client/img/word/e/61"] = "set";
   codes["http://s0urce.io/client/img/word/e/43"] = "xml";
   codes["http://s0urce.io/client/img/word/e/7"] = "left";
   codes["http://s0urce.io/client/img/word/h/26"] = "includedirectory";
   codes["http://s0urce.io/client/img/word/h/36"] = "removeoldcookie";
   codes["http://s0urce.io/client/img/word/h/49"] = "create3axisvector";
   codes["http://s0urce.io/client/img/word/h/24"] = "blockthreat";
   codes["http://s0urce.io/client/img/word/h/31"] = "exportconfigpackage";
   codes["http://s0urce.io/client/img/word/h/14"] = "createnewsocket";
   codes["http://s0urce.io/client/img/word/h/2"] = "systemgridtype";
   codes["http://s0urce.io/client/img/word/h/43"] = "removenewcookie";
   codes["http://s0urce.io/client/img/word/h/25"] = "bufferpingset";
   codes["http://s0urce.io/client/img/word/h/4"] = "encodenewfolder";
   codes["http://s0urce.io/client/img/word/h/47"] = "disconnectserver";
   codes["http://s0urce.io/client/img/word/h/28"] = "getmysqldomain";
   codes["http://s0urce.io/client/img/word/h/44"] = "uploaduserstats";
   codes["http://s0urce.io/client/img/word/h/50"] = "batchallfiles";
   codes["http://s0urce.io/client/img/word/h/7"] = "getdatapassword";
   codes["http://s0urce.io/client/img/word/h/33"] = "decryptdatabatch";
   codes["http://s0urce.io/client/img/word/h/34"] = "tempdatapass";
   codes["http://s0urce.io/client/img/word/h/8"] = "unpacktmpfile";
   codes["http://s0urce.io/client/img/word/h/0"] = "setnewproxy";
   codes["http://s0urce.io/client/img/word/h/42"] = "getxmlprotocol";
   codes["http://s0urce.io/client/img/word/h/1"] = "statusofprocess";
   codes["http://s0urce.io/client/img/word/h/12"] = "mergesocket";
   codes["http://s0urce.io/client/img/word/h/54"] = "emitconfiglist";
   codes["http://s0urce.io/client/img/word/h/46"] = "checkhttptype";
   codes["http://s0urce.io/client/img/word/h/48"] = "sendintelpass";
   codes["http://s0urce.io/client/img/word/h/52"] = "httpbuffersize";
   codes["http://s0urce.io/client/img/word/h/29"] = "createnewpackage";
   codes["http://s0urce.io/client/img/word/h/32"] = "fileexpresslog";
   codes["http://s0urce.io/client/img/word/h/21"] = "generatecodepack";
   codes["http://s0urce.io/client/img/word/h/38"] = "dodecahedron";
   codes["http://s0urce.io/client/img/word/h/15"] = "disconnectchannel";
   codes["http://s0urce.io/client/img/word/h/17"] = "wordcounter";
   codes["http://s0urce.io/client/img/word/h/22"] = "patcheventlog";
   codes["http://s0urce.io/client/img/word/h/5"] = "create2axisvector";
   codes["http://s0urce.io/client/img/word/h/23"] = "joinnetworkclient";
   codes["http://s0urce.io/client/img/word/h/45"] = "changepassword";
   codes["http://s0urce.io/client/img/word/h/51"] = "loadloggedpassword"



   let text = "a";
   let anciencompare;
   let compare;
   let meilleur;
   let form = document.getElementById("tool-type-word");

   function getimgandform(){
      url = document.getElementById("tool-type").childNodes[0].src;
      form = document.getElementById("tool-type-word");
   }

   function tiping(text){
      form.value = text;
      ancientext = text;
      ancienurl = url
      codes[url] = text;
      console.log("tiping "+text);
      $('#tool-type-form').submit();
      setTimeout(start,1000);
   }

   function handle(){
      getimgandform();

      if (codes[url]!=undefined && text!=ancientext) {
               console.log("if (codes[url]!=undefined && text!=ancientext)");
         text = codes[url];
         tiping(text);
         //          // console.log("0text = "+text);
         //          form.value = text;
         //          ancientext = text;
         //          ancienurl = codes[url]
         // //      codes[url] = text;
         //          // console.log("ancien !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ");
         //          $('#tool-type-form').submit();
         //          setTimeout(start,1000);
      }else{
         console.log("if (codes[url]!=undefined && text!=ancientext) else");

         worker
         .recognize(url,)
         .progress((p) => {
            //      console.log('progress', p);
         })

         .then(({ text }) => {
            // console.log("nouveau " + text);
            console.log("then text "+text);

            //      if (text===ancientext) {
            let i = 0
            let resultat;
            resultat = [1,2,3]
            for (let mot of ancienneliste) {
               compare = stringSimilarity.compareTwoStrings(mot, text);
               resultat[i] = compare;
               i = i+1;
            }

            // console.log(resultat);
            // console.log("2text = "+text);

            let meilleur = resultat.indexOf(Math.max(...resultat));
            text = ancienneliste[meilleur];
            console.log("text = ancienneliste[meilleur]; "+text);

            // console.log("meilleur = "+meilleur);
            // console.log("resultat[meilleur] = "+resultat[meilleur]);
            // console.log("ancienneliste[meilleur] = "+ancienneliste[meilleur]);
            // console.log("compare = "+compare);
            // console.log("anciencompare = "+anciencompare);
            // console.log("3text = "+text);
            // console.log("ancientext = "+ancientext);
            if (text==ancientext) {
               console.log("if (text==ancientext)");

               // console.log(compare+anciencompare);
               // console.log("ca n'à pas marché"+text+ancientext);
               text = window.prompt("le bot n'est pas parvenu à identifer le mot, merci de le taper ci dessous.");
               tiping(text);

            }

                    // }
            // console.log("3.1text = "+text);

            // form.value = text;
            // console.log(codes[url]);
            // codes[url] = text;
            // console.log(codes[url]);
            // console.log(url+" = "+codes[url]);
            // $('#tool-type-form').submit();
            tiping(text);
            worker.terminate();

            // ancientext = text;
            // anciencompare = text;
            // console.log("ancientext " + ancientext);
            // setTimeout(start,500);
            // console.log("4text = "+text);
            // console.log(codes);



         });

      }
   }
   function boucle(){
      // getimgandform()
      // if (ancienurl != url) {
      console.log(text + ancientext);
   //   ancientext = text;
      console.log("nouveau cycle");
      handle();
      // } else {
      // boucle()
      // }
   }

   // boucle()


   function start(){
      myImage = document.getElementById("tool-type").childNodes[0].src;
      if(myImage === defaulturl){
         setTimeout(start,5000);
         console.log(myImage);
         let endform = document.getElementById("targetmessage-input");
         endform.value = "bot at https://greasyfork.org/fr/scripts/395481 source.io autocomplete bot";

         $('#targetmessage-input-form').submit();


      }else{
         boucle();
      }
   }
   setTimeout(start,5000);


})();
