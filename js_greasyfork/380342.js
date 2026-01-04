// ==UserScript==
// @description:ru  В рамках борьбы с цензурой на доске /po/ 
// @description:en  fight against Internet censorship 
// @exclude      https://2ch.hk/po/catalog.html
// @exclude      https://2ch.hk/news/catalog.html
// @include      https://2ch.hk/po/*
// @include      https://2ch.hk/news/*
// @icon         https://2ch.hk/favicon.ico
// @name         filtersBypassInPO
// @name:ru      Обход автоскрытия неугодных слов 
// @namespace    po
// @run-at       document-end
// @version      1903200
// @description В рамках борьбы с цензурой на доске po
// @downloadURL https://update.greasyfork.org/scripts/380342/filtersBypassInPO.user.js
// @updateURL https://update.greasyfork.org/scripts/380342/filtersBypassInPO.meta.js
// ==/UserScript==

String.prototype.insert = function (index, string) {
    if (index > 0)
      return this.substring(0, index) + string + this.substring(index, this.length);
    else
      return string + this;
  };

var offensiveRegexes = 
[
    //для 14.03
    /(^|\s)[aaoo]?л[еeё]ш([еe]нь)?к[аaуyиеe]/imu,                                                         
    /(^|\s)[сc]?к[аaеeоo]к[хx]?[еeёоo]?л/imu,                                                             
    /к(ибер|опро)сот/imu,                                                                                 
    /[кk][рp]я[кk]л/imu,                                                                                  
    /л[еe][хx][аa]и[мm]/imu,                                                                              
    /л[еeиuя][б6][еeиuуyя][рp]([дg]|[аa][кkнhсcхxш]|[оo][иu][дg])/imu,                                    
    /[мm][аa]й[дg][аa][уy]н/imu,                                                                          
    /(^|\s)[мm][аa][нh](я|ю[нh]\S+|[ьb]([кk]\S+)?)([.,!?\s]|$)/imu,                                       
    /(^|\s)[мm][аa]ш[кk]/imu,                                                                             
    /[нh][аa][вb][аa]л(яш|[ьb][нh]([еёeоo][б6дgсcнh]|ятt))/imu,                                           
    /[оo0][кk][аa][тt]ыш/imu,                                                                             
    /(ольк|лахт)\S+\sиз\sфбк/imu,                                                                         
    /([нh][аa][сc][рp][аa]|[xх][уy]я|(^|\s)[оo][вbнh][аa])л[ьb][нh]/imu,                                  
    /[пn][еeиu][нh][дg][оo][сc]/imu,                                                                      
    /под кроватью/imu,                                                                                    
    /(^|\s)[пn][оo][рp][оo][сc]\S/imu,                                                                    
    /[пn][оo][рp][оo][хx][оo](?![вм])/imu,                                                                
    /(^|\s)[пn]я[тt][аa][кk]/imu,                                                                         
    /(^|\s)[рp][аaоo]г[уy]л/imu,                                                                          
    /редактор\S{0,3}\s+соц\.?\s?сет/imu,                                                                  
    /[сc][вb][иuыi][дg][оo][мm]\S+/imu,                                                                   
    /[сc][вb][иuыi][нh](?!ин|ь|оф|с[кт])/imu,                                                             
    /[сc][иuыi][сc][ьb][кk]\S{4,}/imu,                                                                    
    /(^|\s|под)[сc][иu][сc]я(ль)?[нh]+(?!д)/imu,                                                          
    /[сc][рp]ы[нh][оoь]?[кkч]/imu,                                                                        
    /сшашк/imu,                                                                                           
    /(^|\s)[тt][аa][рp][аa][сc]\S*\s(?!шев)/imu,                                                          
    /[уy][кk][рp][оo][пn]/imu,                                                                            
    /(([уy][сc]|[кk][оo][пn])[рp]у?[аaоo]|\S[аaиоoуy][рp][уyоo]|[уy][рp][кk][аa])(и[нh]|нд)/imu,          
    /[хx][аиоaoui][хx][иuоoi]?л/imu,                                                                      
    /[хx][рp]([ю](?!че)|я[кk])/imu,                                                                       
    /ч[уy][б6][аa][тt]/imu,                                                                               
    /(^|\s)шв[яи]т/imu,                                                                                   
    /Шульман/imu,                                                                                         
    /Месяцеслов/imu,                                                                                      
    /[кk].{0,20}[рp].{0,20}ы.{0,20}[мm].{0,20}[иu].*[нh].*[оo].*[вb].*[оo].*[рp].*[оo].*[сc].*[иu].*я/imu,
  
  //для 19.03
  /(?:^|\s)[aaoo0]?л[еeё]ш(?:[еe][нh][ьb])?[кk][аaуyиеe]/im,
  /(?:^|\s)[сc]?[кk][аaеeоo0][кk][хx]?[еeёоo0]?л/im,
  /[кk](?:[ийiu][б6][еe][pр]|[оo0][пn][рp][оo0])[сc][оo0][тt]/im,
  /[кпkn][оo0][кпkn][оo0][з3][ийiu]ц/im,
  /(?:^|\s)[кk][оo0][пn][рp][оo0](?!т|сл)/im,
  /[кk][рp][оo0][хx][оo0][тt][уy][сc][иiu][кk]/im,
  /[кk][рp]я[кk]л/im,
  /л[еe][хx][аa][ийu][мm]/im,
  /л[еeиuя][б6][еeийuуyя][рp](?:[дg]|[аa][кkнhсcхxш]|[оo0][ийu][дg])/im,
  /[мm][аa][ийiu][дg][аa][уy][нh]/im,
  /(?:^|\s)[мm][аa][нh](?:я(?:[\s.,!?]|$)|ю[нh]|[ьb][кk]?)/im,
  /(?:^|\s)[мm][аa]ш[кk]/im,
  /(?:^|\s)[мm][ийui][вb][ийui][нh]\S/im,
  /[нh][аaоo0][вb][аaоo0]л(?:яш|[ьb][нh](?:[еёeоo](?![вгм]))|я[тt])/im,
  /[оo0][кk][аa][тt][ыьb]ш/im,
  /(?:[оo]л[ьb][кk]|л[аa][хx][тt]|[б6][оo0][тt])\S+\s(?:\S{0,3}\s)?ф[б6][кk]/im,
  /([нh][аa][сc][рp][аa]|(?:[xх][уy]|[пn]ы[нh])я|(?:^|\s)[оo0][вbнh][аa])л[ьb][нh]/im,
  /[пn][еeийu][нh][дg][оo0][сc]/im,
  /[пn][оo0][дg]\s[кk][рp][оo0][вb][аa][тt][ьb]ю/im,
  /[пn][оo0][нh][аa][дg][уy][сc]/im,
  /(?:^|\s)[пn][оo0][рp][оo0][сc]\S/im,
  /[пn][оo0][рp][оo0][хx][оo0](?![вм])/im,
  /(?:^|\s)[пn]я[тt][аa](?:ч[оo0])?[кk]/im,
  /(?:^|\s)[рp][аaоo]г[уy]л/im,
  /[рp][еe][дg][аa]\S{4,7}\s(?:\S+\s)?[сc][оo0]ц\S*?\s?[сc][еe][тt]/im,
  /[сc][вb][ийuыi][дg][оo0][мm]/im,
  /[сc][вb][ийuыi][нh](?!ин|ь|оф|с[кт]|е?[йц]|(?:ая|о(?:го|е|й|му)|ую|ым)([\s.,!?]|$))/im,
  /[сc][иuыi][сc][ьb][кk]\S{4,}/im,
  /(?:^|\s|[пn][оo0][дg])[сc][ийu][сc]([яийiu](л[ьb])?[нh]+(?!д))/im,
  /[сc][рp]ы[нh][оo0ь]?[кkч]/im,
  /сшашк/im,
  /(?:^|\s)[тt][аa][рp][аa][сc]\S*?(?!\sшев)/im,
  /[уy][кk][рp][оo0][пn]/im,
  /[уy]([сc][рp]|[рp][кk])([аaоo0уy][иiu]|[уy][аa])[нh]/im,
  /[хx][аийоao0ui][хx][ийuоo0i]?л/im,
  /[хx][рp]([ю](?!че)|я[кk])/im,
  /ч[уy][б6][аa][тt]/im,
  /ш[вb][аa][йийiu][нh]/im,
  /(?:^|\s)[шщ][вb][яи][тt]/im,
  /ш[пn][рp][оo][тt]/im,
  /Шульман/im,
  /Месяцеслов/im,
  /[кk].{0,5}[рp].{0,5}ы.{0,5}[мm].{0,5}[ийu].*[нh].*[оo].*[вb].*[оo].*[рp].*[оo].*[сc].*[ийu].*я/im,
  /(?=[кkрpымmнhоoвbсcийuiя\s]{17,23})(?:[кk]?[рp]?ы?[мm]?\s?[нh]?[оo]?[вb]?[оo]?[рp]?[оo]?[сc]*[ийui]?я?){17,23}/im
  
  ];

