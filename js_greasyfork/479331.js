// ==UserScript==
// @name            Discord Embed Sender
// @description     Send Embed as a member.
// @version         1.0.3
// @author          roxasytb
// @namespace       https://roxasytb.repl.co/
// @match           https://*.discord.com/app
// @match           https://*.discord.com/channels/*
// @match           https://*.discord.com/login
// @license         MIT
// @icon            https://cdn.discordapp.com/emojis/1118860094575218708.webp?size=128
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/479331/Discord%20Embed%20Sender.user.js
// @updateURL https://update.greasyfork.org/scripts/479331/Discord%20Embed%20Sender.meta.js
// ==/UserScript==
(function() {
    function showEmbedGen() {
        document.querySelector("#app-mount > div.appAsidePanelWrapper__714a6 > div.notAppAsidePanel__9d124 > div.layerContainer_d5a653").innerHTML = `<div class="layerContainer_d5a653">
<div class="backdrop__7e89b withLayer__1fe9d" style="opacity: 0.85; background: var(--black-500);"></div>
<div class="layer_ad604d">
  <form>
    <div class="focusLock__10aa5" role="dialog" aria-labelledby=":r1i:" tabindex="-1" aria-modal="true">
      <div class="root_a28985 small__05f7b fullscreenOnMobile__96797 rootWithShadow__073a7" style="opacity: 1; transform: scale(1);">
        <div class="flex_f5fbb7 horizontal__992f6 justifyStart__42744 alignCenter__84269 noWrap__5c413 header__6d5ea" id=":r1i:" style="flex: 0 0 auto;">
          <div class="colorHeaderPrimary_fcac0c size24__367cf">Embed Sender</div>
          <button aria-label="Fermer" type="button" class="closeButton__7569f close__1080c button_afdfd9 lookBlank__7ca0a colorBrand_b2253e grow__4c8a4">
            <div class="contents_fb6220">
              <svg aria-hidden="true" role="img" class="closeIcon__5bab9" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"></path>
              </svg>
            </div>
          </button>
        </div>
        <div class="content__764ce thin_b1c063 scrollerBase_dc3aa9" dir="ltr" style="overflow: hidden scroll; padding-right: 8px;">
          <div>
            <div class="container_eb78bd"><h2 class="h5__884a2 eyebrow_b7df6b defaultMarginh5__8514a" id=":r1o:">Text of Embed</h2>
              <div class="children__8990d"></div>
            </div>
            <div class="container_eb78bd">
              <div class="children__8990d">
                <div class="formItem_a0fe1a">
                  <div class="inputWrapper__934f5">
                    <div class="inputMaxLength__0fbc2">
                      <textarea type="text" class="inputDefault__80165 input_d266e7 textArea__97e3f scrollbarDefault_fec5d4 scrollbar_d66c5e error__18f19" aria-labelledby=":r1m:" aria-describedby=":r1n: 01d2803d-0efc-48fc-b7a3-e35ca42528d9 89f7d89e-f080-4954-a15f-a27a80232890" aria-invalid="true" placeholder="Embed Content" minlength="15" maxlength="340" required="" rows="3" style="padding-right: 38.92px;"></textarea>
                      <span id="89f7d89e-f080-4954-a15f-a27a80232890" class="hiddenVisually__06c3e">15&nbsp;caractères minimum.</span>
                      <span id="01d2803d-0efc-48fc-b7a3-e35ca42528d9" class="hiddenVisually__06c3e">340&nbsp;caractères maximum.</span>
                      <div class="maxLength_f4921c" aria-hidden="true">1000</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="container_eb78bd">
              <div class="children__8990d">
                <div class="formItem_a0fe1a">
                  <h2 class="h5__884a2 eyebrow_b7df6b defaultMarginh5__8514a" id=":r1o:">Image URL</h2>
                  <div class="inputWrapper__934f5">
                    <input class="inputDefault__80165 input_d266e7" name="Précision" placeholder="Image URL if you want." minlength="0" maxlength="1000" type="text" aria-labelledby=":r1o:" value="">
                  </div>
                </div>
              </div>
            </div>
            <div class="container_eb78bd">
              <div class="children__8990d">
                <div class="formItem_a0fe1a">
                  <h2 class="h5__884a2 eyebrow_b7df6b defaultMarginh5__8514a" id=":r1o:">Color (Hex)</h2>
                  <div class="inputWrapper__934f5">
                    <input class="inputDefault__80165 input_d266e7" name="Précision" placeholder="Color in hex" minlength="0" maxlength="1000" type="text" aria-labelledby=":r1o:" value="">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div aria-hidden="true" style="position: absolute; pointer-events: none; min-height: 0px; min-width: 1px; flex: 0 0 auto; height: 0px;"></div>
        </div>
        <div class="flex_f5fbb7 horizontalReverse_dc209c justifyStart__42744 alignStretch_e239ef noWrap__5c413 footer__89240 footerSeparator__57d95" style="flex: 0 0 auto;">
          <button type="submit" class="button_afdfd9 lookFilled__19298 colorBrand_b2253e sizeMedium_c6fa98 grow__4c8a4">
            <div class="contents_fb6220">Send</div>
          </button>
          <button type="button" class="button_afdfd9 lookLink__93965 lowSaturationUnderline__95e71 colorPrimary__6ed40 sizeMedium_c6fa98 grow__4c8a4">
            <div class="contents_fb6220">Cancel</div>
          </button>
        </div>
      </div>
    </div>
  </form>
</div>
</div>`
        document.querySelector("#app-mount > div.appAsidePanelWrapper__714a6 > div.notAppAsidePanel__9d124 > div.layerContainer_d5a653 > div > div.layer_ad604d > form > div > div > div.flex_f5fbb7.horizontalReverse_dc209c.justifyStart__42744.alignStretch_e239ef.noWrap__5c413.footer__89240.footerSeparator__57d95 > button.button_afdfd9.lookLink__93965.lowSaturationUnderline__95e71.colorPrimary__6ed40.sizeMedium_c6fa98.grow__4c8a4").addEventListener("click", (() => {
            document.querySelector("#app-mount > div.appAsidePanelWrapper__714a6 > div.notAppAsidePanel__9d124 > div.layerContainer_d5a653").innerHTML = ''
        }))
        document.querySelector("#\\:r1i\\: > button").addEventListener("click", (() => {
            document.querySelector("#app-mount > div.appAsidePanelWrapper__714a6 > div.notAppAsidePanel__9d124 > div.layerContainer_d5a653").innerHTML = ''
        }))
        document.querySelector("#app-mount > div.appAsidePanelWrapper__714a6 > div.notAppAsidePanel__9d124 > div:nth-child(4) > div > div.layer_ad604d > form > div > div > div.flex_f5fbb7.horizontalReverse_dc209c.justifyStart__42744.alignStretch_e239ef.noWrap__5c413.footer__89240.footerSeparator__57d95 > button.button_afdfd9.lookFilled__19298.colorBrand_b2253e.sizeMedium_c6fa98.grow__4c8a4").addEventListener("click", (() => {
            event.preventDefault();
            var embedTitle = document.querySelector(".scrollerBase_dc3aa9 > div:nth-child(1) > div:nth-child(2) > div > div > div > div > textarea").value
            var embedImage = document.querySelector(".scrollerBase_dc3aa9 > div:nth-child(1) > div:nth-child(3) > div > div > div > input").value
            var embedColor = document.querySelector(".scrollerBase_dc3aa9 > div:nth-child(1) > div:nth-child(4) > div > div > div > input").value
            var auth = (webpackChunkdiscord_app.push([[''], {},e => {m = [];for (let c in e.c) m.push(e.c[c])}]), m).find(m => m?.exports?.default?.getToken !== void 0).exports.default.getToken();
            var content = `** ** ||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​|| _ _ _ _ _ _ _ _ https://embed-RoxasYTB.replit.app/?title=${escape(embedTitle)}&color=${escape(embedColor)}`
            fetch("https://discord.com/api/v9/channels/" + location.href.split("/")[5] + "/messages", {
                "headers": {
                    "accept": "*/*",
                    "authorization": auth,
                    "content-type": "application/json",
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                },
                "body": `{"mobile_network_type":"unknown","content":"${content}"}`,
                "method": "POST"
            });
            document.querySelector("#app-mount > div.appAsidePanelWrapper__714a6 > div.notAppAsidePanel__9d124 > div.layerContainer_d5a653").innerHTML = '';
        }))
    }

    var embedButton = document.createElement("div")
    embedButton.innerHTML = `<button aria-label="Send Embed" type="button" class="button_afdfd9 tags lookBlank__7ca0a colorBrand_b2253e grow__4c8a4">
<div class="contents_fb6220 button_f0455c button__55e53"><div class="buttonWrapper__69593" style="opacity: 1; transform: none;"><img id="image0" width="24" height="24" x="0" y="0" src="data:image/png;base64,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 rkJggg==" style="
  position: relative;
  top: 5px;
  /* left: -76px; */
"></div></div></button>`
    embedButton.addEventListener("click", (() => {
        showEmbedGen()
    }))
    embedButton.onmouseover = (() => {
        embedButton.style = "filter: brightness(150%);"
    })
    embedButton.onmouseout = (() => {
        embedButton.style = "filter: brightness(100%);"
    })
    setInterval(() => {
        if (document.querySelector(".buttons_ce5b56").innerHTML.indexOf(embedButton.innerHTML) == -1) {
            document.querySelector(".buttons_ce5b56").appendChild(embedButton)
        }
    })

})();