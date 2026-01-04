// ==UserScript==
// @name         </> Kurt & Java Savcı
// @namespace    http://tampermonkey.net/
// @version      24.5
// @description  Kurt & Java
// @author       Kurt
// @match        http://zombs.io/
// @grant        Ryan Wolf
// @downloadURL https://update.greasyfork.org/scripts/426424/%3C%3E%20Kurt%20%20Java%20Savc%C4%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/426424/%3C%3E%20Kurt%20%20Java%20Savc%C4%B1.meta.js
// ==/UserScript==

let css2 = `
.btn:hover {
cursor: pointer;
}
.btn-blue {
background-color: #010201;
}
.btn-blue:hover .btn-blue:active {
background-color: #010201;
}
.btn:hover {
cursor: pointer;
}
.btn-red {
background-color: #360010;
}
.btn-red:hover .btn-blue:active {
background-color: #360010;
}
.btn:hover {
cursor: pointer;
}
.btn-gold {
background-color: #5a6600;
}
.btn-gold:hover .btn-blue:active {
background-color: #5a6600;
}
.btn:hover {
cursor: pointer;
}
.btn-purple {
background-color: #290033;
}
.btn-purple:hover .btn-blue:active {
background-color: #290033;
}
.btn:hover {
cursor: pointer;
}
.btn-purple {
background-color: #290033;
}
.btn-purple:hover .btn-blue:active {
background-color: #290033;
}
.btn:hover {
cursor: pointer;
}
.btn-green {
background-color: #001603;
}
.btn-green:hover .btn-blue:active {
background-color: #001603;
}
.box {
display: block;
width: 100%;
height: 50px;
line-height: 34px;
padding: 8px 14px;
margin: 0 0 10px;
background: #eee;
border: 0;
font-size: 14px;
box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
border-radius: 4px;
}
.codeIn, .joinOut {
height: 50px;
}
.hud-menu-zipp40 {
display: none;
position: fixed;
top: 48%;
left: 50%;
width: 600px;
height: 470px;
margin: -270px 0 0 -300px;
padding: 20px;
background: rgba(0, 0, 0, 0.6);
color: #eee;
border-radius: 4px;
z-index: 15;
}
.hud-menu-zipp40 h3 {
display: block;
margin: 0;
line-height: 20px;
}
.hud-menu-zipp40 .hud-zipp-grid40 {
display: block;
height: 380px;
padding: 10px;
margin-top: 18px;
background: rgba(0, 0, 0, 0.2);
}
.hud-spell-icons .hud-spell-icon[data-type="Zippity40"]::before {
background-image: url("https://cdn.discordapp.com/emojis/831816740064329808.gif?v=1");
}
.hud-menu-zipp40 .hud-the-tab {
position: relative;
height: 40px;
line-height: 40px;
margin: 20px;
border: 0px solid rgb(0, 0, 0, 0);
}
.hud-menu-zipp40 .hud-the-tab {
display: block;
float: left;
padding: 0 14px;
margin: 0 1px 0 0;
font-size: 14px;
background: rgba(0, 0, 0, 0.4);
color: rgba(255, 255, 255, 0.4);
transition: all 0.15s ease-in-out;
}
.hud-menu-zipp40 .hud-the-tab:hover {
background: rgba(0, 0, 0, 0.2);
color: #eee;
cursor: pointer;
}
`;

let styles = document.createElement("style");
styles.appendChild(document.createTextNode(css2));
document.head.appendChild(styles);

// class changing
document.getElementsByClassName("hud-intro-form")[0].style.height = "300px";
document.getElementsByClassName("hud-intro-play")[0].setAttribute("class", "btn btn-blue hud-intro-play");

// spell icon
let spell = document.createElement("div");
spell.classList.add("hud-spell-icon");
spell.setAttribute("data-type", "Zippity40");
spell.classList.add("hud-zipp40-icon");
document.getElementsByClassName("hud-spell-icons")[0].appendChild(spell);

