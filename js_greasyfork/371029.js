// ==UserScript==
// @name         AutoHack S0urce.io
// @namespace    https://greasyfork.org/
// @version      1.0
// @description  Autohack enemies
// @author       SnowYeti
// @match        http://s0urce.io/
// ~ Made By: Snow Yeti ~// Edited by:
// ~ Working ONLY on 8/9/2018 due to words being scrambled daily ~ //
// ~ May Update it somedays idk im lazy ~//
// ~ If youd like to update it yourself FIRST DELETE everything from LINE 45 TO LINE 783 ~ //
// ~ SECOND copy the templete code below leaving out the forward slashes "//" ~ //
//           case "http://s0urce.io/client/img/word/X/99":
//                  form.value = "Answer";
//                  break;
// ~ THIRD get on S0urce.io and start hacking ~ //
// ~ When a word comes up you want to save open "Developer Tools" ( Ctrl+Shift+I) ~ //
// ~ In the top left of the Developer tools there will be a box with a little arrow clicking it, CLICK that ~ //
// ~ After that go and click the word you want to save (the word with the greenbox around it) ~ //
// ~ In the developer menu it will highlight a section Click the little drop down arrow to the left of the highlighted portion ~ //
// ~ It will drop down a little section with a hyperlink in it (blue text color and underlined) thats what you care about ~ //
// ~ You'll see something like "../client/img/word/m/25" The "m" means its a medium difficulty word and the number is the address ~ //
// ~ Take the letter (e,m,or h) and plug it into the templete code (Delete the "X" in the code and replace it with your letter) ~ //
// ~ Take the number (0-60) and plug it into the templete code (Delete the "99" in the code and replace it with your number) ~ //
// ~ Lastly take the word you need to type in and replace "Answer" in the tempelate code (For example if the word is "hostserver" delete "Answer" and type in "hostserver") ~ //
// ~ YOU'RE FINISHED, You're a natural hacker! To have the code work you have to click FILE then SAVE in the top left of Tampermonkey and refresh S0urce.io ~ //
// ~ If you do update this code add your name beside mine leave the update instructions and reuploaded it to GreasyFork.Org so somebody else can use it and update it. ~ //
// ~ Don't forget to update the Delete instructions, Version Number, and working date ~ //
// @downloadURL https://update.greasyfork.org/scripts/371029/AutoHack%20S0urceio.user.js
// @updateURL https://update.greasyfork.org/scripts/371029/AutoHack%20S0urceio.meta.js
// ==/UserScript==

