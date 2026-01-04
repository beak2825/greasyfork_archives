// ==UserScript==
// @name         One Form (Phones) - Improvements Project
// @namespace    I_will_be_hired
// @version      0.1
// @description  Going Above and Beyond!
// @author       MySelf
// @include      https://td.*.*/TDNext/Apps/48/Tickets/New?formId=3244
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAADXhJREFUeF7tW0lvHMcVfr3OvnInLVk05TiRE0QGjORHxNlhIAiQ/JQsSBAgQA455JBDkP8jn+yjD5ZtObZkiSLFbfYl+N5SXT2kZ0hldGCkBgpvNBx19/vqe0u9ehWs/PbfU8IVhERhREEQs+TPkEHIMghDCsOAwkBkFIWURAElKmP+WzaCgO+6tAu3wz3xDMgI7xAGFEcq9d/2fRTqbwL5u7w7RnYPVvsVAL/5V44BFMQy8yFkSBTI7OM7oChMCCkOlQGxSEbeMQCztVwK4HY5BgQzsx/hnTJm4F0yNmQzD5WYRcrNoP3rfzoAgtDobyCYGZgJmAzVBEJK4oDSKHQPM4rhIcu8fADwDKY/myJkyKbA/7bvmfIZIEx/VR7fGwRB+1f/8BgAxWOi6AJfwAwQQMCCKIoohQ9gBgB9PJzEP6idLhcAbxYNADzflPd8gQHBtu98gMw8K+8zoPX+3zMGRGBATAFLHwRhBI9IzCNm5wcGhAyE/1A8eMkEcPQ3MwPY8g5iCsIAmYgcADwhMjGmfI4BrV/+LWNAZAxQqSYhpqEgKDjCAANAKOh74GX7gJBMCWEYqC9RyFNeJ8JAYDaa9/fp7zOg+fO/CgDs6HwG+CAIK9g5KkgAwOjPJuCZgTBguT7AfIs5Wx8Aeb7MPA/zSTrzBoI40RkTaP7sLxf4gPNMELMw84jZByRxpHlAdC4eL1l/Z8vm3aGwy0NiU1zMwByhMIAkOmFSNJfI+YDGT/6UjwJmBqZslKhjNFDk3wAgVgAgzf7s4S8MAKW10d/5IPUBfnJkYLnQp96fI4qFwcaP/3guDEokgMKJyEglfy8AhADAgYDPGfJGuWVGAT+k4f7igCUEp2DAZQAwBkB9RSBovPcHDwDx8JIGq7KgvmNBxoYQkQAzryAgNfZZgBde5mXhzBwtGJAiAikIfiS4yASY9qq3sFNe0AMAP5A1AGd/pjjbfiIs8HxAGIkZRDFCYiQm4eXmy06ELmIAK88gaDic6wRFaUd/x4Af/S5zgrrwAQCirG8COvsKAvuBGCBAZgCIDYbsbZd5XcSAgioPIM5FAl0AuTCoqbSBYO8WtN77PQMAOhfSVEYhpTjGrMvsW+izXEDAgdLiC5gN6n0zJ5hHYDKd0nA8pdF4whKXxHCZvUWMMQZYpjkbBTj0mmNjW/cpL9x3UcD9kihY+6k4wUqpQGvNGq21qiwr5SKbgvMH3sIov0DC4ghpMqSkmxelwv3RhI67Ixm9Eb9qvRhTvSQDsznvgkLZOuN8ZjeZEg3HExqMBODReErj6ZQmE0gimk5zoDgGbP3izwxAu16ivZ1V2tteZdmqlylAjSA3gCq+A5yh3BAJFKMts8jJhudl7UFn/RE9OurT18cD+vqoz19vNAq0UU9ps1GgSiGeD4AXwwEV68R6TaEbAeDT/ohOe2PCs7qDMQ3GUwYEEkDYggpccWy58b4kQlsrNXrnzR16581tlpvtmijq4oV6TaeceRG9mZ9eZk7WKXV4NqTP9rv06X6HPnvS5e9vrZVod7VMt1ZL1Kokl3IZ9uowKczycDJhedYf09OzAR2cDungbEAnvRF1BhMGojuY0GgykUlyoVAeFxgAmwzANr1zWwAAIPoTFghzaRzJSCTxEUTllUC3/nDCM4ExBie961lnRJ9B+f0uS9jst7eq9NZmld7aqtBKJfUoO6UxlHNjQlCYn+QlMfyEqTChNxwTQD7sDOnwbEB4HkztRE0O7yTK24SpdmYCLZjA9grtbbdZtutlmX2lfKmQULtWcqNSTHMFh+5wQk9OBrR/OqD9kwF1BuMcAJihx8cDenzSZ1kpRPTdnRqPt3dq1K4mDkAog9/DXxyx3xgyqM7EAgl/lTSiciHie2ESesMJdYdjlvg/+6dDeor3OR0wE4SYeefsnGC5mNJas6KjSlDQ7B9236iW6OZ6Q0eTWrWiZmOyHsCL3n/ScQOz4V9wUKf9MZ31xmyr7WpKd2/U6e5NGe1Kwn8/xaz1R0xl+AyMh0c96vTHrtaASFAtRLReL9B6PaX1WnrOh+A+Xx316OGzPn31rMe+QS5hpvHThUFQvJDEVEgjljGHQNBcIsFas0p3Xl+jO6+vs9xsVamQ4LcynpwM6aMvjunDB8cs8eL5a0qwCjgsPHy7UaB3d5v07q0GvbvbYB+QUXjIL+4DetQZ5oqgMJndtRLdWi3T7lqZ1moplZKISklIxTRiBn3+tEOf73fp86ddetYZitJwmiKEEQ1LhGZdkKsSCwCbK3W6u7dJd/e2WL62VqcilE9jlvDuH9x/Rvc+fcbyy8Ne7o6gr1uyRgHdaJfoB2806Ye7TZYAQOgqtP3ioEsfPzqjjx+esgQ4/v9fraa0t16mvfUK3V4v03azSM1ywveBhBk5p7vfoYOzIfslG9ceACgJEG+0iyx3WgipBQ6pG/UiO80HB10GEgMmZQ4aztqc9LVlQK0Ys8LwAcgndppFurlSotd1gHGwfRl9Do0wCxvwSdfaBMppxFRvVhJqlWPaaRXpzY0qfWujwqOQhPT4WBOv4z4dnA7YUcsYcsS51gDA79SKGDFViwLAne0q3dmq0ne2axwaEY45LJ8O2K/AD8CXQLqweF2dIABAKITykAJAje7sVOnt7Rp/B0VBfUhzsAAFny1PubY+oBhLAmQDACChsoGFFkIfBrJDmMDjkwEnYU9O+uwLrrUJFBQA+AJkgwDAMkvIRjnWTHLIErP+9bEkVliMIem65gCEZMpDGgDfe03S60Y54QUR1gKQAOChyyz7nHG+AuA6Z4IooLxigNr/S2oCEgFeWif40ofBV4nQy54KX24xZCW4Pj09HfIi6KgjiyGUza51HrBwORwGXFV6pGUxVIylJDdiiXL5tQbgMgURVKX+c9jl6pStAK1wilL6tQZgUUkM1Z8HT7tuYFUoZXbZObp6Rahdp7u3UROUuuA31gTvH9IHn86rCUo7y2xNEGXxqxRF25WUN1R2V1EYLWVF0TSiUhrxpoiVwyCxTwClZatMCrQLGIA9gaxPUIqiWw6E11brVEylilxMYl5p3buPgujh/KKo9hPNAoCq7lXK4kiCVqsJj5VqwnsE/hYdlruPdPWHFSAWRLaNxtVpLdnOqQfMANCu0d3bqAgLCBcDcEgffCIAwPb8C7X8hLtKpKFqFgDU9Wxn6TIbI+hFKMTZwC5Vf4S9wCnvBZ70ZKsM3h+1gNmNGnu3xQBoeXwTJgD6KwhsArqHAImy+L1PDpgB9+4f0pcHM2Vx7huQTRTIGyv5sjjK2tlu7uKtMdB5OII3H7OEgsc9HV37LLtKqAcMxtga081br4FpAQC6MRKEsjFyC5siGBu0tVKlFBspupmyfzKkDx8c8fjowRGHnzwD0EMkyoMBW80i7wh9X3eHUM5efGXbWnBm2C3q9LEJKmv+o+6YjnpjljAn2Rgd83YZvL70Fsx0i39jTdDtCwIE3RrbaNFNHk1q1yuUxDElCdrlYkY/vzU2yOkD+wQA6COAhNN7Y63sxuLdYd2p1v4eVLXh6RHPrd6P/cnucEqQ+G6ovQKYfWyEWMdorpliPgDZ5mi5UKB2o0LtRpWVr5SK0h+kbTLd0ZR3dWQM6GxmcxSbkry5qZ2b6AdAKIPzW62lvKpbeGlPAjoQkMYglAMIllOiCX9GiCPdhtPtOMLOstdJ7rXyfrMJMAMMdbSmxtw6k2obTZygZ0jaaNAiM6aQnU8fYyQvkr+ybWl8QijEDi8KGxiYlbkXN19owwY2urUxQw50GLPO9yxLb5E0S6K7dLaPcQ4A2klgQPCDrIk6a5l1zVTcQiNDXnThfF7tB16nCu6PTVvpT5IWHfQ4Sc+gdY1ljdSzDVQAwvCeD4BjgRypkYMU2kbnmimzRmprnREgrqbfwl87YBVknnXJUwAEt+5y86TJ/JEebsjyzhVgvuYnQvJn/ZUC4PcRulMlwgZOmrz+oeUDYP5IGWbKa1MnmGARRpo3pY0foPhtdHa+4JIM8ObF6K0McIequI0eAJgJ2IsunNOr/cD3AWr3roU/sHY9OcjBTZtQXJW3Rkp3wAttvecaJRe9jusMk5Nk2akyO14zA8CyKcD+2PMx1t7P6bq8Q84ncDe7OFphQd4krC9xgQ/wUZmlYP6YHR+w8nqKln5kxHPGuLf5Izvmh8bNi3wCN2IqCH6D9XMCkOUF1jrDdq/nC62hKtdet4hZl/07d3edfz6fb3IN3gYCTCLzCXLGMTvdAp/w/ADkwmJ2sDKv/AuIAvpc7vQzc9QDXnl/JGedpJVXfQKHSXGKFiafA4CZvABLi1z7rL6Yn0BddnYv8zt2WvIMxwQ9wJWZg513zMIj+wUAYAxQc7DE6wo+QMOiraQsLmsCxKYwkz1eRq8r/YafrSCY6dkxX9fXnPU3s0/gZEnYYMtx+ITnY4CfFzgGeN7/Rc0+Y28zrym6ZoNyzjlr55Pjfpapqk9QECRPEDCwKLtEIjRnflxYnAHAzx6vNL2LfiyKy2k0dYameC4sewe/1UHaeUfLESI9/Pm/AaAvwS9kGeCLZICxwLV867lmfrawwM2+f/pdj/vZOSeAAJMQk53XKLloQv5PAPgvi2YHVPfqWRYAAAAASUVORK5CYII=
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434007/One%20Form%20%28Phones%29%20-%20Improvements%20Project.user.js
// @updateURL https://update.greasyfork.org/scripts/434007/One%20Form%20%28Phones%29%20-%20Improvements%20Project.meta.js
// ==/UserScript==