//Menu for spell icon
let modHTML = `
<div class="hud-menu-zipp40">
<br />
<div class="hud-zipp-grid40">
</div>
</div>
`;
document.body.insertAdjacentHTML("afterbegin", modHTML);
let zipz123 = document.getElementsByClassName("hud-menu-zipp40")[0];

//Onclick
document.getElementsByClassName("hud-zipp40-icon")[0].addEventListener("click", function() {
  if(zipz123.style.display == "none") {
    zipz123.style.display = "block";
    for(var i = 0; i < menus.length; i++) {
      menus[i].style.display = "none";
    }
  } else {
        zipz123.style.display = "none";
  };
});

let _menu = document.getElementsByClassName("hud-menu-icon");
let _spell = document.getElementsByClassName("hud-spell-icon");
let allIcon = [
        _menu[0],
        _menu[1],
        _menu[2],
  _spell[0],
  _spell[1]
];

allIcon.forEach(function(elem) {
        elem.addEventListener("click", function() {
                if(zipz123.style.display == "block") {
                        zipz123.style.display = "none";
                };
        });
});

// key to open and close
function modm() {
        if(zipz123.style.display == "none") {
    zipz123.style.display = "block";
    for(var i = 0; i < menus.length; i++) {
      menus[i].style.display = "none";
    }
  } else {
        zipz123.style.display = "none";
  };
};

  document.getElementsByClassName("hud-zipp-grid40")[0].innerHTML = `
<div style="text-align:center"><br>
<hr />
<h3>• Kurt & Java Savcı</h3>
<hr />
<button type="submit" class="btn btn-blue hud-intro-play">Bul</button>
<input type="text" class="hud-intro-name" maxlength="16" placeholder="İsmin" style="border-radius: 1em; color: rgb(255, 255, 255); border: 2px solid rgb(0, 4, 46); background-color: rgb(8, 8, 8);">
</div>
<select class="hud-intro-server" style="border-radius: 1em; color: rgb(255, 255, 255); border: 2px solid rgb(0, 4, 46); background-color: rgb(8, 8, 8);">
                                                    <optgroup label="US East">
                                                                                                                                                                                                                        <option value="v32306117">US East #1, Population: {32/32}</option>
                                                                                                                                                                                                                        <option value="v32306125">US East #2, Population: {28/32}</option>
                                                                                                                                                                                                                        <option value="v32306121">US East #3, Population: {25/32}</option>
                                                                                                                                                                                                                        <option value="v32306122">US East #4, Population: {25/32}</option>
                                                                                                                                                                                                                        <option value="v32306119">US East #5, Population: {14/32}</option>
                                                                                                                                                                                                                        <option value="v32306123">US East #6, Population: {23/32}</option>
                                                                                                                                                                                                                        <option value="v32306124">US East #7, Population: {25/32}</option>
                                                                                                                                                                                                                        <option value="v32306126">US East #8, Population: {22/32}</option>
                                                                                                                                                                                                                        <option value="v32306120">US East #9, Population: {11/32}</option>
                                                                                                                                                                                                                        <option value="v32306118">US East #10, Population: {13/32}</option>
                                                                                                                                                                                                                        <option value="v32306139">US East #11, Population: {10/32}</option>
                                                                                                                                                                                                                        <option value="v32306141">US East #12, Population: {11/32}</option>
                                                                                                                                                                                                                        <option value="v32306142">US East #13, Population: {25/32}</option>
                                                                                                                                                                                                                        <option value="v32306143">US East #14, Population: {10/32}</option>
                                                                                                                                                                                                                        <option value="v32306140">US East #15, Population: {25/32}</option>
                                                                                                                                                                                                                        <option value="v32306137">US East #16, Population: {26/32}</option>
                                                                                                                                                                                                                        <option value="v32306144">US East #17, Population: {13/32}</option>
                                                                                                                                            <option value="v32306146">US East #18, Population: {4/32}</option>
                                                                                                                                            <option value="v32306138">US East #19, Population: {9/32}</option>
                                                                                                                                                                                                                        <option value="v32306145">US East #20, Population: {24/32}</option>
                                                                                                                                            <option value="v32306165">US East #21, Population: {3/32}</option>
                                                                                                                                            <option value="v32306164">US East #22, Population: {6/32}</option>
                                                                                                                                            <option value="v32306157">US East #23, Population: {5/32}</option>
                                                                                                                                            <option value="v32306160">US East #24, Population: {3/32}</option>
                                                                                                                                            <option value="v32306163">US East #25, Population: {7/32}</option>
                                                                                                                                                                                                                        <option value="v32306166">US East #26, Population: {16/32}</option>
                                                                                                                                            <option value="v32306161">US East #27, Population: {5/32}</option>
                                                                                                                                            <option value="v32306158">US East #28, Population: {1/32}</option>
                                                                                                                                                                                                                        <option value="v32306159">US East #29, Population: {32/32}</option>
                                                                                                                                            <option value="v32306162">US East #30, Population: {3/32}</option>
                                                                                                                                            <option value="v32306174">US East #31, Population: {7/32}</option>
                                                                                                                                            <option value="v32306173">US East #32, Population: {5/32}</option>
                                                            </optgroup>
                                                    <optgroup label="US West">
                                                                                                                                            <option value="v32305606">US West #1, Population: {4/32}</option>
                                                                                                                                            <option value="v32305607">US West #2, Population: {3/32}</option>
                                                                                                                                                                                                                        <option value="v32305611">US West #3, Population: {26/32}</option>
                                                                                                                                            <option value="v32305613">US West #4, Population: {5/32}</option>
                                                                                                                                                                                                                        <option value="v32305605">US West #5, Population: {26/32}</option>
                                                                                                                                            <option value="v32305608">US West #6, Population: {4/32}</option>
                                                                                                                                            <option value="v32305612">US West #7, Population: {0/32}</option>
                                                                                                                                                                                                                        <option value="v32305609">US West #8, Population: {26/32}</option>
                                                                                                                                            <option value="v32305610">US West #9, Population: {1/32}</option>
                                                                                                                                            <option value="v32305621">US West #10, Population: {0/32}</option>
                                                                                                                                            <option value="v32305622">US West #11, Population: {8/32}</option>
                                                                                                                                                                                                                        <option value="v32305625">US West #12, Population: {26/32}</option>
                                                                                                                                            <option value="v32305624">US West #13, Population: {4/32}</option>
                                                                                                                                                                                                                        <option value="v32305626">US West #14, Population: {14/32}</option>
                                                                                                                                            <option value="v32305623">US West #15, Population: {8/32}</option>
                                                            </optgroup>
                                                    <optgroup label="Europe">
                                                                                                                                                                                                                        <option value="v32304817">Europe #1, Population: {24/32}</option>
                                                                                                                                            <option value="v32304816">Europe #2, Population: {3/32}</option>
                                                                                                                                            <option value="v32304819">Europe #3, Population: {9/32}</option>
                                                                                                                                            <option value="v32304812">Europe #4, Population: {5/32}</option>
                                                                                                                                            <option value="v32304821">Europe #5, Population: {3/32}</option>
                                                                                                                                            <option value="v32304815">Europe #6, Population: {4/32}</option>
                                                                                                                                            <option value="v32304820">Europe #7, Population: {3/32}</option>
                                                                                                                                                                                                                        <option value="v32304814">Europe #8, Population: {21/32}</option>
                                                                                                                                            <option value="v32304813">Europe #9, Population: {5/32}</option>
                                                                                                                                            <option value="v32304818">Europe #10, Population: {3/32}</option>
                                                                                                                                            <option value="v32304840">Europe #11, Population: {4/32}</option>
                                                                                                                                            <option value="v32304833">Europe #12, Population: {1/32}</option>
                                                                                                                                            <option value="v32304839">Europe #13, Population: {1/32}</option>
                                                                                                                                            <option value="v32304835">Europe #14, Population: {2/32}</option>
                                                                                                                                            <option value="v32304831">Europe #15, Population: {5/32}</option>
                                                                                                                                            <option value="v32304838">Europe #16, Population: {4/32}</option>
                                                                                                                                            <option value="v32304834">Europe #17, Population: {3/32}</option>
                                                                                                                                            <option value="v32304837">Europe #18, Population: {0/32}</option>
                                                                                                                                            <option value="v32304832">Europe #19, Population: {3/32}</option>
                                                                                                                                            <option value="v32304836">Europe #20, Population: {0/32}</option>
                                                                                                                                            <option value="v32304861">Europe #21, Population: {1/32}</option>
                                                                                                                                            <option value="v32304864">Europe #22, Population: {4/32}</option>
                                                                                                                                            <option value="v32304859">Europe #23, Population: {1/32}</option>
                                                                                                                                            <option value="v32304862">Europe #24, Population: {0/32}</option>
                                                                                                                                            <option value="v32304860">Europe #25, Population: {2/32}</option>
                                                                                                                                            <option value="v32304858">Europe #26, Population: {0/32}</option>
                                                                                                                                            <option value="v32304857">Europe #27, Population: {0/32}</option>
                                                                                                                                                                                                                        <option value="v32304856">Europe #28, Population: {32/32}</option>
                                                                                                                                            <option value="v32304865">Europe #29, Population: {3/32}</option>
                                                                                                                                            <option value="v32304863">Europe #30, Population: {1/32}</option>
                                                                                                                                            <option value="v32304880">Europe #31, Population: {1/32}</option>
                                                                                                                                            <option value="v32304881">Europe #32, Population: {3/32}</option>
                                                            </optgroup>
                                                    <optgroup label="Asia">
                                                                                                                                            <option value="v32306492">Asia #1, Population: {1/32}</option>
                                                                                                                                            <option value="v32306495">Asia #2, Population: {1/32}</option>
                                                                                                                                            <option value="v32306501">Asia #3, Population: {3/32}</option>
                                                                                                                                            <option value="v32306493">Asia #4, Population: {0/32}</option>
                                                                                                                                            <option value="v32306496">Asia #5, Population: {1/32}</option>
                                                                                                                                            <option value="v32306494">Asia #6, Population: {0/32}</option>
                                                                                                                                            <option value="v32306497">Asia #7, Population: {1/32}</option>
                                                                                                                                            <option value="v32306498">Asia #8, Population: {4/32}</option>
                                                                                                                                            <option value="v32306499">Asia #9, Population: {0/32}</option>
                                                                                                                                            <option value="v32306500">Asia #10, Population: {5/32}</option>
                                                                                                                                            <option value="v32306505">Asia #11, Population: {0/32}</option>
                                                                                                                                                                                                                        <option value="v32306510" selected="">Asia #12, Population: {22/32}</option>
                                                                                                                                            <option value="v32306506">Asia #13, Population: {0/32}</option>
                                                                                                                                            <option value="v32306509">Asia #14, Population: {2/32}</option>
                                                                                                                                            <option value="v32306507">Asia #15, Population: {0/32}</option>
                                                                                                                                            <option value="v32306508">Asia #16, Population: {1/32}</option>
                                                            </optgroup>
                                                    <optgroup label="Australia">
                                                                                                                                            <option value="v32306673">Australia #1, Population: {0/32}</option>
                                                                                                                                            <option value="v32306677">Australia #2, Population: {0/32}</option>
                                                                                                                                            <option value="v32306676">Australia #3, Population: {2/32}</option>
                                                                                                                                            <option value="v32306675">Australia #4, Population: {0/32}</option>
                                                                                                                                            <option value="v32306674">Australia #5, Population: {3/32}</option>
                                                                                                                                            <option value="v32306669">Australia #6, Population: {0/32}</option>
                                                                                                                                            <option value="v32306670">Australia #7, Population: {5/32}</option>
                                                                                                                                            <option value="v32306678">Australia #8, Population: {2/32}</option>
                                                                                                                                            <option value="v32306672">Australia #9, Population: {0/32}</option>
                                                                                                                                                                                                                        <option value="v32306671">Australia #10, Population: {16/32}</option>
                                                                                                                                            <option value="v32306697">Australia #11, Population: {1/32}</option>
                                                                                                                                            <option value="v32306698">Australia #12, Population: {0/32}</option>
                                                                                                                                            <option value="v32306693">Australia #13, Population: {0/32}</option>
                                                                                                                                            <option value="v32306696">Australia #14, Population: {6/32}</option>
                                                                                                                                            <option value="v32306695">Australia #15, Population: {0/32}</option>
                                                            </optgroup>
                                                    <optgroup label="South America">
                                                                                                                                            <option value="v32305898">South America #1, Population: {3/32}</option>
                                                                                                                                                                                                                        <option value="v32305897">South America #2, Population: {28/32}</option>
                                                                                                                                            <option value="v32305895">South America #3, Population: {4/32}</option>
                                                                                                                                            <option value="v32305903">South America #4, Population: {6/32}</option>
                                                                                                                                            <option value="v32305894">South America #5, Population: {3/32}</option>
                                                                                                                                            <option value="v32305902">South America #6, Population: {1/32}</option>
                                                                                                                                            <option value="v32305896">South America #7, Population: {2/32}</option>
                                                                                                                                                                                                                        <option value="v32305899">South America #8, Population: {25/32}</option>
                                                                                                                                            <option value="v32305901">South America #9, Population: {2/32}</option>
                                                                                                                                            <option value="v32305900">South America #10, Population: {1/32}</option>
                                                                                                                                                                                                                        <option value="v32305921">South America #11, Population: {27/32}</option>
                                                                                                                                            <option value="v32305920">South America #12, Population: {3/32}</option>
                                                                                                                                                                                                                        <option value="v32305923">South America #13, Population: {32/32}</option>
                                                                                                                                            <option value="v32305924">South America #14, Population: {4/32}</option>
                                                                                                                                            <option value="v32305925">South America #15, Population: {1/32}</option>
                                                                                                                                                                                                                        <option value="v32305922">South America #16, Population: {19/32}</option>
                                                            </optgroup>
                                            </select>
<br><br>
<hr style=\"color: rgba(255, 255, 255);\">
<center><h3>Sunucu Kısayolları</h3>
<hr style=\"color: rgba(255, 255, 255);\">
<button class=\"btn btn-blue\" style=\"width: 25%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8592411';\">Europe 1</button>
<button class=\"btn btn-blue\" style=\"width: 25%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8592406';\">Australia 1</button>
<br>
<button class=\"btn btn-blue\" style=\"width: 25%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v3230649';\">Asia 1</button>
<button class=\"btn btn-blue\" style=\"width: 25%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v3230611';\">US East 1</button>
<br>
<button class=\"btn btn-blue\" style=\"width: 25%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v3230560';\">US West 1</button>
<button class=\"btn btn-blue\" style=\"width: 25%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564836';\">Özel Sunucu</button>
<br>  `;

