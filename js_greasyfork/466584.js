// ==UserScript==
// @name         SA's EXTENSION
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  My extension is to help homeschoolers and programmers!
// @author       SQUISHYACORN800
// @match        https://*/*
// @icon         data:image/png;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466584/SA%27s%20EXTENSION.user.js
// @updateURL https://update.greasyfork.org/scripts/466584/SA%27s%20EXTENSION.meta.js
// ==/UserScript==
(function() {
    'use strict';

//first button
let btn = document.createElement("button");
btn.setAttribute("id","BTN_SA");
btn.innerHTML = "Website";
document.body.appendChild(btn);
document.getElementById("BTN_SA").style.color = "white";
document.getElementById("BTN_SA").style.background = "lightgreen";
document.getElementById("BTN_SA").style.width = "160px";
document.getElementById("BTN_SA").style.height = "45px";
document.getElementById("BTN_SA").style.border = "thin solid white";
document.getElementById("BTN_SA").style.fontFamily = "Comic Sans MS";
document.getElementById("BTN_SA").style.fontSize = "16px";
document.getElementById("BTN_SA").style.margin = "150px 0 0 0";
document.getElementById("BTN_SA").style.borderRadius = "7px";
document.getElementById("BTN_SA").style.cursor = "pointer";
document.getElementById("BTN_SA").style.fontWeight = "900";
document.getElementById("BTN_SA").addEventListener("click", sa);
function sa() {
  window.open('https://squishyacorn800.azurewebsites.net/');
}
let btnsrc = document.createElement("button");
btnsrc.setAttribute("id","BTN_IFRMSRC");
btnsrc.innerHTML = "MUSIC";
document.body.appendChild(btnsrc);
document.getElementById("BTN_IFRMSRC").style.color = "white";
document.getElementById("BTN_IFRMSRC").style.background = "lightgreen";
document.getElementById("BTN_IFRMSRC").style.width = "160px";
document.getElementById("BTN_IFRMSRC").style.height = "45px";
document.getElementById("BTN_IFRMSRC").style.border = "thin solid white";
document.getElementById("BTN_IFRMSRC").style.fontFamily = "Comic Sans MS";
document.getElementById("BTN_IFRMSRC").style.fontSize = "16px";
document.getElementById("BTN_IFRMSRC").style.left = "174px";
document.getElementById("BTN_IFRMSRC").style.top = "53px";
document.getElementById("BTN_IFRMSRC").style.position = "absolute";
document.getElementById("BTN_IFRMSRC").style.borderRadius = "7px";
document.getElementById("BTN_IFRMSRC").style.cursor = "pointer";
document.getElementById("BTN_IFRMSRC").style.fontWeight = "900";
document.getElementById("BTN_IFRMSRC").addEventListener("click", srcc);
        btnsrc.addEventListener('mouseover', function handleMouseOver() {
            btnsrc.style.background = 'green';
        });

        btnsrc.addEventListener('mouseout', function handleMouseOut() {
            btnsrc.style.background = 'lightgreen';
        });
function srcc() {
  var ifrmSrc = prompt("URL of the youtube song? :REMEMBER TO PUT EMBED/ AFTER YOUTUBE.COM/:");
    var ifrm = document.createElement("iframe");
    ifrm.setAttribute("src", ifrmSrc);
    ifrm.style.width = "160px";
    ifrm.style.height = "90px";
    ifrm.style.position = "absolute";
    ifrm.style.top = "174px";
    ifrm.style.border = "none";
    document.body.appendChild(ifrm);
    document.getElementById("myDIV").appendChild(ifrm);
}

    let btncel = document.createElement("button");
btncel.setAttribute("id","BTN_createElement");
btncel.innerHTML = "Create Element";
document.body.appendChild(btncel);
document.getElementById("BTN_createElement").style.color = "white";
document.getElementById("BTN_createElement").style.background = "lightgreen";
document.getElementById("BTN_createElement").style.width = "160px";
document.getElementById("BTN_createElement").style.height = "45px";
document.getElementById("BTN_createElement").style.margin = "2px 0 0 10px";
document.getElementById("BTN_createElement").style.border = "thin solid white";
document.getElementById("BTN_createElement").style.fontFamily = "Comic Sans MS";
document.getElementById("BTN_createElement").style.fontSize = "16px";
document.getElementById("BTN_createElement").style.borderRadius = "7px";
document.getElementById("BTN_createElement").style.cursor = "pointer";
document.getElementById("BTN_createElement").style.fontWeight = "900";
document.getElementById("BTN_createElement").addEventListener("click", btncelfunction);
function btncelfunction() {
    var strElementType = prompt("What do you want to create? Button or Div?");
    //var strElName = prompt("Give it a name? :WHATEVER YOU WANT:");
    var strId = prompt("Give it an id? :IMPORTANT REMEMBER THIS:");
    var DN = prompt("Display name?");
    var WBC = prompt("What background colour? :HEX CODES ALOWED:");
    var WC = prompt("What text colour? :HEX CODES ALOWED:");
    var elParent = document.createElement(strElementType);
    elParent.setAttribute("id",strId);
    elParent.innerHTML = DN;
    document.body.appendChild(elParent);
    if (strElementType == "button"){
        elParent.style.cursor = "pointer";
        elParent.style.padding = "10px";
        elParent.style.borderRadius = "7px";

        elParent.addEventListener('mouseover', function handleMouseOver() {
            elParent.style.background = 'green';
        });

        elParent.addEventListener('mouseout', function handleMouseOut() {
            elParent.style.background = WBC;
        });
    }else{
        var DW = prompt("Width? :PX PREFERED:");
        var DH = prompt("Height? :PX PREFERED:");
        elParent.style.width = DW;
        elParent.style.height = DH;
        elParent.style.top = "150px";
        elParent.style.left = "300px";
        elParent.style.position = "fixed";
        elParent.style.zindex = "999999999";
        let btnapen = document.createElement("button");
        btnapen.setAttribute("id","BTN_append");
        btnapen.innerHTML = "Append";
        document.body.appendChild(btnapen);
        document.getElementById("devtools").appendChild(btnapen);
        btnapen.style.color = "white";
        btnapen.style.background = "lightgreen";
        btnapen.style.width = "160px";
        btnapen.style.height = "45px";
        btnapen.style.margin = "2px 0 0 0";
        btnapen.style.border = "thin solid white";
        btnapen.style.fontFamily = "Comic Sans MS";
        btnapen.style.fontSize = "16px";
        btnapen.style.borderRadius = "7px";
        btnapen.style.cursor = "pointer";
        btnapen.style.fontWeight = "900";
        btnapen.addEventListener("click", btnapenfunction);
        btnapen.addEventListener('mouseover', function handleMouseOver() {
        btnapen.style.background = 'green';
        });
        btnapen.addEventListener('mouseout', function handleMouseOut() {
        btnapen.style.background = 'lightgreen';
        });
        function btnapenfunction() {
            var strBtnId = prompt("The id of what you want to append :BUTTON ID:");
            var btnChild = document.getElementById(strBtnId);
            elParent.appendChild(btnChild);
        }
    };
    elParent.style.background = WBC;
    elParent.style.color = WC;
    elParent.style.border = "thin solid white";
    elParent.style.fontFamily = "Comic Sans MS";
    elParent.style.fontSize = "16px";
    elParent.style.fontWeight = "900";
    alert("Welldone, your element has been created.");

        //Make the DIV element draggagle:
dragElement7(elParent);

function dragElement7(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (elParent) {
    /* if present, the header is where you move the DIV from:*/
    elParent.onmousedown = dragMouseDown7;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown7;
  }

  function dragMouseDown7(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement7;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag7;
  }

  function elementDrag7(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement7() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
}

btncel.addEventListener('mouseover', function handleMouseOver() {
btncel.style.background = 'green';
});
btncel.addEventListener('mouseout', function handleMouseOut() {
btncel.style.background = 'lightgreen';
});

    let btnedit = document.createElement("button");
btnedit.setAttribute("id","BTN_edit");
btnedit.innerHTML = "Edit Text";
document.body.appendChild(btnedit);
document.getElementById("BTN_edit").style.color = "white";
document.getElementById("BTN_edit").style.background = "lightgreen";
document.getElementById("BTN_edit").style.width = "160px";
document.getElementById("BTN_edit").style.height = "45px";
document.getElementById("BTN_edit").style.margin = "2px 0 0 0";
document.getElementById("BTN_edit").style.border = "thin solid white";
document.getElementById("BTN_edit").style.fontFamily = "Comic Sans MS";
document.getElementById("BTN_edit").style.fontSize = "16px";
document.getElementById("BTN_edit").style.borderRadius = "7px";
document.getElementById("BTN_edit").style.cursor = "pointer";
document.getElementById("BTN_edit").style.fontWeight = "900";
document.getElementById("BTN_edit").addEventListener("click", btneditfunction);
function btneditfunction() {
    if(document.documentElement.contentEditable == "inherit" || document.documentElement.contentEditable == "false"){
        document.documentElement.contentEditable = "true";
    }else{
        document.documentElement.contentEditable = "false";
    }
}


btnedit.addEventListener('mouseover', function handleMouseOver() {
btnedit.style.background = 'green';
});
btnedit.addEventListener('mouseout', function handleMouseOut() {
btnedit.style.background = 'lightgreen';
});

    let btnmaths = document.createElement("button");
btnmaths.setAttribute("id","BTN_maths");
btnmaths.innerHTML = "maths";
document.body.appendChild(btnmaths);
document.getElementById("BTN_maths").style.color = "white";
document.getElementById("BTN_maths").style.background = "lightgreen";
document.getElementById("BTN_maths").style.width = "160px";
document.getElementById("BTN_maths").style.height = "45px";
document.getElementById("BTN_maths").style.margin = "2px 0 0 0";
document.getElementById("BTN_maths").style.border = "thin solid white";
document.getElementById("BTN_maths").style.fontFamily = "Comic Sans MS";
document.getElementById("BTN_maths").style.fontSize = "16px";
document.getElementById("BTN_maths").style.borderRadius = "7px";
document.getElementById("BTN_maths").style.cursor = "pointer";
document.getElementById("BTN_maths").style.fontWeight = "900";
document.getElementById("BTN_maths").addEventListener("click", btn05);
    let btneditex = document.createElement("button");
btneditex.setAttribute("id","BTN_editextension");
btneditex.innerHTML = "Help";
document.body.appendChild(btneditex);
document.getElementById("BTN_editextension").style.color = "white";
document.getElementById("BTN_editextension").style.background = "lightgreen";
document.getElementById("BTN_editextension").style.width = "160px";
document.getElementById("BTN_editextension").style.height = "45px";
document.getElementById("BTN_editextension").style.top = "100px";
document.getElementById("BTN_editextension").style.left = "4px";
document.getElementById("BTN_editextension").style.position = "absolute";
document.getElementById("BTN_editextension").style.margin = "2px 0 0 0";
document.getElementById("BTN_editextension").style.border = "thin solid white";
document.getElementById("BTN_editextension").style.fontFamily = "Comic Sans MS";
document.getElementById("BTN_editextension").style.fontSize = "16px";
document.getElementById("BTN_editextension").style.borderRadius = "7px";
document.getElementById("BTN_editextension").style.cursor = "pointer";
document.getElementById("BTN_editextension").style.fontWeight = "900";
document.getElementById("BTN_editextension").addEventListener("click", btn08);
function btn08() {
    alert("Tutorial");
    alert("Top two buttons open munus, the devtool buttons are edit text, create element, music and add functions to the element. The homeschool buttons lead to khanacademy for maths, udemy for ict and duolingo for foreign language");
    alert("Bottom two buttons link to my Website and my YouTube. SUBSCRIBE?");
    alert("The create element button creates either a button or a pannel from you spesific settings, and the add functions button adds a function to a button. :NOT TO BE USED ON A DIV:");
    alert("Thanks for choosing SA's EXTENSION.");
}
btneditex.addEventListener('mouseover', function handleMouseOver() {
btneditex.style.background = 'green';
});
btneditex.addEventListener('mouseout', function handleMouseOut() {
btneditex.style.background = 'lightgreen';
});
    let btnaddfunctions = document.createElement("button");
btnaddfunctions.setAttribute("id","BTN_Functions");
btnaddfunctions.innerHTML = "Add Functions";
document.body.appendChild(btnaddfunctions);
document.getElementById("BTN_Functions").style.color = "white";
document.getElementById("BTN_Functions").style.background = "lightgreen";
document.getElementById("BTN_Functions").style.width = "160px";
document.getElementById("BTN_Functions").style.height = "45px";
document.getElementById("BTN_Functions").style.top = "100px";
document.getElementById("BTN_Functions").style.left = "174px";
document.getElementById("BTN_Functions").style.position = "absolute";
document.getElementById("BTN_Functions").style.margin = "2px 0 0 0";
document.getElementById("BTN_Functions").style.border = "thin solid white";
document.getElementById("BTN_Functions").style.fontFamily = "Comic Sans MS";
document.getElementById("BTN_Functions").style.fontSize = "16px";
document.getElementById("BTN_Functions").style.borderRadius = "7px";
document.getElementById("BTN_Functions").style.cursor = "pointer";
document.getElementById("BTN_Functions").style.fontWeight = "900";
document.getElementById("BTN_Functions").addEventListener("click", btn09);
    function btn09() {
    prompt("hi");
}
btnaddfunctions.addEventListener('mouseover', function handleMouseOver() {
btnaddfunctions.style.background = 'green';
});
btnaddfunctions.addEventListener('mouseout', function handleMouseOut() {
btnaddfunctions.style.background = 'lightgreen';
});
    let btnict = document.createElement("button");
btnict.setAttribute("id","BTN_ict");
btnict.innerHTML = "ict";
document.body.appendChild(btnict);
document.getElementById("BTN_ict").style.color = "white";
document.getElementById("BTN_ict").style.background = "lightgreen";
document.getElementById("BTN_ict").style.width = "160px";
document.getElementById("BTN_ict").style.height = "45px";
document.getElementById("BTN_ict").style.margin = "2px 0 0 0";
document.getElementById("BTN_ict").style.border = "thin solid white";
document.getElementById("BTN_ict").style.fontFamily = "Comic Sans MS";
document.getElementById("BTN_ict").style.fontSize = "16px";
document.getElementById("BTN_ict").style.cursor = "pointer";
document.getElementById("BTN_ict").style.fontWeight = "900";
document.getElementById("BTN_ict").style.borderRadius = "7px";
document.getElementById("BTN_ict").addEventListener("click", btn06);


    var table = document.createElement("table");

// Create an array of data rows
var data = [
  ["Created By:", "Date", "Version", "Using"],
  ["SQUISHYACORN800", "5/18/2023", "1.0", "Javascript"]
];

// Create table rows and cells using the data array
for (var i = 0; i < data.length; i++) {
  var row = document.createElement("tr");

  for (var j = 0; j < data[i].length; j++) {
    var cell = document.createElement(i === 0 ? "th" : "td");
    var cellText = document.createTextNode(data[i][j]);
    cell.appendChild(cellText);
    row.appendChild(cell);
    cell.style.color = "green";
    table.style.position = "absolute";
    table.style.top = "370px";
    table.style.left = "2px";
    cell.style.padding = "8px";
    cell.style.fontSize = "12px";
  }

  table.appendChild(row);
}

// Append the table to the document body
document.body.appendChild(table);


    let btnlang = document.createElement("button");
btnlang.setAttribute("id","BTN_language");
btnlang.innerHTML = "language";
document.body.appendChild(btnlang);
document.getElementById("BTN_language").style.color = "white";
document.getElementById("BTN_language").style.background = "lightgreen";
document.getElementById("BTN_language").style.width = "160px";
document.getElementById("BTN_language").style.height = "45px";
document.getElementById("BTN_language").style.margin = "2px 0 0 0";
document.getElementById("BTN_language").style.border = "thin solid white";
document.getElementById("BTN_language").style.fontFamily = "Comic Sans MS";
document.getElementById("BTN_language").style.fontSize = "16px";
document.getElementById("BTN_language").style.borderRadius = "7px";
document.getElementById("BTN_language").style.cursor = "pointer";
document.getElementById("BTN_language").style.fontWeight = "900";
document.getElementById("BTN_language").addEventListener("click", btn07);
    //createing the element, button
let btn2 = document.createElement("button");
btn2.setAttribute("id","BTN_2");
btn2.innerHTML = "DevTools";
document.body.appendChild(btn2);
document.getElementById("BTN_2").style.color = "white";
document.getElementById("BTN_2").style.background = "lightgreen";
document.getElementById("BTN_2").style.width = "160px";
document.getElementById("BTN_2").style.height = "45px";
document.getElementById("BTN_2").style.border = "thin solid white";
document.getElementById("BTN_2").style.fontFamily = "Comic Sans MS";
document.getElementById("BTN_2").style.fontSize = "16px";
document.getElementById("BTN_2").style.borderRadius = "7px";
document.getElementById("BTN_2").style.cursor = "pointer";
document.getElementById("BTN_2").addEventListener("click", btn03);
document.getElementById("BTN_2").style.fontWeight = "900";
let im = document.createElement("img");
im.setAttribute("id","img");
document.body.appendChild(im);
document.getElementById("img").src = "https://squishyacorn800.azurewebsites.net/whats%20a%20slogan.png";
document.getElementById("img").style.width = "160px";
document.getElementById("img").style.height = "45px";
document.getElementById("img").style.margin = "2px 0 0 0";
let dev = document.createElement("div");
dev.setAttribute("id","devtools");
document.body.appendChild(dev);
document.getElementById("devtools").style.color = "white";
document.getElementById("devtools").style.background = "lightgreen";
document.getElementById("devtools").style.width = "340px";
document.getElementById("devtools").style.height = "450px";
document.getElementById("devtools").style.display = "none";
document.getElementById("devtools").style.border = "thin solid white";
document.getElementById("devtools").style.position = "fixed";
document.getElementById("devtools").style.zindex = "999999999";
document.getElementById("devtools").style.top = "150px";
document.getElementById("devtools").style.left = "300px";
document.getElementById("devtools").style.padding = "4px 4px 4px 4px";
document.getElementById("devtools").style.fontFamily = "Comic Sans MS";
document.getElementById("devtools").style.fontSize = "7px";
document.getElementById("devtools").style.textAlign = "bottom";
document.getElementById("devtools").style.fontWeight = "900";
    let sch = document.createElement("div");
sch.setAttribute("id","homeschool");
document.body.appendChild(sch);
document.getElementById("homeschool").style.color = "white";
document.getElementById("homeschool").style.background = "lightgreen";
document.getElementById("homeschool").style.width = "170px";
document.getElementById("homeschool").style.height = "152px";
document.getElementById("homeschool").style.display = "none";
document.getElementById("homeschool").style.border = "thin solid white";
document.getElementById("homeschool").style.position = "fixed";
document.getElementById("homeschool").style.zindex = "999999999";
document.getElementById("homeschool").style.top = "150px";
document.getElementById("homeschool").style.padding = "4px 4px 4px 4px";
document.getElementById("homeschool").style.fontFamily = "Comic Sans MS";
document.getElementById("homeschool").style.left = "600px";
document.getElementById("homeschool").style.fontSize = "7px";
document.getElementById("homeschool").style.textAlign = "bottom";
document.getElementById("homeschool").style.fontWeight = "900";

let copyr = document.createElement("div");
copyr.setAttribute("id","copyright");
copyr.innerHTML = "COPYRIGHT SQUISHYACORN800.AZUREWEBSITES.NET";
document.body.appendChild(copyr);
document.getElementById("copyright").style.color = "green";
document.getElementById("copyright").style.background = "lightgreen";
document.getElementById("copyright").style.width = "160px";
document.getElementById("copyright").style.height = "45px";
document.getElementById("copyright").style.fontFamily = "Comic Sans MS";
document.getElementById("copyright").style.margin = "10px 0 0 0";
document.getElementById("copyright").style.fontSize = "7px";
document.getElementById("copyright").style.fontWeight = "900";
    //createing the element, button
let btn3 = document.createElement("button");
btn3.setAttribute("id","BTN_3");
btn3.innerHTML = "HomeSchooling";
document.body.appendChild(btn3);
document.getElementById("BTN_3").style.color = "white";
document.getElementById("BTN_3").style.background = "lightgreen";
document.getElementById("BTN_3").style.width = "160px";
document.getElementById("BTN_3").style.height = "45px";
document.getElementById("BTN_3").style.margin = "2px 0 0 0";
document.getElementById("BTN_3").style.border = "thin solid white";
document.getElementById("BTN_3").style.fontFamily = "Comic Sans MS";
document.getElementById("BTN_3").style.fontSize = "16px";
document.getElementById("BTN_3").style.borderRadius = "7px";
document.getElementById("BTN_3").style.cursor = "pointer";
document.getElementById("BTN_3").style.fontWeight = "900";
document.getElementById("BTN_3").addEventListener("click", btn04);

//createing the element, button
let btn1 = document.createElement("button");

//adding id BTN_1 to the button
btn1.setAttribute("id","BTN_1");

//setting the text in the button to YouTube
btn1.innerHTML = "YouTube";

//displaying the button
document.body.appendChild(btn1);

//styling the button
document.getElementById("BTN_1").style.color = "white";
document.getElementById("BTN_1").style.background = "lightgreen";
document.getElementById("BTN_1").style.width = "160px";
document.getElementById("BTN_1").style.height = "45px";
document.getElementById("BTN_1").style.border = "thin solid white";
document.getElementById("BTN_1").style.fontFamily = "Comic Sans MS";
document.getElementById("BTN_1").style.fontSize = "16px";
document.getElementById("BTN_1").style.margin = "2px 0 0 0";
document.getElementById("BTN_1").style.cursor = "pointer";
document.getElementById("BTN_1").style.borderRadius = "7px";
document.getElementById("BTN_1").style.fontWeight = "900";

//adding functions to the button when it's clicked
document.getElementById("BTN_1").addEventListener("click", function1);

//what the button does
function function1() {
  window.open('https://www.youtube.com/channel/UCMxlm0Qfglm_2Om3dfCleoQ');
}
//second button
let btn4 = document.createElement("button");
btn4.setAttribute("id","BTN_MENU");
btn4.innerHTML = "&#127989;";
document.body.appendChild(btn4);
document.getElementById("BTN_MENU").style.color = "white";
document.getElementById("BTN_MENU").style.background = "lightgreen";
document.getElementById("BTN_MENU").style.width = "45px";
document.getElementById("BTN_MENU").style.height = "45px";
document.getElementById("BTN_MENU").style.border = "thin solid white";
document.getElementById("BTN_MENU").style.position = "fixed";
document.getElementById("BTN_MENU").style.zindex = "999999999";
document.getElementById("BTN_MENU").style.top = "500px";
document.getElementById("BTN_MENU").style.fontFamily = "Comic Sans MS";
document.getElementById("BTN_MENU").style.left = "640px";
document.getElementById("BTN_MENU").style.fontSize = "28px";
document.getElementById("BTN_MENU").style.cursor = "pointer";
document.getElementById("BTN_MENU").style.borderRadius = "25px 25px 25px 25px";
document.getElementById("BTN_MENU").style.fontWeight = "900";
document.getElementById("BTN_MENU").addEventListener("click", btn02);


    window.addEventListener('contextmenu', function (e) {
  e.preventDefault();
}, false);

let mydv = document.createElement("div");
mydv.setAttribute("id","myDIV");
document.body.appendChild(mydv);
document.getElementById("myDIV").style.color = "white";
document.getElementById("myDIV").style.background = "lightgreen";
document.getElementById("myDIV").style.width = "170px";
document.getElementById("myDIV").style.height = "450px";
document.getElementById("myDIV").style.display = "none";
document.getElementById("myDIV").style.border = "thin solid white";
document.getElementById("myDIV").style.position = "fixed";
document.getElementById("myDIV").style.zindex = "999999999";
document.getElementById("myDIV").style.top = "150px";
document.getElementById("myDIV").style.padding = "4px 4px 4px 4px";
document.getElementById("myDIV").style.fontFamily = "Comic Sans MS";
document.getElementById("myDIV").style.left = "300px";
document.getElementById("myDIV").style.fontSize = "7px";
document.getElementById("myDIV").style.textAlign = "bottom";
document.getElementById("myDIV").style.fontWeight = "900";
btn4.addEventListener('mouseover', function handleMouseOver() {
  btn4.style.background = 'green';
});
btn4.addEventListener('mouseout', function handleMouseOut() {
  btn4.style.background = 'lightgreen';
});
    btn1.addEventListener('mouseover', function handleMouseOver() {
  btn1.style.background = 'green';
});
btn1.addEventListener('mouseout', function handleMouseOut() {
  btn1.style.background = 'lightgreen';
});
    btn2.addEventListener('mouseover', function handleMouseOver() {
  btn2.style.background = 'green';
});
btn2.addEventListener('mouseout', function handleMouseOut() {
  btn2.style.background = 'lightgreen';
});
    btn3.addEventListener('mouseover', function handleMouseOver() {
  btn3.style.background = 'green';
});
btn3.addEventListener('mouseout', function handleMouseOut() {
  btn3.style.background = 'lightgreen';
});
    btn.addEventListener('mouseover', function handleMouseOver() {
  btn.style.background = 'green';
});
btn.addEventListener('mouseout', function handleMouseOut() {
  btn.style.background = 'lightgreen';
});

      btnmaths.addEventListener('mouseover', function handleMouseOver() {
  btnmaths.style.background = 'green';
});
btnmaths.addEventListener('mouseout', function handleMouseOut() {
  btnmaths.style.background = 'lightgreen';
});
      btnict.addEventListener('mouseover', function handleMouseOver() {
  btnict.style.background = 'green';
});
btnict.addEventListener('mouseout', function handleMouseOut() {
  btnict.style.background = 'lightgreen';
});
      btnlang.addEventListener('mouseover', function handleMouseOver() {
  btnlang.style.background = 'green';
});
btnlang.addEventListener('mouseout', function handleMouseOut() {
  btnlang.style.background = 'lightgreen';
});
function btn02() {
  //open menu
var x = document.getElementById("myDIV");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  };
}

   function btn03() {
  //open menu
var t = document.getElementById("devtools");
  if (t.style.display === "none") {
    t.style.display = "block";
  } else {
    t.style.display = "none";
  };
}

   function btn04() {
  //open menu
var h = document.getElementById("homeschool");
  if (h.style.display === "none") {
    h.style.display = "block";
  } else {
    h.style.display = "none";
  };
}
function btn05() {
  window.open('https://www.khanacademy.org/');
}
    function btn06() {
  window.open('https://www.udemy.com/');
}
    function btn07() {
  window.open('https://www.duolingo.com/');
}
document.getElementById("myDIV").appendChild(btn2);
document.getElementById("myDIV").appendChild(btn3);
document.getElementById("myDIV").appendChild(im);
//ifrm is here!
document.getElementById("myDIV").appendChild(btn);
document.getElementById("myDIV").appendChild(btn1);
document.getElementById("myDIV").appendChild(copyr);

    document.getElementById("homeschool").appendChild(btnmaths);
    document.getElementById("homeschool").appendChild(btnict);
    document.getElementById("homeschool").appendChild(btnlang);

    document.getElementById("devtools").appendChild(btnedit);
    document.getElementById("devtools").appendChild(btncel);
    document.getElementById("devtools").appendChild(btnsrc);
    document.getElementById("devtools").appendChild(btneditex);
    document.getElementById("devtools").appendChild(btnaddfunctions);
    document.getElementById("devtools").appendChild(table);



//Make the DIV element draggagle:
dragElement(document.getElementById("myDIV"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id)) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id).onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}


    //Make the DIV element draggagle:
dragElement4(document.getElementById("homeschool"));

function dragElement4(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id)) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id).onmousedown = dragMouseDown4;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown4;
  }

  function dragMouseDown4(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement4;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag4;
  }

  function elementDrag4(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement4() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
//Make the DIV element draggagle:
dragElement3(document.getElementById("devtools"));

function dragElement3(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id)) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id).onmousedown = dragMouseDown3;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown3;
  }

  function dragMouseDown3(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement3;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag3;
  }

  function elementDrag3(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement3() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}


    //Make the DIV element draggagle:
dragElement2(document.getElementById("BTN_MENU"));

function dragElement2(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id)) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id).onmousedown = dragMouseDown2;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown2;
  }

  function dragMouseDown2(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement2;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag2;
  }

  function elementDrag2(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement2() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

})();