var delimiters = ["[sup],[/sup]", "[sup].[/sup]"];

var opts = document.getElementsByClassName("desktop postform__raw options")[0];

var scriptMark = document.createElement("input"); 
scriptMark.setAttribute("type", "checkbox");
scriptMark.setAttribute("id", "need_spoof");
opts.appendChild(scriptMark); 

var descr = document.createElement("label"); 
descr.innerHTML = " Зашифровать обидные слова"; 
descr.htmlFor = "need_spoof";
opts.appendChild(descr); 

scriptMark.checked = false;

document.getElementById("submit").onclick = function() 
{
    spoof("shampoo");
};

Array.from(document.getElementsByClassName("postbtn-reply-href post__reflink")).forEach(
    function(element, index, array) 
    {
        element.onclick = function ()
        {
            document.getElementById("qr-submit").onclick = function() 
            {
                spoof("qr-shampoo");
            };
        }
    }
);


function spoof(bodyId) 
{
    if (!document.getElementById("need_spoof").checked)
    {
        return;
    }

    var msgBody = document.getElementById(bodyId);
    var newText = "";

    Array.from(msgBody.value.trim().split(/\n/)).forEach(
        function(line, index, array) 
        {
            Array.from(line.split(/\s/)).forEach(
                function(word, index, array)
                {
                    newText += ensureSafe(word) + ' ';
                });

            newText += '\n';
        }
    );

    /* старая версия

    for (var i = 0; i < text.length; i++) 
    {
        let s = text.charAt(i);
        if (/^[\u0400-\u04FF ]+$/.test(s))
        {
            s += delimiters[i % 2].repeat(i % 3);
        }
        newText += s;
    }*/

    msgBody.value = newText;
}

function ensureSafe(word) 
{
    for (var pattern of offensiveRegexes) 
    {
        if (pattern.test(word))
        {
            return makeSafe(word, pattern);
        }
       
    }
    
    return word;
}

function makeSafe(word, pattern) 
{
    while (pattern.test(word))
    {
        let pos = rand(1, word.length - 1);
        if (!(/^[\u0400-\u04FF ]+$/.test(word[pos])))
        {
            continue;
        }
        let delimIndex = rand(0, delimiters.length - 1);
        word = word.insert(pos, delimiters[delimIndex]);
        
    }

    return word;
}

function rand(min, max) 
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}