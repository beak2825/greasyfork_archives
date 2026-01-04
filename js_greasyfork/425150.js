// ==UserScript==
// @name         add buttons to colab
// @namespace    http://tampermonkey.net/
// @version      0.31
// @description  try to take over the world!
// @author       You
// @match        https://colab.research.google.com/drive/1R81vQCEF7ThyVhGn2FDafC_1SNw3YB99
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425150/add%20buttons%20to%20colab.user.js
// @updateURL https://update.greasyfork.org/scripts/425150/add%20buttons%20to%20colab.meta.js
// ==/UserScript==
var startup = null

function wait_for_bar(){
if (document.getElementById("top-menubar") !== null) {
document.querySelector("#header-doc-toolbar").style.overflow='inherit'
// var startup = document.getElementById("top-menubar").appendChild(document.createElement("button"));
//     startup.innerHTML = 'startup'
// startup.onclick = function() {
//     console.log('button clicked');
//     document.querySelector("#cell-lDtl33kuadU_ > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
//     document.querySelector("#cell-v_bqZeo83e-S > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
//     document.querySelector("#cell-v_bqZeo83e-S").scrollIntoView()
// };

var startup_dropdown = document.getElementById("top-menubar").appendChild(document.createElement("div"));
startup_dropdown.classList.add('startup-dropdown');
startup_dropdown.style.display='inline-grid';
startup_dropdown.style.width='119.97px';
var startup_menu = document.querySelector("#top-menubar > div.startup-dropdown").appendChild(document.createElement("div"));
startup_menu.classList.add('startup-menu');
startup_menu.style.display='inline-grid'
startup_menu.style.position='absolute'
startup_menu.style.zIndex='999'
startup_menu.style.width='inherit'
var startup = document.querySelector("#top-menubar > div.startup-dropdown > div").appendChild(document.createElement("button"));
    startup.innerHTML = 'startup'
    startup.style.height='27px'
var startup_thang = document.querySelector("#top-menubar > div.startup-dropdown > div").appendChild(document.createElement("div"));
startup_thang.classList.add('startup_thang')
startup_thang.style.display= 'none'
startup.onclick = function() {
    console.log('startup button clicked');
    document.querySelector("#cell-lDtl33kuadU_ > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-v_bqZeo83e-S > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-v_bqZeo83e-S").scrollIntoView()
};
var quick_startup = document.querySelector("#top-menubar > div.startup-dropdown > div > div.startup_thang").appendChild(document.createElement("button"));
    quick_startup.innerHTML = '(quick1link)'
quick_startup.onclick = function() {
    console.log('quick startup button clicked');
    document.querySelector("#cell-lDtl33kuadU_ > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()


    document.querySelector("#cell-SdSsl0_SyekS").scrollIntoView()
    document.querySelector("#cell-SdSsl0_SyekS > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > colab-form > div > colab-form-input > div.layout.horizontal.grow > paper-input").shadowRoot.querySelector("#input-1 > input").value = url


//    document.querySelector("#cell-SdSsl0_SyekS > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click();
//     document.querySelector("#cell-jlsUfaZjsnv- > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click();
//     document.querySelector("#cell-RIr3CXMAGNdy > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click();
//     document.querySelector("#cell-ys5HqVlPfKrG > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click();
//     document.querySelector("#cell-ys5HqVlPfKrG").scrollIntoView()

};
startup.onmouseenter = function() {
startup_thang.style.display='inline-grid'
}
startup_thang.onmouseleave = function() {
startup_thang.style.display='none'
}
    //startup button code ends here
    console.log('startup button made!');
var standard = document.getElementById("top-menubar").appendChild(document.createElement("button"));
    standard.innerHTML = 'Video'
standard.onclick = function() {
    document.querySelector("#cell-jlsUfaZjsnv- > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click();
    document.querySelector("#cell-RIr3CXMAGNdy > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click();
    document.querySelector("#cell-ys5HqVlPfKrG > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click();
    document.querySelector("#cell-ys5HqVlPfKrG").scrollIntoView()
};

var standard2 = document.querySelector("#cell-v_bqZeo83e-S > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > colab-form > div > colab-form-markdown > div").appendChild(document.createElement("button"));
    standard2.innerHTML = 'Video'
standard2.onclick = function() {
    document.querySelector("#cell-jlsUfaZjsnv- > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click();
    document.querySelector("#cell-RIr3CXMAGNdy > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click();
    document.querySelector("#cell-ys5HqVlPfKrG > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click();
    document.querySelector("#cell-ys5HqVlPfKrG").scrollIntoView()
};

var quickvid2 = document.querySelector("#cell-SdSsl0_SyekS > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > colab-form > div > colab-form-markdown > div").appendChild(document.createElement("button"));
    quickvid2.innerHTML = 'GO!'
quickvid2.onclick = function() {
    document.querySelector("#cell-SdSsl0_SyekS > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click();
    document.querySelector("#cell-jlsUfaZjsnv- > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click();
    document.querySelector("#cell-RIr3CXMAGNdy > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click();
    document.querySelector("#cell-ys5HqVlPfKrG > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click();
    document.querySelector("#cell-ys5HqVlPfKrG").scrollIntoView()
};

var quickvid3 = document.querySelector("#cell-SdSsl0_SyekS > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > colab-form > div > colab-form-markdown > div").appendChild(document.createElement("button"));
    quickvid3.innerHTML = 'instagram GO!'
quickvid3.onclick = function() {
    document.querySelector("#cell-SdSsl0_SyekS > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click();

    document.querySelector("#cell-RIr3CXMAGNdy > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click();
    document.querySelector("#cell-ys5HqVlPfKrG > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click();
    document.querySelector("#cell-ys5HqVlPfKrG").scrollIntoView()
};

var backtostart = document.querySelector("#cell-ys5HqVlPfKrG > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > colab-form > div > colab-form-title > div").appendChild(document.createElement("button"));
    backtostart.innerHTML = 'Go to Start'
backtostart.onclick = function() {
    document.querySelector("#cell-v_bqZeo83e-S").scrollIntoView()
};

var multi_img_dropdown = document.getElementById("top-menubar").appendChild(document.createElement("div"));
multi_img_dropdown.classList.add('dropdown');
multi_img_dropdown.style.display='inline-grid';
multi_img_dropdown.style.width='119.97px';
var multi_img_menu = document.querySelector("#top-menubar > div.dropdown").appendChild(document.createElement("div"));
multi_img_menu.classList.add('menu');
multi_img_menu.style.display='inline-grid'
multi_img_menu.style.position='absolute'
multi_img_menu.style.zIndex='999'
multi_img_menu.style.width='inherit'
var multi_img = document.querySelector("#top-menubar > div.dropdown > div").appendChild(document.createElement("button"));
    multi_img.innerHTML = 'multiple images'
    multi_img.style.height='27px'
var thang = document.querySelector("#top-menubar > div.dropdown > div").appendChild(document.createElement("div"));
thang.classList.add('thang')
thang.style.display= 'none'
var multi_img2 = document.querySelector("#top-menubar > div.dropdown > div > div.thang").appendChild(document.createElement("button"));
    multi_img2.innerHTML = '(reddit)'
multi_img2.onclick = function() {
    console.log('button clicked');
    document.querySelector("#cell-SzhVLgxWZaEz > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-RIr3CXMAGNdy > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-VRpPh1Ku4JFF > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-jCkpuztJtN0W > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-BmFlEbdiwzJ2 > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-jCkpuztJtN0W").scrollIntoView()
};
multi_img.onclick = function() {
    console.log('button clicked');
    document.querySelector("#cell-XFIpSOeIdAhk > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    //document.querySelector("#cell-AUY7d9vaZebv > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-AUY7d9vaZebv").scrollIntoView()
};
multi_img.onmouseenter = function() {
thang.style.display='inline-grid'
}
thang.onmouseleave = function() {
thang.style.display='none'
}
var multi_img3 = document.querySelector("#top-menubar > div.dropdown > div > div.thang").appendChild(document.createElement("button"));
    multi_img3.innerHTML = '(twitter)'
multi_img3.onclick = function() {
    console.log('button clicked');
    document.querySelector("#cell-Dd5zUAOmMNcV > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-RIr3CXMAGNdy > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-VRpPh1Ku4JFF > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-jCkpuztJtN0W > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-BmFlEbdiwzJ2 > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-jCkpuztJtN0W").scrollIntoView()
};
var multi_img4 = document.querySelector("#top-menubar > div.dropdown > div > div.thang").appendChild(document.createElement("button"));
    multi_img4.innerHTML = '(insta)'
multi_img4.onclick = function() {
    console.log('button clicked');
    document.querySelector("#cell-hzG9F2oGVzlO > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-RIr3CXMAGNdy > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-VRpPh1Ku4JFF > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-jCkpuztJtN0W > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-BmFlEbdiwzJ2 > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-jCkpuztJtN0W").scrollIntoView()
};
var sing_img_dropdown = document.getElementById("top-menubar").appendChild(document.createElement("div"));
sing_img_dropdown.classList.add('sing-dropdown');
sing_img_dropdown.style.display='inline-grid';
sing_img_dropdown.style.width='119.97px';
var sing_img_menu = document.querySelector("#top-menubar > div.sing-dropdown").appendChild(document.createElement("div"));
sing_img_menu.classList.add('sing-menu');
sing_img_menu.style.display='inline-grid'
sing_img_menu.style.position='absolute'
sing_img_menu.style.zIndex='999'
sing_img_menu.style.width='inherit'
var sing_img = document.querySelector("#top-menubar > div.sing-dropdown > div").appendChild(document.createElement("button"));
    sing_img.innerHTML = 'single images'
    sing_img.style.height='27px'
var sing_thang = document.querySelector("#top-menubar > div.sing-dropdown > div").appendChild(document.createElement("div"));
sing_thang.classList.add('sing_thang')
sing_thang.style.display= 'none'
sing_img.onclick = function() {
    console.log('button clicked');
    document.querySelector("#cell-FRWzqO9FfFqS > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-iE-DlADq-vG8 > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-iE-DlADq-vG8").scrollIntoView()
};
var sing_img2 = document.querySelector("#top-menubar > div.sing-dropdown > div > div.sing_thang").appendChild(document.createElement("button"));
    sing_img2.innerHTML = '(reddit)'
sing_img2.onclick = function() {
    console.log('button clicked');
    document.querySelector("#cell-UCGE3Y7bEOdP > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-RIr3CXMAGNdy > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-N7xZO21dGmCB > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-N7xZO21dGmCB").scrollIntoView()
};
var sing_img3 = document.querySelector("#top-menubar > div.sing-dropdown > div > div.sing_thang").appendChild(document.createElement("button"));
    sing_img3.innerHTML = '(twitter)'
sing_img3.onclick = function() {
    console.log('button clicked');
    document.querySelector("#cell-568RxApZbIby > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-RIr3CXMAGNdy > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-N7xZO21dGmCB > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-N7xZO21dGmCB").scrollIntoView()
};
var sing_img4 = document.querySelector("#top-menubar > div.sing-dropdown > div > div.sing_thang").appendChild(document.createElement("button"));
    sing_img4.innerHTML = '(pixiv)'
sing_img4.onclick = function() {
    console.log('button clicked');
    document.querySelector("#cell-bguN4X8lCR3q > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-RIr3CXMAGNdy > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-N7xZO21dGmCB > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-N7xZO21dGmCB").scrollIntoView()
};
var sing_img5 = document.querySelector("#top-menubar > div.sing-dropdown > div > div.sing_thang").appendChild(document.createElement("button"));
    sing_img5.innerHTML = '(insta)'
sing_img5.onclick = function() {
    console.log('button clicked');
    document.querySelector("#cell-7OCbwToKQr40 > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-RIr3CXMAGNdy > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-N7xZO21dGmCB > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-N7xZO21dGmCB").scrollIntoView()
};
sing_img.onmouseenter = function() {
sing_thang.style.display='inline-grid'
}
sing_thang.onmouseleave = function() {
sing_thang.style.display='none'
}
var insta_vid_dropdown = document.getElementById("top-menubar").appendChild(document.createElement("div"));
insta_vid_dropdown.classList.add('insta_vid-dropdown');
insta_vid_dropdown.style.display='inline-grid';
insta_vid_dropdown.style.width='84.97px';
var insta_vid_menu = document.querySelector("#top-menubar > div.insta_vid-dropdown").appendChild(document.createElement("div"));
insta_vid_menu.classList.add('insta_vid-menu');
insta_vid_menu.style.display='inline-grid'
insta_vid_menu.style.position='absolute'
insta_vid_menu.style.zIndex='999'
insta_vid_menu.style.width='inherit'
var insta_vid = document.querySelector("#top-menubar > div.insta_vid-dropdown > div").appendChild(document.createElement("button"));
    insta_vid.innerHTML = 'insta vids'
    insta_vid.style.height='27px'
var insta_vid_thang = document.querySelector("#top-menubar > div.insta_vid-dropdown > div").appendChild(document.createElement("div"));
insta_vid_thang.classList.add('insta_vid_thang')
insta_vid_thang.style.display= 'none'
insta_vid.onclick = function() {
    console.log('button clicked');
    document.querySelector("#cell-RpDm0RTsXLP7 > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-RpDm0RTsXLP7").scrollIntoView()
};
var insta_vid2 = document.querySelector("#top-menubar > div.insta_vid-dropdown > div > div.insta_vid_thang").appendChild(document.createElement("button"));
    insta_vid2.innerHTML = '(single)'
insta_vid2.onclick = function() {
    console.log('button clicked');
    document.querySelector("#cell-ty9udCwlXctK > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-RIr3CXMAGNdy > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-ys5HqVlPfKrG > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-ys5HqVlPfKrG").scrollIntoView()
};
var insta_vid3 = document.querySelector("#top-menubar > div.insta_vid-dropdown > div > div.insta_vid_thang").appendChild(document.createElement("button"));
    insta_vid3.innerHTML = '(album)'
insta_vid3.onclick = function() {
    console.log('button clicked');
    document.querySelector("#cell-EPsDU3SHXK1A > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-RIr3CXMAGNdy > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-ys5HqVlPfKrG > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-ys5HqVlPfKrG").scrollIntoView()
};
insta_vid.onmouseenter = function() {
insta_vid_thang.style.display='inline-grid'
}
insta_vid_thang.onmouseleave = function() {
insta_vid_thang.style.display='none'
}
var soundcloud = document.getElementById("top-menubar").appendChild(document.createElement("button"));
    soundcloud.innerHTML = 'soundcloud'
soundcloud.onclick = function() {
    console.log('button clicked');
    document.querySelector("#cell-jlsUfaZjsnv- > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click();
    document.querySelector("#cell-XgksTw8-HnE- > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-FQEtZFyGr8OD > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-ys5HqVlPfKrG > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-ys5HqVlPfKrG").scrollIntoView()
};
var gdrive = document.getElementById("top-menubar").appendChild(document.createElement("button"));
    gdrive.innerHTML = 'gdrive'
gdrive.onclick = function() {
    console.log('button clicked');
    document.querySelector("#cell-RIr3CXMAGNdy > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click();
    document.querySelector("#cell-jAF4ZuabNP-f > div.main-content > div.codecell-input-output > div.inputarea.horizontal.layout.form > div.cell-gutter > div > colab-run-button").shadowRoot.querySelector("div > div.cell-execution-indicator > iron-icon").click()
    document.querySelector("#cell-RIr3CXMAGNdy").scrollIntoView()
};
    clearInterval(interval1);
}
}

var interval1 = setInterval(wait_for_bar, 1000)