(function() {
  'use strict';
  //MY TO DO LIST!!!

  //Make noname1/2/3 show all under noname, or when noname1/2/3 is clicked auto open the drop down menu and show the options.
  //Hide person type, until the person name or I-Number is found, since this input box is never used until the person name or I-Number is found. And sometimes Phone Agents try to write names/I-Numbers on this box.
  //The next improvement steps for this script will be to add stock texts that can be single clicked and auto pasted on the input notes box, to improve the ticketing speed.
  //Fetch the caller profile page and append more data like credits, assigned track and holds on the One Form Phone website on the right side of the screen for convenience of the Phone Agent!
  //When Sechedule adivising appointment is selected, auto open the I-Planner schedule for others link for convenience.
  //Auto search for keywords (key terms) when they are written in the notes and auto select the right tag for it, example: If Phone Agent wrote "want's to defer", the deferments questions tag would be selected.

  //var array = [];
  //document.querySelectorAll("#select2-results-3 >li > div > span").forEach(a => array.push(a.nextSibling.nodeValue));
  //https://pastebin.com/8Aes5dRa
  //List of all available tags


  document.querySelectorAll("fieldset")[1].insertAdjacentHTML('beforeend', '<label style="cursor:pointer; margin-left: 10px;" id="ALL"><input data-val="true" type="radio">ALL Tags</label>'); //Add a tag called "ALL Tags" for the convenience mentioned in the previous comment
  document.querySelectorAll("fieldset")[1].insertAdjacentHTML('beforeend', '<label style="cursor:pointer; margin-left: 10px;" id="Dropped"><input data-val="true" type="radio">Dropped Call</label>'); //Add a tag called "Dropped Call" for convenience (This really should have been built in in the One Form itself...)

  document.querySelector("#Dropped").onclick = function() {
    window.open("https://td.xxxx.xxx/TDNext/Apps/40/Tickets/New?formId=2582", "_blank"); //REPLACE xx with the proper url!!!!!!!!!!!!!!!!!!!!!
    this.querySelector("input").checked = false;
  }

  document.querySelector("#ALL").onclick = function() {
    document.querySelectorAll("#attribute10329-grp > div.js-ca > fieldset > label.radio-inline > input").forEach(el => el.checked = false); //Uncheck any checked tags

    setTimeout(function() {

      document.querySelectorAll("#attribute10333 > option").forEach(function(el) { //Reveal again all hidden tags
        el.className = '';
        el.hidden = false;
        el.disabled = false;
      })
      document.querySelector("#attribute10333-grp").style.display = 'block'; //Reveal the drop down menu with all tags
      document.querySelector("#attribute10333 > option:nth-child(2)").remove(); //Hide the needless Abandoned chat tag on the phone tags... Why is it on the one form phone html?
    }, 100);
  }

  document.querySelectorAll("#attribute10329-grp > div.js-ca > fieldset > label.radio-inline").forEach(function(el) {
    el.onclick = function() {
      if (document.querySelector("#ALL > input").checked === true) {
        document.querySelector("#ALL > input").checked = false; //Uncheck the ALL Tags btn
      }
    }
  })

  //Remove needless html on the page
  document.querySelector("div.gutter-left-sm.gutter-bottom-sm.gray").remove();
  document.querySelector("div.form-group.gutter-top.required").remove(); //Workers do not have the need to change between forms
  document.querySelector("h2").remove();
  document.querySelector("#static-1461581-grp > div > span").remove();

  //Better page formatting
  document.querySelector("#attribute528-grp > div.input-group").setAttribute('style', 'width: 730px; top: -30px; left: 140px;');
  document.querySelector("#attribute50-grp > div.input-group").setAttribute('style', 'width: 750px; top: -30px; left: 120px;');
  document.querySelector("#attribute50-help").style.position = 'absolute';
  document.querySelector("#attribute528-help").style.position = 'absolute';
  document.querySelector("#select2-chosen-2").innerText = 'Person Type...';
  document.querySelector("#select2-chosen-1").innerText = 'Caller I-Number or Name...';
  document.querySelector("#attribute12375-grp > div.js-ca").setAttribute('style', 'display: inline-block; position: relative; top: 15px;');
  document.querySelector("#attribute10376-grp > div.js-ca").setAttribute('style', 'display: inline-block; position: relative; top: 15px;');
  document.querySelector("#attribute11847-grp > div.js-ca").setAttribute('style', 'display: inline-block; position: relative; top: 15px;');
  document.querySelector("#attribute10500-grp > div.js-ca").setAttribute('style', 'display: inline-block; position: relative; top: 5px;');
  document.querySelector("#attribute10500-grp > div.js-ca").setAttribute('style', 'display: inline-block; position: relative; top: 5px;');
  setTimeout(function() {
    document.querySelector("#attribute146").placeholder = "In this section, record your notes and tag the ticket with the most accurate tag that fits the situation you are helping the contact with.";
  }, 0);
})();