(function()
 {
    "use strict";

    function handle()
    {
        var url = document.getElementById("tool-type").childNodes[0].src;
        var form = document.getElementById("tool-type-word");

        switch(url)
        {
            case "http://s0urce.io/client/img/words/template.png":
                break;

            case "http://s0urce.io/client/img/word/m/46": //done       Delete from here down to line 783
                form.value = "syscall";
                break;

            case "http://s0urce.io/client/img/word/e/57": //done
                form.value = "set";
                break;

            case "http://s0urce.io/client/img/word/e/2": //done
                form.value = "join";
                break;

            case "http://s0urce.io/client/img/word/e/28": //done
                form.value = "get";
                break;

            case "http://s0urce.io/client/img/word/e/16": //done
                form.value = "anon";
                break;

            case "http://s0urce.io/client/img/word/e/27": //done
                form.value = "event";
                break;

            case "http://s0urce.io/client/img/word/e/11": //done
                form.value = "global";
                break;

            case "http://s0urce.io/client/img/word/e/30": //done
                form.value = "com";
                break;

            case "http://s0urce.io/client/img/word/e/35": //done
                form.value = "poly";
                break;

            case "http://s0urce.io/client/img/word/e/37": //done
                form.value = "add";
                break;

            case "http://s0urce.io/client/img/word/e/36": //done
                form.value = "delete";
                break;

            case "http://s0urce.io/client/img/word/e/15": //done
                form.value = "socket";
                break;

            case "http://s0urce.io/client/img/word/m/26": //done
                form.value = "encrypt";
                break;

            case "http://s0urce.io/client/img/word/e/42": //done
                form.value = "num";
                break;

            case "http://s0urce.io/client/img/word/m/51": //done
                form.value = "filetype";
                break;

            case "http://s0urce.io/client/img/word/m/30": //done
                form.value = "export";
                break;

            case "http://s0urce.io/client/img/word/m/4": //done
                form.value = "command";
                break;

            case "http://s0urce.io/client/img/word/e/25": //done
                form.value = "buffer";
                break;

            case "http://s0urce.io/client/img/word/e/33": //done
                form.value = "remove";
                break;

            case "http://s0urce.io/client/img/word/m/41": //done
                form.value = "setnewid";
                break;

            case "http://s0urce.io/client/img/word/e/60": //done
                form.value = "right";
                break;

            case "http://s0urce.io/client/img/word/m/6": //done
                form.value = "newhost";
                break;

            case "http://s0urce.io/client/img/word/e/48": //done
                form.value = "dir";
                break;

            case "http://s0urce.io/client/img/word/e/17": //done
                form.value = "ghost";
                break;

            case "http://s0urce.io/client/img/word/e/43": //done
                form.value = "signal";
                break;

            case "http://s0urce.io/client/img/word/e/21": //done
                form.value = "reset";
                break;

            case "http://s0urce.io/client/img/word/e/20": //done
                form.value = "data";
                break;

            case "http://s0urce.io/client/img/word/e/49": //done
                form.value = "write";
                break;

            case "http://s0urce.io/client/img/word/e/39": //done
                form.value = "val";
                break;

            case "http://s0urce.io/client/img/word/e/47": //done
                form.value = "client";
                break;

            case "http://s0urce.io/client/img/word/e/7": //done
                form.value = "list";
                break;

            case "http://s0urce.io/client/img/word/e/7": //done
                form.value = "list";
                break;

            case "http://s0urce.io/client/img/word/e/40": //done
                form.value = "init";
                break;

            case "http://s0urce.io/client/img/word/e/26": //done
                form.value = "http";
                break;

            case "http://s0urce.io/client/img/word/e/19": //done
                form.value = "ping";
                break;

            case "http://s0urce.io/client/img/word/e/10": //done
                form.value = "log";
                break;

            case "http://s0urce.io/client/img/word/e/24": //done
                form.value = "load";
                break;

            case "http://s0urce.io/client/img/word/m/20": //done
                form.value = "gridheight";
                break;

            case "http://s0urce.io/client/img/word/m/10": //done
                form.value = "encode";
                break;

            case "http://s0urce.io/client/img/word/m/13": //done
                form.value = "gridwidth";
                break;

            case "http://s0urce.io/client/img/word/m/55": //done
                form.value = "config";
                break;

            case "http://s0urce.io/client/img/word/m/3": //done
                form.value = "username";
                break;

            case "http://s0urce.io/client/img/word/m/40": //done
                form.value = "getinfo";
                break;

            case "http://s0urce.io/client/img/word/e/46": //done
                form.value = "count";
                break;

            case "http://s0urce.io/client/img/word/e/38": //done
                form.value = "cookies";
                break;

            case "http://s0urce.io/client/img/word/e/0": //done
                form.value = "intel";
                break;

            case "http://s0urce.io/client/img/word/m/21": //done
                form.value = "threat";
                break;

            case "http://s0urce.io/client/img/word/m/34": //done
                form.value = "hexagon";
                break;

            case "http://s0urce.io/client/img/word/e/45": //done
                form.value = "pass";
                break;

            case "http://s0urce.io/client/img/word/e/13": //done
                form.value = "part";
                break;

            case "http://s0urce.io/client/img/word/e/53": //done
                form.value = "send";
                break;

            case "http://s0urce.io/client/img/word/e/12": //done
                form.value = "port";
                break;

            case "http://s0urce.io/client/img/word/e/51": //done
                form.value = "bytes";
                break;

            case "http://s0urce.io/client/img/word/m/42": //done
                form.value = "decrypt";
                break;

            case "http://s0urce.io/client/img/word/e/14": //done
                form.value = "bit";
                break;

            case "http://s0urce.io/client/img/word/m/5": //done
                form.value = "setstats";
                break;

            case "http://s0urce.io/client/img/word/m/35": //done
                form.value = "disconnect";
                break;

            case "http://s0urce.io/client/img/word/m/16": //done
                form.value = "module";
                break;

            case "http://s0urce.io/client/img/word/e/52": //done
                form.value = "root";
                break;

            case "http://s0urce.io/client/img/word/e/52": //done
                form.value = "root";
                break;

            case "http://s0urce.io/client/img/word/e/54": //done
                form.value = "upload";
                break;

            case "http://s0urce.io/client/img/word/e/5": //done
                form.value = "stat";
                break;

            case "http://s0urce.io/client/img/word/e/32": //done
                form.value = "left";
                break;

            case "http://s0urce.io/client/img/word/m/48": //done
                form.value = "newserver";
                break;

            case "http://s0urce.io/client/img/word/m/27": //Done
                form.value = "password";
                break;

            case "http://s0urce.io/client/img/word/m/33": //done
                form.value = "getpass";
                break;

            case "http://s0urce.io/client/img/word/m/61": //done
                form.value = "process";
                break;

            case "http://s0urce.io/client/img/word/m/47": //done
                form.value = "datatype";
                break;

            case "http://s0urce.io/client/img/word/m/7": //done
                form.value = "sizeof";
                break;

            case "http://s0urce.io/client/img/word/m/59": //done
                form.value = "account";
                break;

            case "http://s0urce.io/client/img/word/m/19": //done
                form.value = "getlog";
                break;

            case "http://s0urce.io/client/img/word/m/39": //done
                form.value = "serverproxy";
                break;

            case "http://s0urce.io/client/img/word/m/52": //done
                form.value = "getping";
                break;

            case "http://s0urce.io/client/img/word/e/61": //done
                form.value = "url";
                break;

            case "http://s0urce.io/client/img/word/m/0": //done
                form.value = "vector";
                break;

            case "http://s0urce.io/client/img/word/m/49": //done
                form.value = "setport";
                break;

            case "http://s0urce.io/client/img/word/m/64": //done
                form.value = "generate";
                break;

            case "http://s0urce.io/client/img/word/m/65": //done
                form.value = "length";
                break;

            case "http://s0urce.io/client/img/word/m/58": //done
                form.value = "newline";
                break;

            case "http://s0urce.io/client/img/word/m/60": //done
                form.value = "loadbytes";
                break;

            case "http://s0urce.io/client/img/word/m/56": //done
                form.value = "decryptfile";
                break;

            case "http://s0urce.io/client/img/word/m/37": //done
                form.value = "thread";
                break;

            case "http://s0urce.io/client/img/word/m/63": //done
                form.value = "constructor";
                break;

                case "http://s0urce.io/client/img/word/m/38": //done
                form.value = "filedir";
                break;

                case "http://s0urce.io/client/img/word/m/9": //done
                form.value = "encryptfile";
                break;

                case "http://s0urce.io/client/img/word/m/2": //done
                form.value = "urlcheck";
                break;

                case "http://s0urce.io/client/img/word/e/8": //done
                form.value = "handle";
                break;

                case "http://s0urce.io/client/img/word/e/59": //done
                form.value = "info";
                break;

                case "http://s0urce.io/client/img/word/e/6": //done
                form.value = "call";
                break;

                case "http://s0urce.io/client/img/word/m/24": //done
                form.value = "userid";
                break;

                case "http://s0urce.io/client/img/word/e/9": //done
                form.value = "emit";
                break;

                case "http://s0urce.io/client/img/word/e/29": //done
                form.value = "size";
                break;

                case "http://s0urce.io/client/img/word/e/44": //done
                form.value = "system";
                break;

                case "http://s0urce.io/client/img/word/e/31": //done
                form.value = "temp";
                break;

                case "http://s0urce.io/client/img/word/e/44": //done
                form.value = "system";
                break;

                case "http://s0urce.io/client/img/word/e/3": //done
                form.value = "file";
                break;

                case "http://s0urce.io/client/img/word/e/56": //done
                form.value = "loop";
                break;

                case "http://s0urce.io/client/img/word/m/14": //done
                form.value = "writefile";
                break;

                case "http://s0urce.io/client/img/word/m/17": //done
                form.value = "accountname";
                break;

                case "http://s0urce.io/client/img/word/m/31": //done
                form.value = "getid";
                break;

                case "http://s0urce.io/client/img/word/m/43": //done
                form.value = "download";
                break;

                case "http://s0urce.io/client/img/word/h/53": //done
                form.value = "ghostfilesystem";
                break;

                case "http://s0urce.io/client/img/word/m/1": //done
                form.value = "setcookie";
                break;

                case "http://s0urce.io/client/img/word/h/5": //done
                form.value = "changepassword";
                break;

                case "http://s0urce.io/client/img/word/h/42": //done
                form.value = "mergesocket";
                break;

                case "http://s0urce.io/client/img/word/m/14": //done
                form.value = "writefile";
                break;

                case "http://s0urce.io/client/img/word/h/31": //done
                form.value = "encryptunpackedbatch";
                break;

                case "http://s0urce.io/client/img/word/h/13": //done
                form.value = "unpacktmpfile";
                break;

                case "http://s0urce.io/client/img/word/h/10": //done
                form.value = "loadloggedpassword";
                break;

                case "http://s0urce.io/client/img/word/h/12": //done
                form.value = "rootcookieset";
                break;

                case "http://s0urce.io/client/img/word/h/46": //done
                form.value = "statusofprocess";
                break;

                case "http://s0urce.io/client/img/word/h/6": //done
                form.value = "create2axisvector";
                break;

                case "http://s0urce.io/client/img/word/h/24": //done
                form.value = "sizeofhexagon";
                break;

                case "http://s0urce.io/client/img/word/h/40": //done
                form.value = "httpbuffersize";
                break;

                case "http://s0urce.io/client/img/word/h/37": //done
                form.value = "channelsetpackage";
                break;

                case "http://s0urce.io/client/img/word/h/15": //done
                form.value = "disconnectserver";
                break;

                case "http://s0urce.io/client/img/word/h/1": //done
                form.value = "dodecahedron";
                break;

                case "http://s0urce.io/client/img/word/m/8": //done
                form.value = "channel";
                break;

                case "http://s0urce.io/client/img/word/m/15": //done
                form.value = "number";
                break;

                case "http://s0urce.io/client/img/word/m/32": //done
                form.value = "eventtype";
                break;

                case "http://s0urce.io/client/img/word/m/57": //done
                form.value = "package";
                break;

                case "http://s0urce.io/client/img/word/m/25": //done
                form.value = "hostserver";
                break;

                case "http://s0urce.io/client/img/word/m/28": //done
                form.value = "getkey";
                break;

                case "http://s0urce.io/client/img/word/e/41": //done
                form.value = "domain";
                break;

                case "http://s0urce.io/client/img/word/m/62": //done
                form.value = "userport";
                break;

                case "http://s0urce.io/client/img/word/m/44": //done
                form.value = "findpackage";
                break;

                case "http://s0urce.io/client/img/word/e/23": //done
                form.value = "add";
                break;

                case "http://s0urce.io/client/img/word/m/11": //done
                form.value = "responder";
                break;

                case "http://s0urce.io/client/img/word/e/58": //done
                form.value = "user";
                break;

                case "http://s0urce.io/client/img/word/e/55": //done
                form.value = "type";
                break;

                case "http://s0urce.io/client/img/word/e/4": //done
                form.value = "point";
                break;

                case "http://s0urce.io/client/img/word/e/50": //done
                form.value = "status";
                break;

                case "http://s0urce.io/client/img/word/e/18": //done
                form.value = "host";
                break;

                case "http://s0urce.io/client/img/word/e/1": //done
                form.value = "key";
                break;

                case "http://s0urce.io/client/img/word/e/34": //done
                form.value = "xml";
                break;

                case "http://s0urce.io/client/img/word/m/53": //done
                form.value = "connect";
                break;

                case "http://s0urce.io/client/img/word/m/36": //done
                form.value = "protocol";
                break;

                case "http://s0urce.io/client/img/word/m/29": //done
                form.value = "response";
                break;

                case "http://s0urce.io/client/img/word/h/45": //done
                form.value = "loadregisterlist";
                break;

                case "http://s0urce.io/client/img/word/h/27": //done
                form.value = "removenewcookie";
                break;

                case "http://s0urce.io/client/img/word/h/3": //done
                form.value = "createnewpackage";
                break;

                case "http://s0urce.io/client/img/word/h/7": //done
                form.value = "respondertimeout";
                break;

                case "http://s0urce.io/client/img/word/h/49": //done
                form.value = "exportconfigpackage";
                break;

                case "http://s0urce.io/client/img/word/h/21": //done
                form.value = "blockthreat";
                break;

                case "http://s0urce.io/client/img/word/h/35": //done
                form.value = "emitconfiglist";
                break;

                case "http://s0urce.io/client/img/word/h/54": //done
                form.value = "getmysqldomain";
                break;

                case "http://s0urce.io/client/img/word/h/36": //done
                form.value = "fileexpresslog";
                break;

                case "http://s0urce.io/client/img/word/h/4": //done
                form.value = "setnewproxy";
                break;

                case "http://s0urce.io/client/img/word/h/22": //done
                form.value = "callmodule";
                break;

                case "http://s0urce.io/client/img/word/h/11": //done
                form.value = "getpartoffile";
                break;

                case "http://s0urce.io/client/img/word/h/29": //done
                form.value = "batchallfiles";
                break;

                case "http://s0urce.io/client/img/word/h/33": //done
                form.value = "systemportkey";
                break;

                case "http://s0urce.io/client/img/word/h/2": //done
                form.value = "systemgridtype";
                break;

                case "http://s0urce.io/client/img/word/h/19": //done
                form.value = "changeusername";
                break;

                case "http://s0urce.io/client/img/word/h/0": //done
                form.value = "getxmlprotocol";
                break;

                case "http://s0urce.io/client/img/word/h/52": //done
                form.value = "disconnectchannel";
                break;

                case "http://s0urce.io/client/img/word/h/51": //done
                form.value = "sendintelpass";
                break;

                case "http://s0urce.io/client/img/word/h/48": //done
                form.value = "loadaltevent";
                break;

                case "http://s0urce.io/client/img/word/h/47": //done
                form.value = "joinnetworkclient";
                break;

                case "http://s0urce.io/client/img/word/h/38": //done
                form.value = "wordcounter";
                break;

                case "http://s0urce.io/client/img/word/h/41": //done
                form.value = "hostnewserver";
                break;

                case "http://s0urce.io/client/img/word/h/8": //done
                form.value = "removeoldcookie";
                break;

                case "http://s0urce.io/client/img/word/h/43": //done
                form.value = "bufferpingset";
                break;

                case "http://s0urce.io/client/img/word/h/28": //done
                form.value = "destroybatch";
                break;

                case "http://s0urce.io/client/img/word/h/34": //done
                form.value = "uploaduserstats";
                break;

                case "http://s0urce.io/client/img/word/h/3": //done
                form.value = "createnewpackage";
                break;

                case "http://s0urce.io/client/img/word/m/54": //done
                form.value = "fillgrid";
                break;

                case "http://s0urce.io/client/img/word/m/45": //done
                form.value = "listconfig";
                break;

                case "http://s0urce.io/client/img/word/m/23": //done
                form.value = "getfile";
                break;

                case "http://s0urce.io/client/img/word/m/50": //done
                form.value = "setping";
                break;

                case "http://s0urce.io/client/img/word/h/23": //done
                form.value = "create3axisvector";
                break;

                case "http://s0urce.io/client/img/word/h/17": //done
                form.value = "eventlistdir";
                break;

                case "http://s0urce.io/client/img/word/h/30": //done
                form.value = "deleteallids";
                break;

                case "http://s0urce.io/client/img/word/h/39": //done
                form.value = "decryptdatabatch";
                break;

                case "http://s0urce.io/client/img/word/h/14": //done
                form.value = "getfirewallchannel";
                break;

                case "http://s0urce.io/client/img/word/h/26": //done
                form.value = "encodenewfolder";
                break;

                case "http://s0urce.io/client/img/word/h/50": //done
                form.value = "createfilethread";
                break;

                case "http://s0urce.io/client/img/word/h/32": //done
                form.value = "getdatapassword";
                break;

                case "http://s0urce.io/client/img/word/h/9": //done
                form.value = "generatecodepack";
                break;

                case "http://s0urce.io/client/img/word/h/20": //done
                form.value = "includedirectory";
                break;

                case "http://s0urce.io/client/img/word/h/25": //done
                form.value = "checkhttptype";
                break;

                case "http://s0urce.io/client/img/word/h/16": //done
                form.value = "createnewsocket";
                break;

                case "http://s0urce.io/client/img/word/m/18": //done
                form.value = "mysql";
                break;

                case "http://s0urce.io/client/img/word/e/22": //done
                form.value = "net";
                break;

                case "http://s0urce.io/client/img/word/m/22": //done
                form.value = "proxy";
                break;                                               // delete to here

        }
        setTimeout(handle,100);
    }

    handle();
})();