// DIV STYLE
var Style1 = document.querySelectorAll('.hud-map, .hud-resources, .hud-menu-shop, .hud-menu-party, .hud-menu-settings, .hud-shop-grid .hud-shop-item, .hud-party-link, .hud-party-members, .hud-party-grid, .hud-settings-grid, .hud-toolbar-item, .hud-toolbar-building, .hud-menu-icon, .hud-spell-icon, .hud-intro-form, .hud-intro-guide, .hud-intro-name, .hud-intro-server, .hud-party-tag, .hud-party-share, .hud-chat-input');
for (var i = 0; i < Style1.length; i++) {
  Style1[i].style.borderRadius = '1em'; // standard
  Style1[i].style.MozBorderRadius = '1em'; // Mozilla
  Style1[i].style.WebkitBorderRadius = '1em'; // WebKitww
  Style1[i].style.color = "#ffffff";
  Style1[i].style.border = "2px solid #080808";
}
// INPUT AND SELECT STYLE
var Style2 = document.querySelectorAll('select, input');
for (var i = 0; i < Style2.length; i++) {
  Style2[i].style.borderRadius = '1em'; // standard
  Style2[i].style.MozBorderRadius = '1em'; // Mozilla
  Style2[i].style.WebkitBorderRadius = '1em'; // WebKitww
  Style2[i].style.color = "#ffffff";
  Style2[i].style.border = "2px solid #00042e";
  Style2[i].style.backgroundColor = "#080808";
}