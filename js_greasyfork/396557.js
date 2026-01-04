// ==UserScript==
// @name         GeoGuessr Numbered Flags
// @namespace    https://greasyfork.org/en/scripts/396557-geoguessr-numbered-flags
// @version      0.4
// @description  Changes correct location markers (The black circles with flags) to have numbers on summary screens - Adds transparency when mouseover pins to be able to read places names // Based on @author u/Artyer Script - https://reddit.com/u/Artyer // Updated to work on new GeoGuessr Update
// @author       MrAmericanMike
// @include      /^(https?)?(\:)?(\/\/)?([^\/]*\.)?geoguessr\.com($|\/.*)/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396557/GeoGuessr%20Numbered%20Flags.user.js
// @updateURL https://update.greasyfork.org/scripts/396557/GeoGuessr%20Numbered%20Flags.meta.js
// ==/UserScript==

(function() {
'use strict';

const IMAGES = [
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAC4jAAAuIwF4pT92AAACjUlEQVR4nO2aT4hNURzHf1cTMVn4GzWUkoWUhVIsxIYVg7KwEaYGpZCkKItBzZQkSixkMjUkCxaKrSxYyv8/G2IhiiQl8XyOc5n7NPPc7n3nfa/mfOrTu2+65/1+9/vuPfe9M6+tVqvZaKZN3YCaGIC6ATUxAHUDamIA6gbUxADUDaiJAagbUBMDUDegJnQAy3ErLsYJ+Biv4wB+CFw7F6UC4Kv0dh5WpU/PJklyI92e6Z7j6r+GzMKVeARPY5+Jgyh7BizEten2zfRxGV7BaQ3GTcT92I3H8CR+LlB/DP4oMO4PIS6Bfmt88Fkm4VHchcfNnzUfc46dj+vNn02FCRFAUmDMdOzFg3jRfIh3bfh3dzxuw8M4WKzFIap2F3CXRnfqe7yFT/Cd+Ul0gfk5Z3KzClYtgCxTzZ/iQalyAC0hBqBuQE0MQN2AmhiAugE1MQB1A2piAIFf/ymexzv4FefhGvPrBGMD185FqAA+4T48h98zf3dBXMAO3Is7cFygHnIRIoCHuBtfNNjnNe7BE3gINwXq5Z+EKLoOv+Xc9yV2mV8aO4AbLf+l8cb8SlIpQgSQ9+CzPMPN5hdEutLtOSPs6xZJLps/y94WqFVH1e4C7l3tSXWLHytwLs7AL/gIr5kPrClULYAsD1KDUuUAWkJVAmjHTlyKO1tZWBmAm+3dP0nczO8O3oXwvNVNKAJYYv6+vwGnCOrXoQjgFC4S1B2WqswBMlQBuI/Cl/A2XhX18AtFAFvMf19wn+hmC+rXoQjgvqDmiMQ5QN2AmhhAyfFnbOiXIfdKvpaEUgEkSeIO+r888N/ES0DdgJoYgLoBNTEAcf1XVuxndU1DHYCcGIC6ATUxAHUDakZ9AD8BXfpYQy3tLQsAAAAASUVORK5CYII=',
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAC4jAAAuIwF4pT92AAADRklEQVR4nO2aW4gPURzHf8NGbg+uuSaRcilKEQ9aJbyQdXkgIVvr8uCSpJDkEltaIkK5hBAeeBBCiRe8KeuWktsDNndqib/vr3PG/+z47+78Z/ac37R7vvVpZs7O7Pme7//M5ZyZklwuRy1ZJdIGpOUDkDYgLR+AtAFp+QCkDUjLByBtQFo+AGkD0vIBSBuQlu0ASsEiMBq0B4/AJXACfLRcdyylCgBD6SVYTNabB4MguKLXe/E2mBo5pB+YBLaC/aCShINI2wNGgOl6/apejgfnQfcGjusE1oIKsBPsAd8S1N8K/Elw3D/ZOAWOUcONN9UZbAMrQBWpXvMp5rFDwQxSvSmxbAQQJDimB9gB1oPTpEK8S4V/3XZgMdgCTiWzmFfW7gJ8alRoasAt8Bi8J3URHU7qmtOlqSrMWgCmupHq4laV5QCcyAcgbUBaPgBpA9LyAUgbkJYPQNqAtHwAlv//E3AU3AG1YDCYRmqeoI3lumPJVgBfwBpwGPw2yjmI46AvWA2WgraWPMSSjQCqwUrwrIF9XoNVYDfYCOZb8tKobFRaBn7F3PcFKCc1NbYOzKH4p8YbUjNJqWQjgLiNN/UULCQ1IVKu1wfUsy9Pkpwl1cveJqirjrJ2F+BfdbOGJz8mgEGgJ/gBHoKLpAJrEmUtAFMPNFaV5QCcSCKArmAeqZcmvXXZK3ADnARfXZpxHcBscAR0jJTzm6OZYBOpC+BlV4ZcBzCO/m+8KZ4evwAmgtsuDEldA36Ce+AlqUbz1b61/hs/B+wFI10YcR0AN3w7qbdANUZ5KbhO+RD4lRs/Bzy3bch1APzYW1ug/CapHjHWKOtDzTCAQo0PFfXywaaR+iqV0kAwyth+R2oobV1ZCWAXqVfdoaLDaGvKQgALqO6HFPwitNJV5dIBDAH7ImXLwWdXBtIGcIDyX4bcL/LYDuCcXobib4fOpPRUlFIFEAQBN7rYhoc6BIYZ2zzUXZbGTxJJnQLc0LnGNn8fNIuSfSeUShIB8MCnKlJ2DYzRhPpO6hSxKtcB8FCYp7OiM8FlGlM8cdqsAuD7PI/3+zuss1G5DGADmOKwvlhyGUA42ZkpST8IicsHIG1AWj4AaQPSavEB/AXGOn2ApXeUpQAAAABJRU5ErkJggg==',
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAC4jAAAuIwF4pT92AAADe0lEQVR4nO2aW4hNURjHv80gooxbI/diHiQeRh5dHoxShLyMB51Mjcs8DMklyoNbppgmSjy4RCiXoijKk5RLKOUyLi+EwjQkKdfj//nWYc+ZM2f27H3W+nZZ//p19uXss779P3utvda3Vlk2m6X/WWXaAWjLG6AdgLa8AdoBaMsboB2AtrwB2gFoyxugHYC2vAHaAWjLtgEzwTIwDfQDj8ElcBx8sFx2JCUyAEPpFfiYY3YPBkFw2WwP530wL++SUaAabAf7QSMpG5H0CZgCFpjtK+ZzOjgLhha5bgDYAOrAbrAXfI5Rfg/wK8Z1f2WjChyl4jcfVjnYARpAE8lT8zHitRPBIpKnKbZsGBDEuGYY2AU2g1MkJt6iwv9uX7AcbAMn44X4T2l7C3DVqDO0gmugBbwnaUQnkbQ5g0pVYNoMCGsIySNuVWk2wIm8AdoBaMsboB2AtrwB2gFoyxugHYC2vAGWf/8JOAJugq+gEswnyRP0tlx2JNky4BNYBw6Bn6HjbMQxMBKsBStBH0sxRJINAx6C1eB5ke+8AmtAM9gCllqKpUvZKHQh+B7xuy9ALUlqbBOooehV4zVJJimRbBgQ9ebDegoyJAmRWrM9rpPvcpLkNMlT9jZGWe2UtrcA/6tbDZz8mAXGgwrwBTwCF0gMK4nSZkBYDwxWlWYDnEjLgKkkkyZjQS/wDtwmSa1/cxmIhgEnwJJOzrERG0k6T06kYcCYIuc4PX6YZGZpp4tgNNuANvDMxDCZpCrkxG+BM+a8VWkYwNNm3A3mOp9bpzsaXAUTzH5PkvFCk+1gNAxoLnDsJTgA9oSODXQRTJpegxV5+3dcFKppADd4PLvL01z8uDeEzt0gWUdgXZoG8Jxfed6xXD+/ntoPo60pTVWAxTPLgw1tLgrUNIDrOM8G83R3pflkA2aD66CKJG9gVUkN4JY7tzLkfjevrQ5t9wf7SIbBLG4fOD+wKklwUZTIgCAI+Ka7e+OFxMtjuAucCR2bUYLf7VKuqwB3gHgFyJsC50bk7TvJFbo2IEPSxz8HLpKM9/nfr6KOff+7LgLSaAQ551dj6EycVmt0EYxrA6IsaeN8AC+uvGc5lj9ybcBckh7fYuqY9OSqcJ5k2VyLq4BcG8BJz/UGXgTFo0B+/+eGxj8cx6PaEWo1qCptXWHn8gZoB6Atb4B2ANr6DQSNiEWFKZLTAAAAAElFTkSuQmCC',
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAC4jAAAuIwF4pT92AAADCklEQVR4nO2aW4hNURjHv63JrZQRE+GBJEl5kyeXF14QyoOXCaNxeXBtKOTBrSFJklwSUUhSHhRPbiXeKMYlDxQhioRIjP9nrWP2OY1ztr1nrf+qs3716+w9Z+9Z3/6fvc8+e63V0NnZKfVMA7sANjEAdgFsYgDsAtjEANgFsIkBsAtgEwNgF8AmBsAugI3rAKbBJXAS7A8fwcvwNPzguO1MFAoAj9LL8TLTrh5JkuSKXR6m63B2xS4j4Qy4Ax6Cu4UcRNEzYCKca5ev2tcp8AIcUmW/AXAjbIV74QH4OUf7veCvHPv9xcUlcFKqH3yaRrgTrob7xJw1HzPuOx7OF3M25cZFAEmOfZpgO9wMz4oJ8a50/+n2g8vgdngmX4ldhHYX0Euj1foe3oSP4TsxX6ITxHznDOqpBkMLIM1gMae4U0IOwAsxAHYBbGIA7ALYxADYBbCJAbALYBMDcPz/n8AT8A78DsfCOWL6CXo7bjsTrgL4BNvgcfgz9XcN4hQcAdfDFbCPoxoy4SKAh3ANfFZlm5dwLdwPt8JmR7XUxEWj8+CPjNu+gC1iusY2wYWS/dJ4JaYnqRAuAsh68GmewkViOkRa7PKof2yrnSTnxZxlb3O0VUZodwH9VLdZtfNjOhwDh8KvsANeEhNYjxBaAGkeWJ0ScgBeCCWAqWK6x0voLfS6j4ZDCKAvPCrmR1KJRl+NhxDAFik/eK+wA9Bv+jZmAcwAdFjrmJCfCZgBrIST7bJOWM4zolQYVgA6Srwrta7D5c2MQlgBHBQzDKboz9obUkcBLBDTJ6DoSLCODM8i1PEH3wEMlPInOJ0j8EZI17/iO4A9Yh5slFti7gJUigZwWLpmhtyvsa3OHFmaWh8Ob9vlpoptda7ABvhNzBOhMwoFkCSJHnStA1e020tnf6RP9dHW7ij9MvySv7ps+LoEtKNjnKe2/gtfAZyDF6u8vxiuSq2vg9ek4ASoLPgKoKPG+68r1p/De25KKYf9MEQnBsAuwNJu9U4oAdCIAbALYBMDYBfApu4D+A30N2yf3VLhEwAAAABJRU5ErkJggg==',
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAC4jAAAuIwF4pT92AAADUUlEQVR4nO2aW4hNURjHv61xjeQaRSJRTCkPXpR44UHk9sKDZGpQCknCNMml0JCIeBARIk15EB68eHJ5Um4jD0chlwmDRpPL+H/WambP7lyWffa3vl2z/vXrnH3O2mf99/+svfY53141nZ2d1JtVo21AWyEAbQPaCgFoG9BWCEDbgLZCANoGtBUC0DagrRCAtgFtSQcwF6wFs8Ag8AzcABfAZ+G+nVRVAPgrvR4PC+zm6SiKbtnnY3kbLErsMh7MB/vASXCQlIOodgTMAEvs89v2cQ64BkaV2W8I2A7qQRM4Br6n6L8P+JNivy5JnALnqPzBxzUM7AebwBEyo+aL477TwDIyoym1JAKIUuwzGhwAu8BlMiHep+Lf7kCwDuwFl9JZ7FbergJ8atRbWsFd8Bx8JDOJ1pKZc4Zn1WHeAohrJJkhLqo8B+BFIQBtA9oKAWgb0FYIQNuAtkIA2ga0FQIQ/vwWcBbcAx1gClhMpk7QT7hvJ0kF8BVsA2fA79jrHMR5MA5sBRtAfyEPTpII4AnYDF6WafMabAFHQSNYLeSloiQ6XQp+OrZ9BerIlMZ2gpXkfmq8IVNJqkoSAbgefFwvwBoyBZE6+3xiibZcJLlKZpS9T9FXD+XtKsDf6h4LFz/mgclgDGgHT8F1MoFlorwFENdji6jyHIAXaQTAw9ql1HUYFGSt6ATA9w02OrQ7IW2EpRGAa0X3k6gLK40ARiS2eWZvL9LOyy2zPATAP5wyu6z9r/IQQKuChy5pzwH8R8n1XqCItEcAL1W/QuZy9xDcBN98mvEdAPc3NLG9IrbNt8j5HyLf8e3wZcinePiXu3s8GDSQWVGyEPySNuQ7gB9gOWiz27yOYDqZRRa1sXa8ioSLJcelDVUbwCnqXhnyyKE9n9/NRV5vtOyOvbaK8h5AFEV80C4HXkk8GfJKkYaYpwkZfG5F+T4FeCXIhxLv8SkQ99NWol2m8h0Az/BTySyiegDekpn4ZoMdibZ3fBjyHQCv+phpKSeeK5rk7fgPIPkzuJj4XyD/NijIWjHyHQBPdLzCi2sCAxLvvQMXwSEqPU9kLt8BNFv6gklkRgRXefngC569/JNWTZBL5y1KffdQKIpqG9BWCEDbgLZ6fQB/AYF2gh8Ua2M5AAAAAElFTkSuQmCC'
];

function changeFlags() {
    let flags = document.getElementsByClassName("pin__image");
    if (flags.length === 5) {
      Array.prototype.forEach.call(flags, (img, n) => {
        img.src = IMAGES[n];
      });
    }
    else if(flags){
      Array.prototype.forEach.call(flags, (img, n) => {
        img.src = "https://www.geoguessr.com/_next/static/images/correct-location-5bdcd0a4eabbbb9e42feb5c54e54f4a1.png";
      });
      
    }
  
  
  	let pins = document.getElementsByClassName("map-pin");
	  Array.prototype.forEach.call(pins, (pin, n) => {

      pin.addEventListener("mouseover", () => {
        pin.style.opacity = 0.25;
      });
      
      pin.addEventListener("mouseout", () => {
       	pin.style.opacity = 1;
      });
    });
  	
};

function tryThrice() {
    setTimeout(changeFlags, 1000);
    setTimeout(changeFlags, 500);
    setTimeout(changeFlags, 250);
};

  document.addEventListener("DOMContentLoaded", tryThrice, false);
  
  setTimeout(tryThrice, 1000);

  document.addEventListener('mouseup', (event) => {
    setTimeout(changeFlags, 100);
    setTimeout(changeFlags, 50);
    setTimeout(changeFlags, 5);
  });
  
})();