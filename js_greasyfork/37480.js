// ==UserScript==
// @name     AllegroPrzywracacz
// @description Przywraca funkcje filtrowania po dacie wystawienia do allegro
// @version  2
// @grant    none
// @author   Morsisko
// @match    https://allegro.pl/kategoria/*
// @match    https://allegro.pl/uzytkownik/*
// @match    https://allegro.pl/listing*
// @namespace https://greasyfork.org/users/166829
// @downloadURL https://update.greasyfork.org/scripts/37480/AllegroPrzywracacz.user.js
// @updateURL https://update.greasyfork.org/scripts/37480/AllegroPrzywracacz.meta.js
// ==/UserScript==


document.getElementById("opbox-filters").children[0].innerHTML += '<fieldset class="b29d68d " data-reactid="136"><h3 class="_5595733" data-reactid="137"><span class="e1b6ec0" data-reactid="138">wystawione w ciągu</span></h3><div class="_6c51794" data-reactid="139"><div class="_60fda69 _32b073c" data-reactid="140"><select id="morsallegronaprawiacz" class="fca3649 " data-reactid="141"><option selected="selected" value="0" data-reactid="142">wszystkie</option><option value="1" data-reactid="143">1 godziny</option><option value="2" data-reactid="144">2 godzin</option><option value="3" data-reactid="145">3 godzin</option><option value="4" data-reactid="146">4 godzin</option><option value="5" data-reactid="147">5 godzin</option><option value="6" data-reactid="148">12 godzin</option><option value="7" data-reactid="149">24 godzin</option><option value="8" data-reactid="150">2 dni</option><option value="9" data-reactid="151">3 dni</option><option value="10" data-reactid="152">4 dni</option><option value="11" data-reactid="153">5 dni</option><option value="12" data-reactid="154">6 dni</option><option value="13" data-reactid="155">7 dni</option></select></div></div></fieldset>';
var selectBox = document.getElementById("morsallegronaprawiacz");

function onParamChange() {
  var parsed = new URL(window.location.href);
  parsed.searchParams.set("startingTime", selectBox.value);
  window.location = parsed.toString();
}

var parsedUrl = new URL(window.location.href);
if (parsedUrl.searchParams.has("startingTime")) {
    selectBox.value = parsedUrl.searchParams.get("startingTime");
}
selectBox.onchange = onParamChange;