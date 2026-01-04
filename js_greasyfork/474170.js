// ==UserScript==

// @name         Google 2014 Web fixer (Half broken)

// @namespace    Sliceschinima

// @version      0.1

// @description  Fixes web results on the old google 2014 userstyle

// @author       Slice

// @match        https://www.google.com/search*

// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/475062/Google%202014%20Web%20fixer%20%28Half%20broken%29.user.js
// @updateURL https://update.greasyfork.org/scripts/475062/Google%202014%20Web%20fixer%20%28Half%20broken%29.meta.js
// ==/UserScript==



let up = new URLSearchParams(window.location.search);

let query = encodeURI(up.get("q"));



const NEW_HTML =

`

<div class="xhjkHe">

    <div class="xhjkHe">

        <div class="TrmO7">

            <style data-iml="1693338654202">.nfdoRb{-ms-overflow-style:none;overflow-x:scroll;overflow-y:hidden;scrollbar-width:none;white-space:nowrap}.nfdoRb::-webkit-scrollbar{display:none}.zItAnd{margin-left:6px;vertical-align:top}.zItAnd:first-of-type{margin-left:0}.zItAnd{height:40px}.zItAnd{box-sizing:border-box;flex-direction:row;align-items:center;background-color:#fff;border:1px solid #dadce0;border-radius:20px;display:inline-flex;min-width:48px;outline:none;padding:0 14px;text-align:center}.zItAnd:focus{border-color:#202124}.zItAnd,.zItAnd:link,.zItAnd:visited,.zItAnd:hover,.zItAnd:active{color:#202124;text-decoration:none}.zItAnd:not(.MgQdud):hover{background-color:#f1f3f4;border-color:#dadce0}.O3S9Rb{font-family:Google Sans,arial,sans-serif;font-size:14px;min-width:0;text-align:center}.O3S9Rb::first-letter{text-transform:uppercase}.mUKzod{fill:#4285f4;height:18px;margin-right:6px;width:18px}.GMT2kb{padding-left:12px}.cLIEsf{border:0;}.QIkCq{fill:#202124;margin-right:5px}.MgQdud{background-color:#e8f0fe;border-color:#e8f0fe;padding:0 12px}.MgQdud,.MgQdud:link,.MgQdud:visited,.MgQdud:hover,.MgQdud:active{color:#1a73e8}.MgQdud:hover{background-color:#d2e3fc;border-color:#d2e3fc;cursor:pointer}.idnDsd{fill:#1a73e8}.fKmH1e{align-items:center;backdrop-filter:blur(4px);background-color:#fff;border:1px solid #dadce0;border-radius:100px;box-sizing:border-box;color:#202124;display:flex;font-family:Google Sans,arial,sans-serif;font-size:14px;height:40px;margin-bottom:8px;padding:0 14px 0 8px}.fKmH1e:hover{background-color:#f1f3f4;border-color:#dadce0}.bSeRjc{margin-left:6px}g-menu.DWsAYc{padding:16px 0}g-menu.DWsAYc g-menu-item a.K1yPdf{align-items:center;color:#5f6368;display:flex;font-family:Google Sans,arial,sans-serif;font-size:14px;gap:12px;height:30px;padding:0 16px}.cF4V5c{background-color:#fff}.cF4V5c g-menu-item{display:block;font-size:14px;line-height:23px;white-space:nowrap}.cF4V5c g-menu-item a,.cF4V5c .y0fQ9c{display:block;padding-top:4px;padding-bottom:4px;cursor:pointer}.cF4V5c g-menu-item a,.cF4V5c g-menu-item a:visited,.cF4V5c g-menu-item a:hover{text-decoration:inherit;color:inherit}.EpPYLd{display:block;position:relative}.YpcDnf{padding:0 16px;vertical-align:middle}.YpcDnf.HG1dvd{padding:0}.HG1dvd>*{padding:0 16px}.WtV5nd .YpcDnf{padding-left:28px}.Zt0a5e .YpcDnf{line-height:48px}.GZnQqe .YpcDnf{line-height:23px}.EpPYLd:hover{cursor:pointer}.EpPYLd,.CB8nDe:hover{cursor:default}.LGiluc,.EpPYLd[disabled]{pointer-events:none;cursor:default}.LGiluc{border-top:1px solid;height:0;margin:5px 0}.Zt0a5e.CB8nDe{background:no-repeat left 8px center;background-image:url(//ssl.gstatic.com/images/icons/material/system/1x/done_black_16dp.png)}.GZnQqe.CB8nDe{background:no-repeat left center;background-image:url(//ssl.gstatic.com/ui/v1/menu/checkmark2.png)}.GZnQqe.LGiluc,.GZnQqe.EpPYLd[disabled]{color:#dadce0 !important}.GZnQqe.LGiluc{border-top-color:#dadce0;}.OhScic{margin:0px}.zsYMMe{padding:0px}.bNg8Rb{clip:rect(1px,1px,1px,1px);height:1px;overflow:hidden;position:absolute;white-space:nowrap;width:1px;z-index:-1000;user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}sentinel{}.pkWBse{box-shadow:0 2px 10px 0 rgba(0,0,0,0.2)}.pkWBse{border-radius:8px}.UjBGL{display:block}.CcNe6e{cursor:pointer;display:inline-block}.iRQHZe{position:absolute}.Qaqu5{position:relative}.shnMoc.CcNe6e{display:block}.v4Zpbe.CcNe6e{display:-moz-box;display:flex;height:100%;width:100%}sentinel{}.PBn44e{border-radius:8px}.yTik0{border:none;display:block;outline:none}.wplJBd{white-space:nowrap}.iQXTJe{padding:5px 0}sentinel{}.Zt0a5e.LGiluc{border-top-color:#dadce0}.Zt0a5e.LGiluc,.Zt0a5e.EpPYLd[disabled]{color:rgba(0,0,0,0.26)!important}.CjiZvb,.GZnQqe.EpPYLd:active{background-color:rgba(0,0,0,0.1)}sentinel{}</style>

            <div class="nfdoRb" jscontroller="KfnT9d" data-suw="400" jsname="eEGnhe" jsaction="rcuQ6b:npT2md" data-hveid="CAIQAA" data-ved="2ahUKEwjjsM6I0oKBAxWYFVkFHU9-BgsQtYAJegQIAhAA">

                <a class="zItAnd FOU1zf MgQdud" data-hveid="CAIQBA" data-ved="2ahUKEwjjsM6I0oKBAxWYFVkFHU9-BgsQ0pQJegQIAhAE">

                    <div class="O3S9Rb">Web</div>

                </a>

                <a class="zItAnd FOU1zf" href="/search?q=${query}&amp;sca_esv=561082500&amp;hl=en&amp;biw=1920&amp;bih=933&amp;tbm=isch&amp;source=lnms&amp;sa=X&amp;ved=2ahUKEwjjsM6I0oKBAxWYFVkFHU9-BgsQ0pQJegQIAhAI" data-hveid="CAIQCA" data-ved="2ahUKEwjjsM6I0oKBAxWYFVkFHU9-BgsQ0pQJegQIAhAI">

                    <div class="O3S9Rb">Images</div>

                </a>

                <a class="zItAnd FOU1zf cLIEsf GMT2kb" href="/search?q=${query}&amp;sca_esv=561082500&amp;hl=en&amp;biw=1920&amp;bih=933&amp;source=lnms&amp;sa=X&amp;ved=2ahUKEwjjsM6I0oKBAxWYFVkFHU9-BgsQ0pQJegQIAhAC" data-hveid="CAIQAg" data-ved="2ahUKEwjjsM6I0oKBAxWYFVkFHU9-BgsQ0pQJegQIAhAC">

                    <svg class="mUKzod QIkCq" aria-hidden="true" focusable="false" viewBox="0 0 24 24">

                        <path d="M0 0h24v24H0z" fill="none"></path>

                        <path d="M16.41 5.41L15 4l-8 8 8 8 1.41-1.41L9.83 12"></path>

                    </svg>

                    <div class="O3S9Rb">Books</div>

                </a>

                <a class="zItAnd FOU1zf" href="/search?q=${query}&amp;sca_esv=561082500&amp;hl=en&amp;biw=1920&amp;bih=933&amp;tbm=vid&amp;source=lnms&amp;sa=X&amp;ved=2ahUKEwjjsM6I0oKBAxWYFVkFHU9-BgsQ0pQJegQIAhAG" data-hveid="CAIQBg" data-ved="2ahUKEwjjsM6I0oKBAxWYFVkFHU9-BgsQ0pQJegQIAhAG">

                    <div class="O3S9Rb">Videos</div>

                </a>

                <a class="zItAnd FOU1zf" href="/search?q=${query}&amp;sca_esv=561082500&amp;hl=en&amp;biw=1920&amp;bih=933&amp;tbm=nws&amp;source=lnms&amp;sa=X&amp;ved=2ahUKEwjjsM6I0oKBAxWYFVkFHU9-BgsQ0pQJegQIAhAK" data-hveid="CAIQCg" data-ved="2ahUKEwjjsM6I0oKBAxWYFVkFHU9-BgsQ0pQJegQIAhAK">

                    <div class="O3S9Rb">News</div>

                </a>

                <span class="bSeRjc" jscontroller="nabPbb" data-ffp="false" jsaction="KyPa0e:Y0y4c;BVfjhf:VFzweb;wjOG7e:gDkf4c;">

                    <g-popup jsname="V68bde" jscontroller="DPreE" jsaction="A05xBd:IYtByb;EOZ57e:WFrRFb;" jsdata="mVjAjf;_;CRuTmM">

                        <div jsname="oYxtQd" class="CcNe6e" aria-expanded="false" aria-haspopup="true" role="button" tabindex="0" jsaction="WFrRFb;keydown:uYT2Vb">

                            <div jsname="LgbsSe" class="fKmH1e">

                                <span style="height:16px;line-height:16px;width:16px" class="z1asCe SaPW2b">

                                    <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">

                                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>

                                    </svg>

                                </span>

                                <span aria-label="More Filters">More</span>

                            </div>

                        </div>

                        <div jsname="V68bde" class="UjBGL pkWBse iRQHZe" style="display:none;z-index:200" id="_IEzuZOOgAZir5NoPz_yZWA_7">

                            <g-menu jsname="xl07Ob" class="cF4V5c DWsAYc yTik0 wplJBd PBn44e iQXTJe" jscontroller="WlNQGd" role="menu" tabindex="-1" jsaction="PSl28c;focus:h06R8;keydown:uYT2Vb;mouseenter:WOQqYb;mouseleave:Tx5Rb;mouseover:IgJl9c">

                                <g-menu-item jsname="NNJLud" jscontroller="CnSW2d" class="EpPYLd GZnQqe" role="none" data-short-label="" jsdata="zPXzie;_;CRuTmQ">

                                    <div jsname="ibnC6b" class="YpcDnf OSrXXb HG1dvd" role="none"><a class="K1yPdf" href="https://maps.google.com/maps?q=${query}&amp;hl=en&amp;biw=1920&amp;bih=933&amp;dpr=1&amp;um=1&amp;ie=UTF-8&amp;sa=X&amp;ved=2ahUKEwjjsM6I0oKBAxWYFVkFHU9-BgsQ0pQJKAB6BAgCEA4" role="menuitem" tabindex="-1"><span>Maps</span></a></div>

                                </g-menu-item>

                                <g-menu-item jsname="NNJLud" jscontroller="CnSW2d" class="EpPYLd GZnQqe" role="none" data-short-label="" jsdata="zPXzie;_;CRuTmQ">

                                    <div jsname="ibnC6b" class="YpcDnf OSrXXb HG1dvd" role="none"><a class="K1yPdf" href="/search?q=${query}&amp;sca_esv=561082500&amp;hl=en&amp;biw=1920&amp;bih=933&amp;tbm=shop&amp;source=lnms&amp;sa=X&amp;ved=2ahUKEwjjsM6I0oKBAxWYFVkFHU9-BgsQ0pQJKAF6BAgCEA8" role="menuitem" tabindex="-1"><span>Shopping</span></a></div>

                                </g-menu-item>

                                <g-menu-item jsname="NNJLud" jscontroller="CnSW2d" class="EpPYLd GZnQqe" role="none" data-short-label="" jsdata="zPXzie;_;CRuTmQ">

                                    <div jsname="ibnC6b" class="YpcDnf OSrXXb HG1dvd" role="none"><a class="K1yPdf" href="https://www.google.com/travel/flights?q=${query}&amp;sca_esv=561082500&amp;hl=en&amp;biw=1920&amp;bih=933&amp;tbm=flm&amp;source=lnms&amp;sa=X&amp;ved=2ahUKEwjjsM6I0oKBAxWYFVkFHU9-BgsQ0pQJKAJ6BAgCEBA" role="menuitem" tabindex="-1"><span>Flights</span></a></div>

                                </g-menu-item>

                                <g-menu-item jsname="NNJLud" jscontroller="CnSW2d" class="EpPYLd GZnQqe" role="none" data-short-label="" jsdata="zPXzie;_;CRuTmQ">

                                    <div jsname="ibnC6b" class="YpcDnf OSrXXb HG1dvd" role="none"><a class="K1yPdf" href="https://www.google.com/finance?sa=X&amp;ved=2ahUKEwjjsM6I0oKBAxWYFVkFHU9-BgsQ0pQJKAN6BAgCEBE" role="menuitem" tabindex="-1"><span>Finance</span></a></div>

                                </g-menu-item>

                            </g-menu>

                        </div>

                    </g-popup>

                </span>

            </div>

        </div>

        <div class="sKb6pb" id="uddia_1" style="height:40px">

            <div class="PuHHbb">

                <div class="nfSF8e hdtb-tl-sel" id="hdtb-tls" aria-controls="hdtbMenus" aria-expanded="true" role="button" tabindex="0" data-ved="2ahUKEwjjsM6I0oKBAxWYFVkFHU9-BgsQ2x96BAgCEBI">Tools</div>

            </div>

        </div>

    </div>

</div>



`;



// Select the target div to replace

let targetDiv = document.querySelector(".xhjkHe");



if (targetDiv)

{

    // Create a new div element with the replacement HTML

    let newDiv = document.createElement("div");

    newDiv.innerHTML = NEW_HTML;



    // Replace the target div with the new div

    targetDiv.parentNode.replaceChild(newDiv, targetDiv);
}
