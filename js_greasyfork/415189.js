// ==UserScript==
// @name Adjustments to 'Special' Label Badges for New Gmail
// @namespace http://github.com/exterrestris
// @version 0.5.2
// @description Custom styling for specific label badges
// @grant GM_addStyle
// @run-at document-start
// @match *://*.mail.google.com/*
// @downloadURL https://update.greasyfork.org/scripts/415189/Adjustments%20to%20%27Special%27%20Label%20Badges%20for%20New%20Gmail.user.js
// @updateURL https://update.greasyfork.org/scripts/415189/Adjustments%20to%20%27Special%27%20Label%20Badges%20for%20New%20Gmail.meta.js
// ==/UserScript==

(function() {
let css = `@namespace url(http://www.w3.org/1999/xhtml);

  /****************
  * Message List *
  ****************/
  .ar.as {
    .at[title*="Snooze"], .at[title*="Keep"], .at[title*="Paperless"] {
      background-color: transparent !important;
      border: none !important;

      &:before {
        height: 2.9ex;
        width: 2.9ex;
        line-height: 3.2ex;
        text-align: center;
        position: absolute;
        overflow: visible;
        color: #444;
        margin-top: -3px;
        font-size: 129%;
        font-family: "Segoe UI Emoji", "Segoe UI Symbol";
        left: -3px;
        content: "";
      }
    }

    .at[title*="Snooze"]:before {
      content: "\\23F0";
      margin-top: -4px;
    }

    .at[title*="Keep"]:before {
      content: "\\267B";
      color: #555;
      line-height: 3ex;
    }

    .at[title*="Paperless"]:before {
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAqJJREFUeNrUWTtuwkAQNSZFCqQ4VcqQNpU5AeYGREofOAFwgkCZClKlNPSRcE4QOAFOg9IBZTpTICVdZqWxtEJr78e7/jzJwpjFvDczOx9TtyqCm8fbbuPe+T1tjxF93baqgykczfOLdkWsP0TyXuUEAHkXrc+EXXLyDrx8UpfalRFAkXfS1tklDpsNHC5vrV1C8h5avimy3i4Z+bFI2NC4KAlxYm2flSZL7wHM8RsV8oV6QNHqUSk8kMHqX4V6IEusF+6BrLGOCHP3gAarpwqwDZPvarB6jP3P+yG/EALypINcyhQlDla5pFFswgj5nuZbr40LoDpI14BTA6lKjB2hLIyRZ8V/ogDGICFifd8QeYIP2V6IxK+DWUQ02/QMkY/A+nNZAU/4OhCMe99gNn6V6kax8MSh4Al4YagxVbJah5lsO31edHy0ssXxlglMkjZvmoDzUc7BgpQ0/jUNkQ+B/ExloGmzvIKVlectnRjpnsiGIKInIFZX6KxMjJRTxQIn1fMA+bHJmXjJ2dRZ2+UHk0N9iJv22RD5Di/riAhYp6x3sK0dag4lJfJJAsKU9S4lcMBZK9PnK5FnCoAbBazhmcIVfk4y0iEj+Rn8njL5tD0QcLwQZB0P0eqjrO5LEjBJ+Y5HWT5EMjK9Dbl3SzTPKwmAm+85ImhCot6YI/FxlpA5R43TKic9oyekPSByjd3rLiVUFhjrkWUAvJm4kzAmdqk2t8sgTQQugHRoGUZNcVAn1rzD8x3WhxHOrnsrR3ArMbq+gzEco4/XfSRPiM/yJi/kAcbsuwSitfgcvdEqgjxBXWbxaXv8btw75C//P3j7BsclHC9Y/AqByoOtFTXE72Va30L2AAN0+9C3CoaKgHgKC3RV07wFRBhGI6sE+BdgAGI76DCVwiGiAAAAAElFTkSuQmCC);
      background-position: 0;
      background-size: contain;
      left: 0px;
      top: 3px;
      width: 18px;
      height: 18px;
    }
  }

  /****************
  * Preview Pane *
  ****************/
  .hU.hM {
    .hN[title*="Snooze"], .hN[title*="Keep"] {
      white-space: nowrap;
      margin-left: 3ex;
      text-align: right;
      direction: rtl;

      &:before {
        height: 2.8ex;
        width: 2.8ex;
        line-height: 2.6ex;
        text-align: center;
        position: absolute;
        color: #444;
        margin-top: -1px;
        font-size: 120%;
        left: 2px;
      }
    }

    .hN[title*="Snooze"]:before {
      content: "\\23F0";
    }

    .hN[title*="Keep"]:before {
      content: "\\267B";
      font-size: 140%;
      margin-top: -2px;
      color: #555;
      left: 0px;
    }

    /* Keep For */
    .hN[title*="Keep"] {
      max-width: 4ch;

      &[title*="Week"] {
        max-width: 5.4ch;
      }

      &[title*="Weeks"] {
        max-width: 6.4ch;
      }

      &[title*="Month"] {
        max-width: 6.2ch;
      }

      &[title*="Months"] {
        max-width: 7.2ch;
      }

      &[title*="Year"] {
        max-width: 4.6ch;
      }

      &[title*="Years"] {
        max-width: 5.6ch;
      }
    }

    /* Snooze */
    .hN[title$="Snooze"] {
      max-width: 0ch;
      padding-left: 0;
      padding-right: 0;
    }

    .hN[title*="Snooze"] {
      /* Snooze For */
      &[title*="For"] {
        &[title*="Hour"] {
          max-width: 6.0ch;

          &[title*="1"] {
            max-width: 4.9ch;
          }
        }

        &[title*="Minute"] {
          max-width: 8.3ch;
        }
      }

      /* Snooze Until */
      &[title*="Later"] {
        max-width: 3.5ch;
      }

      &[title*="Today"] {
        &[title*="Morning"] {
          max-width: 10.4ch;
        }

        &[title*="Lunch"] {
          max-width: 4.6ch;
        }

        &[title*="Afternoon"] {
          max-width: 11.8ch;
        }

        &[title*="Evening"] {
          max-width: 9.9ch;
        }
      }

      &[title*="Tonight"] {
        max-width: 5.8ch;
      }

      &[title*="Tomorrow"] {
        max-width: 7.8ch;

        &[title*="Morning"] {
          max-width: 15.6ch;
        }

        &[title*="Lunch"] {
          max-width: 13.8ch;
        }

        &[title*="Afternoon"] {
          max-width: 16.9ch;
        }

        &[title*="Evening"] {
          max-width: 15.2ch;
        }

        &[title*="Night"] {
          max-width: 13.2ch;
        }
      }

      &[title*="This Weekend"] {
        max-width: 11.1ch;
      }

      &[title*="Next Week"] {
        max-width: 8.3ch;
      }

      &[title*="Next Weekend"] {
        max-width: 11.2ch;
      }

      &[title*="Next Month"] {
        max-width: 9.2ch;
      }

      /* Snooze Days */
      &[title*="Monday"] {
        max-width: 6.0ch;
      }

      &[title*="Tuesday"] {
        max-width: 6.3ch;
      }

      &[title*="Wednesday"] {
        max-width: 8.9ch;
      }

      &[title*="Thursday"] {
        max-width: 7.1ch;
      }

      &[title*="Friday"] {
        max-width: 4.6ch;
      }

      &[title*="Saturday"] {
        max-width: 6.8ch;
      }

      &[title*="Sunday"] {
        max-width: 5.5ch;
      }

      /* Snooze Times */
      &[title*="Time"] {
        max-width: 4.1ch;
        margin-left: 3.1ex;
      }

      /* Snooze Months */
      &[title*="January"] {
        max-width: 5.9ch;
      }

      &[title*="February"] {
        max-width: 6.8ch;
      }

      &[title*="March"] {
        max-width: 4.7ch;
      }

      &[title*="April"] {
        max-width: 3.4ch;
      }

      &[title*="May"] {
        max-width: 3.1ch;
      }

      &[title*="June"] {
        max-width: 3.4ch;
      }

      &[title*="July"] {
        max-width: 2.8ch;
      }

      &[title*="August"] {
        max-width: 5.3ch;
      }

      &[title*="September"] {
        max-width: 8.4ch;
      }

      &[title*="October"] {
        max-width: 6.0ch;
      }

      &[title*="November"] {
        max-width: 7.9ch;
      }

      &[title*="December"] {
        max-width: 7.9ch;
      }

      /* Snooze Dates */
      &[title*="Date"] {
        &[title*="/1"] {
          max-width: 3.2ch;
        }

        &[title*="/2"] {
          max-width: 3.2ch;
        }

        &[title$="/21st"], &[title$="/31st"] {
          max-width: 3.2ch;
        }

        &[title$="/22nd"] {
          max-width: 3.6ch;
        }

        &[title$="/30th"] {
          max-width: 3.2ch;
        }

        &[title$="/1st"] {
          max-width: 2ch;
        }

        &[title$="/2nd"] {
          max-width: 2.6ch;
        }

        &[title$="/3rd"], &[title$="/4th"], &[title$="/5th"], &[title$="/9th"] {
          max-width: 2.2ch
        }

        &[title$="/6th"], &[title$="/7th"], &[title$="/8th"] {
          max-width: 2.2ch
        }
      }




    }
  }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
