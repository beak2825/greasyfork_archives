// ==UserScript==
// @name         HP BlackSkin
// @namespace    http://www.hacker-project.com/
// @version      0.3
// @description  Changes some of the icons / colors of HP
// @author       You
// @match        http://www.hacker-project.com/*
// @match        http://hacker-project.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10774/HP%20BlackSkin.user.js
// @updateURL https://update.greasyfork.org/scripts/10774/HP%20BlackSkin.meta.js
// ==/UserScript==

function setup() {
    document.getElementsByTagName("img")[0].setAttribute("src", "http://i.imgur.com/f4Uw6VE.png");
    var classChng = [
        
        ["p", 
         ["color", "lightgray"]
        ],
        
        ["def", 
         ["color", "white"]
        ],
        
        ["yellow", 
         ["color", "white"]
        ],
        
        ["emi6", 
         ["background-color", "#black"], 
         ["border", "1px solid lightgrey"]
        ],
        
        ["p1", 
         ["color", "gray"]
        ],
        
        ["green", 
         ["color", "lightgrey"]
        ],
        
        ["g", 
         ["color", "lightgrey"]
        ],
        
        ["sel2", 
         ["color", "white"], 
         ["background", "black"]
        ],
        
        ["bred", 
         ["background", "black"]
        ],
        
        ["pbig", 
         ["color", "white"]
        ],
        
        ["sm2", 
         ["color", "white"]
        ],
        
        ["bblue", 
         ["color", "#000099"]
        ],
        
        ["lblue",
         ["color", "lightgray"]
        ],
        
        ["logText",
         ["border", "1px solid white"]
        ]
        
    ];
    change(classChng, 0);
    var tagChange = [
    
        ["a", 
         ["color", "white"]
        ],
        
        ["small", 
         ["color", "gray"]
        ],
        
        ["td", 
         ["color", "white"],
         ["background", "black"]
        ]
        
    ];
    change(tagChange, 1);
}
function change(chng, det) {
    for (var clsi = 0; clsi < chng.length; clsi++) {
        var clso = chng[clsi];
        var cls = clso[0];
        for (var pairi = 1; pairi < clso.length; pairi++) {
            var pair = clso[pairi];
            var sc = pair[0];
            var ss = pair[1];
            var elArray;
            if (det===0) elArray = document.getElementsByClassName(cls);
            else elArray = document.getElementsByTagName(cls);
            for (var eli = 0; eli < elArray.length; eli++) {
                var append = elArray[eli].getAttribute("style");
                if (append===null) append = "";
                if (append.substring(append.length-1, append.length) != ";" && append !== "") append += ";";
                elArray[eli].setAttribute("style", append+" "+sc+": "+ss+";");
            }
        }
    }
}
setup();