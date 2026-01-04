// ==UserScript==
// @name        RoutineHub tweaks
// @version     3.0
// @license     MIT
// @author      https://github.com/atnbueno
// @description Experiments in improving the UX of using routinehub.co
// @icon        https://s3.us-west-002.backblazeb2.com/routinehub/static/icon/apple-touch-icon-76x76.png
// @namespace   https://github.com/atnbueno/userscripts
// @supportURL  https://github.com/atnbueno/userscripts/issues
// @match       https://routinehub.co/*
// @match       https://www.routinehub.co/*
// @run-at      document-start
// @grant       GM.addStyle
// @downloadURL https://update.greasyfork.org/scripts/487499/RoutineHub%20tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/487499/RoutineHub%20tweaks.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Manual feature toggles
  const FEATURES = {
    sidebarMastodonIcon: true,
    carouselBlink: true,
    hoverDropdown: true,
    missingVersionLabel: true,
    addVersionHistoryButton: true,
    prettifyQRCode: true,
    fixGlyphIssues: true,
  };

  document.addEventListener("DOMContentLoaded", function() {

    // Replace the icon of sidebar links to mastodon.social
    if (FEATURES.sidebarMastodonIcon) {
      const links = document.querySelectorAll('.sidebar a');
      links.forEach(link => {
        if (link.href.includes('mastodon.social')) {
          link.innerHTML = '<span class="fa-stack fa-lg"><i class="fas fa-square fa-stack-2x"></i><i class="fa-brands fa-mastodon fa-stack-1x fa-inverse"></i></span></a>';
        }
      });
    }

    // Add blinking effect to the carousel when clicked
    if (FEATURES.carouselBlink) {
      GM.addStyle(''+`
      #carousel, .slick-slide {
        margin: 0 auto;
        max-width: 660px;
      }
      .darkened {
        background-color: #0002;
        filter: brightness(80%);
      }`);
      const carousel = document.querySelector('#carousel');
      if (carousel) {
        const observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
              mutation.addedNodes.forEach(function(node) {
                if (node.classList && node.classList.contains('slick-list')) {
                  ['touchstart', 'mousedown'].forEach(event => {
                    node.addEventListener(event, () => node.classList.add('darkened'));
                  });
                  ['touchend', 'mouseup'].forEach(event => {
                    node.addEventListener(event, () => node.classList.remove('darkened'));
                  });
                }
              });
            }
          });
        });
        observer.observe(carousel, { childList: true, subtree: true });
      }
    }

    // Toggles the logged-in dropdown menu when hovering over the gear icon
    if (FEATURES.hoverDropdown) {
      const dropdown = document.querySelector(".navbar-menu .dropdown");
      if (dropdown) {
      const dropdownMenu = dropdown.querySelector(".dropdown-menu");
        dropdown.addEventListener("mouseenter", function() {
          dropdownMenu.style.display = "block";
        });
        dropdown.addEventListener("mouseleave", function() {
          dropdownMenu.style.display = "none";
        });
      }
    }

    // Checks availability of the most recent version
    if (FEATURES.missingVersionLabel) {
      const missingValue = 26;
      const versionSelect = document.getElementById('id_ios_release');
      if (versionSelect && !versionSelect.querySelector(`option[value="${missingValue}"]`)) {
        versionSelect.insertAdjacentHTML('afterend', `<label id="missing-version">No "${missingValue}" yet</label>`)
      }
    }

    // Add "Version history" button when it's missing (first versions)
    if (FEATURES.addVersionHistoryButton) {
      GM.addStyle(''+`
      #missing-version {
        color:red;
        margin: -2.3em 0 0 3em;
        position: absolute;
        white-space: nowrap;
      }
      .select:has(#id_ios_release)::after {
        margin: -1.1em -0.3em 0 0 !important;
      }`);
      if (location.pathname.startsWith("/shortcut/")) {
        const container = document.querySelector('.latest-release');
        if (container && !container.querySelector('a[href$="changelog"]')) {
          container.insertAdjacentHTML('beforeend', `<a href="${location.pathname}changelog" class="button is-dark is-fullwidth">Version history</a>`);
        }
      }
    }

    // Prettifies QR code with RH logo
    if (FEATURES.prettifyQRCode) {
      GM.addStyle(''+`
      .qr-code {
        position: relative;
      }
      #qr-code-img, #qr-code-img+img {
        transform: scale(1);
      }
      #qr-code-img {
        position: absolute;
      }`);
      const qrCodeImage = document.querySelector(".qr-code img");
      if (qrCodeImage) {
        qrCodeImage.id = "qr-code-img";
        qrCodeImage.src += "&ecc=M&margin=0&size=527x527&qzone=1";
        qrCodeImage.insertAdjacentHTML("afterend", '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAg8AAAIPCAIAAAB7R6r1AAAABnRSTlMAAAAAAABupgeRAAAmZklEQVR42uzdQQqEMBREwTZ4/yvrEYI0QjRV+94NPIgwf4S/uGA9ARasxesTExN2NQIAM2cAQC0AUAsA1AIAtQBALQB4TC0AUAsA1AIAtQAAtQBALQBQCwDUAgBwDQkCuIZkYoJrSACgFgCoBQBqAUBFLQBQCwDUAgC1AEAtAFALANQCANQCALUAQC0AUAsAwDUkCOAakokJFXe5AVALANQCANQCALUAQC0AUAsA1AIAtQBALQBQCwBQCwDUAgC1AEAtAADXkCCAa0gmJlS8RAGgFgCoBQCoBQBqAYBaAKAWAKgFAGoBgFoAoBYAoBYAqAUAagGAWgAAriFBANeQTEyoeIkCQC0AUAsAUAsA1AIAtQBALQBQCwDUAgC1AEAtAEAtAFALANQCALUAAFxDggCuIZmYUPESBYBaAKAWAKAWAKgFAGoBgFoAoBYAqAUAagGAWgCAWgCgFgCoBQBqAQC4hgQBXEMyMcFLFACoBQBqAYBaAKAWAKgFAGoBgFoAoBYAoBYAVLUAALUAQC0AUAsA1AIAcA0JAriGZGJCxUsUAGoBgFoAgFoAoBYAqAUAagGAWgCgFgCoBQBqAQBqAYBaAKAWAKgFAOAaEgRwDcnEhB14iQJALQBQCwDUAgC1AEAtAFALANQCANQCALUAQC0AUAsA1AIAtQBALQDg8If1AEy57mIyZ2JiYnIGAL5bCwDUAgC1AEAtAFALAFALANQCALUAQC0AUAsA1AIAtQBALQBALQBwDQkA15BMTExMTFxDAsB3CwDUAgC1AAC1AEAtAFALANQCALUAQC0AUAsA1AIA1AIAtQBALQBwDQkA15BMTHif35iJa0gAVHy3AEAtAFALANQCALUAQC0AQC0AUAu42bdnBIaCIAzAs88uI/XB/W8S9rGtZRlVkd58u4Mb/NVwzsdj3u/zwUAMBmoHzsVqBYyJ9RpO2bZeKIDj6Om0lslo2SwJAkAIYVqg/0QpbbVYtUqrVaZ+uw2Uwl1IFKnY0LNZvVg0KhXVieveDqT5XEynYFl6IqH67WPZ/R52OyAEPI+YJiD0fpK9s3Bv49j68F9VTJmZmZmZmZmZuUnKlDTFMEO5oXKSS5RYtlir1fp7n2/dk420010LbEv6zTNtA3Nkz/re8+5hdf6QiDp/QIjSiy9mTz99YNKkga226sjedtuh448vPvJIdfnyYc8brltBUPvXvyqzZpXffddbsgRKDWO+NK5isbZ+vQ/M1q8PBgeR6oLOHxKRSHdfRiKihe97S5cW7rtv8MAD0eZjuTM775y78srKJ58ExWI9NXI5aFF6+eXSK694M2f6v/wSNKKlWq3985/V77+vfvMNB2p4yXxftGiziEREC4mIFrW//7341FOD++2H4h7fndlpp/yNN3qLFtVbEpVKdcUKmFF87jn+7c2bh+URY478+9/V776rfvUV2PB//x2PVsvWhmghEdFCIqKF71c+/zx73nkDW2+Npp5Qe/Cgg0qvvx5ks8PRVSp5ixcXX3gBZrDLb79d/eGHOi9W4PvYGdVvv4UZbA7wW4wP0UIiooVERIvRL88rf/DB4CGHjDcVkk2Nwj331AhaRBYWQ+Wzz0JghKYGtoi5sOyC/h9/eP8PjNDUILwRVCoTlRYSES20tCba8rzKjBmDhx6KLu6avd12+Ztvrm3YEL0HMChNnRplBmaHMcNiHtVVq6BFuL2vv0YqKJeHtbQm2BJgJTKRXi+CoPLppxac6L69/fbYGcHAQDS4XV22rPj881FmVL/+OqhW63KrsC2izKj97W8xYXClUUlEniiJiBb+Tz9lzzwTndvtO7PbbqVXXx2O+JTwU0WNDHb5jTf8X3+NxrexOfzVq0GFbYLhpE5xRrSQiGghEdFixMtfuPvugW226QFU2B468khSpOyOBCRIroUT0V2ePn2LIHmt5m/YACeiG4RQsdHvtJCIaCER0YLCt8H99+8lTtgmj6tw111BPr9FReFLL0WBwW+xIbYwMjKZMMXWNp4rEohhST/SQiKihUREC163Cw891InUWCIfOLUIO6OOKx9/XJk501u2jMCAv2YNlXH8m11duZI8JartyILNX3fd4MEHd4gZFBJSUbj51v/7n3mlbFfqjIxKhdC3w8joJ1pIRLSQiGiB1h465pg2prFmzzmH8j1v/nzezYebWgjCj9Lzz+cuvTSz++7tNTKKjz5KxNtqMmCYocKi3xTrbeGV+u23OmAAvNp//tMvtJCIaCER0aLy5ZeZHXdsSzwZA8KbO9fKFNq2ajV4Rm1d7oorMjvs0BZmZE89lSo8+3yKveuAAaiwgaJeKf8f/zBU2CbFttfLvyUiWkhEtAiC4jPPtOh9Ih6eu/xyb8ECKjNa/36SjxQK+LJyl13G120db6h7+9KU5hkqbJc//hjjI+q5Im7R6JWiJqM3aSER0UIiogVJormrrmopBrD33sXHH+cN3WUQMM0Cm4DmfVQwxNcrFIukpVJGx2s7oYJRvaRTA8FXR+O3xIxJk7w5c+wzq2vWWDWG7dIbb9Ct1s7wa2sTEs2vJX7ea7SQiGghEdGCqMDQiSe2Erguv/derDGB0vTXrq188QWuf5qH8+t6Tvg+X722bh0dmaphsXQL4WJMjfKbb/L9tFL4TV+QzRCi5LsRGK+9hlWx+QwWRoNLCoSQfNw7tJCIaCER0YLy5qFjj23ae4P2REfXf2i5XP3xx/L771v/vrp6N36N9QAbwjJp3D6YHXCiXe1J+NLYOk3HvSnQsw/jO28EBvAjcdbO0Ly2ERjAD5D0Ai0kIlpIRLTA8zN0xBHNvYMXH37YUkuNAZRGe7NmMQpphBOTJ2NPRDkReB56Fn+UaVUOtMQJt51RfPJJGn40B4zS5MkJwHjhhWiiFO61RmBAQRKlupsWEhEtJCJaEGNorj8gGbGkkDZOuaAxrSlTPP6kzEbdUyRHEV3AmIi6a1CmHe2fgULPnnVWc0YG1R72Ody3MYYBQjCJohaGCxjdSguJiBYSES0Iz2JVNDGljhBFnX6nm3fodLLNb6OefZjhE5mIcIKNHrcqh073Qyx/9FFml12aAEYaC4PYRqKFEdBUqutoIRHRQiKiBSmeDM0erepEBOMAcVt4oqi4rq9LiI6uCwLerMkR6lwhW/qkqewpp7QADKeFATCI0idaGACjq2ghEdFCIqJFrUZd22j9+EQpMAWiH0IcO5xdahvXDfmvsfMhbNPYI6BkYVxWtUqWLXfpMDDcMQyA0S20kIimIWlpFe67b7TeJyrg6mLj5XfeqdOYBC0ILJtJQVCksXINVRtgdozr4i4Uq7fdJVVMtDAMGFpaE38akkQ0rKIybdroain22QdrAEFb/NZGW9umX4hZHkSzSXOKUZSknAZBR1+u04/rGDzggNECA0PKZWEYMMgJHltgyByRiO4vkQ4sXorttTrlHIgtarMrlcrnnzf2w0AJgoH4nt42b27TpjHQfekXgZOho4/uhIXhr1+fHPQmBWBi0kIiooVERAtqGoaOOmp0qNi4MdoTiZq1xhRSarCjKhjvU0xzVptvOkFoYWWJxx3XpIXhBga1Jha8MQujY8AQLSSi+0uk3YuOsKNAxfHHYyVEKzPQko2oINAdrbdADzaiwj5nQtHCcrqyJ5/cEZdUmhhG68AQLSSi+0uk7aHdUVkV0cZ5BG+tNju6/VWrLKaN0oxtfWGfMwFpYcBgmEfbXVI8Mcs2NpdUQmuQ8aWFREQLiYgWZLKmb7THSSyJLVRhQ0yb7UWae1NnF6MKLZw7gWlhKV4dCnpTt9jhoLdoIRHdXyLtW4U77kifLAseoqhoVIJsZhwBCSvkjkUFDaPGWPe1OC6QYu9OWBg+FkZS80HiQ+NMC4mIFhIRLVBGKevROAYGorGKWAdUZcYMK9XG2RKPCmu31yW0YHlLljBSqf3AeOklP4VLiuEf40cLiYgWEhEtqtX0zaCKzz5rcrVMpvTqq42ooFqb3Cpz4MSiorpyZeD7XUcLFk+gE61BAIazvXnrwBAtJKL7S6T1RQfAtD2gzjzTLAZ4UJo6tREV6EFejS0WQr5TbBLUcIiT7qKF9US54IImgAEPxgkYooVEdH+JtLxoHUjIOuVQI/SXRa0r06c3ooJN2Z31lGVARUJkuwtpwaKK0MYotd0lRSwn2SU1MDCmtJCIaCER0YKBoCk1XXS2KDMnYlFR/vBDQBLixBp71G3/55/HMx+0TYsuJh2Yh9EZYIgWEtH9JdJ61mxmjz3S6LjcRRdFR0xbD6i63B6K7JxeFJtEXS73AC1YuSuvbA4Y8CANMBJdUpg4osVYiIgWEhEt0EqpfFA77WTVFYHnMUA73gdFNCI8UyrFhytsQlxP0AJ/WmbXXcfXwkjVLkW0kIjuL5EWU6EsYpH+Xbi6ZEksKkAI4V/zQbnyoPjbnqEFizgEz6clYLhjGFT2AYnkoHcyMEQLiej+EmlhEYdIWbZtg4mCoaFYHxSbLtzmp4pFBds6fPQMLYjkDx5yCE+pQy4pgIFV1yZgiBaihZZWUyt72mlpNBrTqk0kthU5uxIJbtNuNhYVjIsY7sVV+fRTnlKrFkbngaGlJcDKUGhm+atXp9FlvDgP+761j41FBdscJvzCaVjk81362ptYfmEtzTvnkgISCfMwAEYmowFKEmmzjEREi8Ldd6cyLN591wosKOKLj1hMn26BEIotEgyLnqOFmRedBoYlCBgwWmz8LlqIFhIRLZKrkTN77ZWowihAs2xXRve4DAsbA4fDJCFi0Xu0sHyBAw9MpkJr3WoNGOaS6qyFIVqIFhIRLbylS9PoLzSUidAl0JkKFQQhgVyV276lQvUoLVgYBzyxjgPjlVccwOiAhSFaiBYSES0Kd92VqLnotGrRCKrAzDdSt6urV4dnaF4Uiwrr89HbtGBcUmaHHVoGRnJrEIDB80x0SbWcfiZaiBYSES18P7PnnsnF2xdfbBKVuXNjUUHx9nClEp6prlkTiwp8Izhqep4WrPy11ybzoOVutQaMRAuj1oqFIVqIFhIRLei9kUZnkSz7JysqUCGWFt7MmSNnikWXYcEEIf6+H2jhLVhgT6/TFgaN4qlrSbYwhoZEC4k0KSMR0QLVn9zqY9KkoFAIz5PO5Ixvr1tnybUuWuBD7xNaYLRZY9qOxjCSLYzWXVKihWghEdEid/75iaqKfnmJFXloK5t1QUuPeFqgrTjTH7RgFe68k6fX/RaGaCFaSES0qFZpEZjshpo2zTpbON1QX36Z0g3VP7SozJplz3DMYhgBwGivhSFaiBYSES1Ick2jpKzVBOre5YYirD1y5h//cNEC5dVXtCAzamDbbe0xdsQl1bSFkc2KFiYiWkhEtGhDWcDgYYfZ+crs2S5aMBvDAhvOoEWx2Fe0YGXPOMOe5Ji5pBhpFR2/CqRbAoZoIVpIRLTI33Zbom4q3HHHZrq8+WZ8Ud5bb1lHEJKsYlFhI1f7ihbFJ5/kGY49MHgPoCwmwcJgFFUaYIgWooVERIvsqacmKib6QdlQI1dRHg76kTP5fELQop9okT50MXTkkW2PYRgwzMJoEhiihWghEdEis9tuiVrJ/7M8mwZQLjcU8Q+XSrLN6Lc+pAUhnzSqnwHm+RtvbHsMA2DQurwlYIgWooVERAtioWkafgR/lmejWVy0MBLU/vjDSYuBgT6kBa65zO67J/fgeuwx6jMo/267hUEMIxUwcjnRIn5pGpKWFmoiOcR90EHR4XouWtg0PddQVfYwZ/pyZc88M7mi5dJLOWnAaG8Mo4xLKpNpMoahpWlIAqxsC7wfiZooe+65m8+/804sKqL+EFxSTlrUan1oW7DyN92UTOVDDw0Pd87CqKVzSfWobSER3V+0qNWCbPavGoBXq7jO/d9/p7V13bHi008nJ0TdfrudJ5E/lhZQxL4ZByosIaofaVF86qlkjb/ddkbTloDh7s5SnjyZtivRgIrLJSVaiBY9JCJaBEHliy9wcYwUf02aRAMPb+HCLY4wum7p0tJLL5m+QKH4P/9sBwr33pusg154wT7N5YZiVNzIGXcVN53M+5YWJJWlUfeWv9QWYPA/hlhg4JKKWiEuYIgWokVPiIgW1Wr+6qtdpoDNzfb/+MM8ErFDs3NXXZXc8+Pjj0dIMDTkooU3f76VLiekz/YlLXg+aXQ9IQcTaRoYlZkzTbw0ZUqM2xALw2DgebAhHhj5vGghWnS9iGhB/sxf6Iv8ddcZMIg5NwLD/9vfwr8dOvbYRO3jzZ1rjgsnLZYuHTkzOOhMiPr9976lRXXFijSKvvrjj8Oscrm2cWPTwBjcbz8rmPccOWxlun4FgWVFOz2HnidadIeIaCERZ9rr9tujF5oERpQWRx+dTIsFC0a+7t/+5qIFyiU8g1vcRQsMnb6lBRhIo+h5SmF5IxHpVoCBuOU+JWY8Yw4m/MhEC9GiS0VEi/JHH6VRGflrrsFhFQVGk7QgFpJEC4tgBxs3Om2LDRv6lhZ44VLRYsWKkBY80laAkT3lFBMsvvBCvDm4eHFiYgL+KEwQ0UK06FYR0aL4zDMptUbuiivMmWDA6AQt/JUrwzP0ynapHsT7lhaQMqVtYbRoBRjMzbUvzYfE/sgsvMGCCgldIEUL0aIbRUQL/v9veiFVzVelEgVGR2ixalWsbSFaWLpBKlrwLs8zHBzkkbYCDHoGJyY9e3Pm2Bma0TppUSqJFqJFt4qIFrh9RuXFzl10UVAuR4ExKlqQz2PDU5NpMTDg0jsMYe1fWqxZk4oW/2+igQceaSvAKNx995+sKDmdh2YOet5feaJqNdFCtOhaEeVEBUH25JNHBQxKMewlkXoLyvRGaHHMMYmylenTE0Om1G9blq3TtujjKDdqN82PiZK6sMqaR9o0MOjrRVDdbBpX7T0gSQl40UK06EoR0cKKqjK77DIqYGTPOafRB509/fT0CTbkYjlpsWxZeIZEfpfqoZigf+stlixJ8zPCejMbrmlgENZKnKBeXbs2GoGP/3n98IMyaEWL7hYRLex1NbPzzqMCBoXfQaGArC2iGolSxYcfTq7OmzcvsZYbDdW3tKDWPc0PKCyaq61bxyNNBEbhnnvqxKnq5xi+o2i1f92HUNhvA3EtHFX9+ut6VKxaZe8WokV3iIgWEmkvMDAmok0dCnfdlShCRzwrIHfRgt60pqFM9dRt3CN9Sws8P4nPGV0fpquizV3PufzBB3VlHIX778dqzF1yCS2/QtPElsEAlpenT8fO4H8wsQzAS0n5BcYfrjCcV/imLHFWtOgaEdFCIm0HBsn4FGSlT69iuF5igo0N12NVf/ghlhbe11+jg/qTFtgBaWqwE4eIYCsMd2D1AsUlIlpIpBPAGDrxRNxKKYeA8uHm3IAK8U6SF180EvB+6uxY7nn9SQve/ZOpfMYZ4WFarbhoYSV1AU/S9+P7Df/3v6KFRDQNSat9wDj+eLp0kEaZ5rCVSlRmz3YpshA/LBJpXLTo22E7Q0cckezxu+GG8DBtHBPTXsk44IdOF3qad/FrfEdkUpH7QOWEhSW0tDQNSbZFe4BBS0GfqrGtt07fWJBSD5cis2xL3m1dtECj9aFtQWYBWa32MBNzmcpvvuls7rR+fXiGipmETGXZFhLR/UWLdgLjqKPoEpF4jGE+iQV6BLcT06KAUx/Sgvf9VJ3Gw5iE7zNQxEmLgQFX2qttymJEC4no/qJFwuLd34DRxm0udQIPsQMz2JUZMywtim8jVpHhSOlDWjBkIv1wCywzFypIfiWAZNlQTlpkMqKFRHR/0aIjFkaaIaCWeVn54ANXebDpMhRfvC7D/vD9fqMF3eOTUwkmTQpTAJgw6EyImjYtMU2ZzXgM0UIiur9oMW4Whs07qi5f7lJn1lAEZ4gz0D0w0F+0qNUye+2VptI+PM40EdfjZWhuYsG8tY4XLSSi+4sW42NhFB95JPxkkJAcuiiXE1oP9Q0tUmad8fRcppttMqASYUxalGghEd1ftBhPC2PwoIPMDVKePDmxRo+uq7HqjNq9vqIFIetRTLaoVqlccdECkyIxxA3LRQuJ6P6ixXhaGNYhleUtWuTUaNlssjOqWOwfWlAJn/xsJ00KW8r77gkipalTo+8BCc9WtJCI7i9ajKOFUXz2WSsNS25dXi577rFIfUILRualKWfJnnWWtap1PVgIbQnKCYNRRQuJ6P6ixfhaGExkM2XkagFSfvtt/tYGaThbYQdBH9Ai7Uzc0p9Bi/I777hoQde/RKPNAhuihUR0f9FinC0MMqNsBp9Lr1nBNhNDE1qA9DYtgmDwkEPSPFW0fDiOu+SoZSm98gq5Va6AkG1auYgWEtH9RYsJYWHkrrjC5ivQvza+LMAGPgeBq4ishn7sdVpA1pQNuwwDLgDT/NGqI0k8S3BDiRYS0f1Fi3G3MOh3RBu78NNQW86SY5vi6egZhSyBjd6mRe6CC3hi6UcTUnznooXlxQY0E0zoqiJaSET3Fy0mhoVRePDBEc1VqbjGXXjLl4+cqdVImXXFunuYFiS5polvcyakL645pxsKnPi+hYIS3FCihUR0f9FiggCDHhUk9dtHubqAmOlQc7wOI0t5Qa/SIn/rrSln31rnQZdhYbEi8Ox0Q5GKVquJFhIRLUSLiQWMwt1320ye0uTJzrpui16sWhWr4+ho25O0oF6dzlppnmT5ww9DEXLJYh8jBgfJAuEZrBCnG4qMqWaWaCFaaGl1MoaBKkTRm8vFaV4UiwnJUd98w/vycM8tcgHSPEb6R3H9MCnWZVgwT3szhFaudI2wbWIooZaWpiFJZCwsjPzVV5vpUHaEZ7158/h760o7VrHZ8U8lSPkMSQcIRZhs4aJF2MacVRsaanOZhQwFiej+EhkbYHgLF44osk2binEDfJiEQQ6PpX6iRuOTowqF3qFFrZam1Qc7s9NO4Wxa/u2Kb5ffegsYJ/aGon/UxKWFREQLiWiAEn0GzdfkmsBa+fBD03fBpk3x+m71as70Bi3Kb7yRPrUssekWhBgOl7vbhzXvmri0kIhoIRENUCo+/HCiPwqQJPqjiN/2AC24RdrHuO22HA67aRHgcfVQMYjia2q/YSFaSET3l8iYAYNyAcvvpGIgtrqbFty4qqwCnHkP8eHuUqm7aREEuQsvTGtY3HtvKFRdtizZsCiXXYmzdqaJJVpIRPeXyJhmSZHYYzCg8x2xivi5FzZgtVSKD2CsWkUpX/fSgkzitE9st92opAsbQxHoTjQsSARw1cO30J9ctJCI7i+RMa/DyF10EdFdy/JMaB4FVAYGPMdYvS6lBfxLWWDBLk2ZEkqRM5bYcZYUAKjQgXQy0UIiur9ExqMOo/jYY8j+ddi2umaNnXEVmtU2buw6WjBpfHC//UbR9T2sschkXKlQHj0E/1wEsV3zt1uqsRAtJKL7S2S8Kr0rn3xiHnwsidgARnQOKH2i4gMYuVwX0YLyOrp3jCLteP78UJDH5apqtJRiiOKcqPrf/3ZlYbZERAuJaIAS/aPQYgaM2IozwuC1SPM7f/362LdmIt7dQYtajSrFJvq9kxvmDG7/+GNiv/fq2rVd3MZDIqKFRDRAiYoz2tttBsbs2Y3akIoEort2prZuXYw2RGN63sSnBTUTTaQDwELnaJCPPrLgNr1VXO1SyBToblpIRLSQiAYoZfbYg2EMBoPYGAbzRKPJPER041OkPG8i06L41FPctxkf1Ny5rgF5ZCEnBrdpKtULLQIlIlpIRAOUMrvvjnFgn4C1QTi3MUM02vAj2LjRa1COpFcBjHGgRQdQUbjrLkMjT8PVEsooyxw9Z4FFEPQILSQiWkhEA5Qyu+yCwwRZc6o0zk0qTZ0aNkqyPrUxdRgAo1KZWLQIgsL994+uRcqhh46g0ffBpKsDY2LCGHOlhqvVnmo/LhHRQiIaoJTZYYfKzJn2CYCh8sEH9cCYMoVZSdH8In/t2sY5P8Q5JggtCDlYWDvlzuy4I4ZCKF5dvtxVi2dWFM6oWB8Uf2jZYu1cooVoIRHRYtxdUvQFKT7+uBXu8VaOyjM/jKXVRttXcAZDxGuI61LQN+60IGk1e/LJo30Clc8+C8WJN3D32DwxUGqdeqFjfLiC5OMOLNFCtNDSGn8Lw9JGoy/FtX//myh33Xg48BB1x3O+rp0UB/D4c2Yc724leOk3tzOjpDx1amwNCg/ESOkau+1v2DCspaVpSOMuIpFOV3oPHnigDV61SgLrvWrJozhhoqUMuO/R0VGliUvHxn2P3fJ9vr2BbbZpZmBUEIR3qcyYETtFFbvKVa5om+g3n9MXhoJE5ImSiAYooW3JIxqOhKyJRhDaRWNGU0jDvCBbnCcfN+rHB1fWHWQMVm3DBsd0o4Q9dNJJVmNI7mxsuIInaV+IsVGxqACQhop+oYVERAuJaIASXZK8JUuiH0U3Vm/mzCgzcPTXhXMpzmDAQ5QZeGxMF3dqVasUElJv2AwqDj/c+vLiQ4tHxbJlm5k0OMjtYotOLAmqv2ghEdFCIhqgxM5ff72VmFkAmQQqG9dKH28i29bk3Fqd03XVfFMcIJJhTc7buxjaAdiaux35stbEiZzXWFRE/XIk13Kp2JGChoqupIVERAuJiBZWdkchXnMqdWDSpMIDD9gLuNkQWC3lN9+0goxGP0zg+3iiLBrMecDDmTamfmXPO6/JS4GKAw6wOYCoe7OZYlFhV451QBkqupgWEhEtJCJa2ARQ9GPTuhU/D8EM6vLqyt8AAI6a8rvvoluBB127LQ03qmc5Vv3pJ4rAeYXndR47o0VOJA2/S/azEakOP42crkZUMCoKxA7bcqCCpoFAsUfSYSUiWkhEtDAn0tCxx7aiZAe23z5/zTWEgmOQkM8zFYO/oqMtehanTWwjWIIfqGni4TXe60ebNFWp4ATLnnZaK1dgEwxn0EUsKsy9BlyjtIstreAWhr0eoYVERAuJiBZWp5095xw0Zot78JBDqD+ouWoLgiAgxTbppZui6JTaln7pxSeeSHCmpU6WtdReHE0xybKTJ5P1FKVgo1VBPBza9XSpnUREC4mo/Nv3GZ9H6TKqs/WNscK7OW/ZnSiewK9Fqu7Q8ce35VslM7hECV7IpyCIHZ5afv/9aPMSJnzEhLUJ2lsUp7dpIRHRQiJqFuLNmUM/QXRou/bgPvvkrryy9PrrqNem6/LwlfGNYUZkzz47ZUZs+pEVZE9Z047Kp5821t/Rsz2oVqN1FRgfMfM8isW+aOMhEdFCIqKFuXeGTjyxJS3s7rlE743sGWfkb765+OyzRL95ZyfkwOu8t2xZuFHNTDClTqL4zDP5m24iGoFCR7YTG+cbHDJzobG5LJDz162LetL8uGrt2vr1FrDpJ1pIRLSQiBoR+j79ycmRRaX25Ka9Lhc0FU8VCK6tOlTQ6oOYfDSaEtteF8z0dYtAiYgWElHbWjogmZHRSxvjxuLwuJiwZiz9yXrKAoZoCQjB+cb0J/KjQIgaykpEtJCImpxDDB/Vmdl1197gxODee1emTTOTIti0iYqQunIKAiQ2NNsasBOoqB8ia61NRAuJiBYSES1sKB5l2wPbbtu9nOCb5wqm4gEGACjRpySa+PTRRzbZydJkre96tPLceCNaSES0kIhoUb9Ih81dfHHXcYIEWYLqlP5Fx6DWBbTL773H7bZwPdVqiNS1zsXISNXMQ7SQiKYhaWn5q1dTyIYK7gpO0P2QCHa0/V9l1qwtODFtmm8giXTVJSO2jhPBaDmhpaVpSBKROYL2xLGTmahJU5SM8O3R4DbaHYSR2rTusIF3YAOfUmOfkmjik79yZY25eGrjIRF5oiQiWrSy6KpUmjJl6JhjJg4nGLtN4DqIFspVq6QzEasPOYEPig6GjaM1MDtwRoXjxCkkrP3xRzgHUG4liYgWEpFI2xY5QoV777UyurHfgwcfTDXfSCWdrXKZwEPIifJbb1WXLq0zJmyEOLnCYesOBv9Rqh3pZCVaSES0kIhE2r5qNYY6oJqp0qBsewzCEnwhvlzMCI3BQW/xYurvKtOnY1jw29gWh7R1wu+EqUH5OmfiWhmKFhIRLSQikU4u3P3UQhfuuw/X0MB227WLEAz7y51/PmaEt3AhnqIYAAwMAA8IgRnhiksHlQps4ABDmYKE5k6ihUREC4lIZKwW2pn3d6oZaPVauP120nCHjj46s+eefx0kpyQwe8op+euuo5lg+YMPaCFFSmtCwDliYbR2zJZoIRHRQiISmRiL8DJWAvlL5FnZptmf6fT/a++uERAIoiAK9sj9rwwhrmtWlXf80P2LUgsTtTAxYfu1MDGpAYBragGAWgCgFgCoBQBqAYBaAKAWAFAu/9EAAP9ONDExMTHxX24A/qYWAKgFAGoBgFoAoBYAqAUAagEAagGAWgCgFgCoBQBqAYBaAKAWALiGBADue5iYmJiYuIYEgO8tAFALANQCALUAQC0AQC0AUAsA1AIAtQBALQBQCwDUAgC1AAC1AABOAJOpYUfKj0xMvmRiUgMAr/neAgC1AEAtAFALANQCALUAQC0AUAsAUAsA1AIAtQBALQBQCwDUAgBwDQkg7KkWE01MTExMagDgNbUAQC0AUAsA1AIAtQBALQBQCwDUAgDUAgC1AEAtAFALANQCALUAAFxDAgiDuIZkYmLiGhIAqAUAagGAWgCgFgCoBQBqAYBaAKAWAKAWAKgFAGoBgFoAoBYAqAUA4BoSQA07Un5kYvIlExO1AMD3FgAsUQsA1AIA1AIAtQBALQBQCwDUAgC1AEAtAKAHALZSCwDUAgC1AABcQwIIe6rFRBMTExOTHgB4TS0AUAsA1AIAtQBALQBQCwDUAgC1AAC1AEAtAFALANQCALUAQC0AANeQAMIgriGZmJi4hgQAagGAWgCgFgCoBQBqAYBaAKAWAKgFAKgFAGoBgFoAoBYAqAUAagEAuIYEEAZxDcnExMQ1JABQCwDUAgC1AEAtAFALANQCALUAQC0AQC0AUAsA1AIAtQBALQBQCwDANSSAMIhrSCYmJq4hAYBaAKAWAKgFAGoBgFoAoBYAqAUAagEAagGAWgCgFgCoBQBqAYBaAACuIQGEN1xDMjExMfFJFABqAYBaAKAWAKgFAGoBgFoAoBYAoBYAqAUAagGAWgCgFgCoBQBqAQBn7cGBi6lOXXAAAAAASUVORK5CYII=">');
      }
    }

    // Fixes glyph issues
    if (FEATURES.fixGlyphIssues) {
      const baseURL = 'https://raw.githubusercontent.com/atnbueno/shortcut-icons/ab477b8e9d136017d9efbe21d6fc596e6d3ce485/';
      GM.addStyle(''+`
      .ios18.shortcut-icon::after {
        background-image: url(${baseURL}ios18-glyphs.png) !important;
      }
      .ios17.shortcut-icon::after {
        background-image: url(${baseURL}ios17-glyphs.png) !important;
      }
      .ios16.shortcut-icon::after {
        background-image: url(${baseURL}ios16-glyphs.png) !important;
      }
      .ios15.shortcut-icon::after {
        background-image: url(${baseURL}ios15-glyphs.png) !important;
      }
      .ios14.shortcut-icon::after {
        background-image: url(${baseURL}ios14-glyphs.png) !important;
      }
      .ios13.shortcut-icon::after {
        background-image: url(${baseURL}ios13-glyphs.png) !important;
      }
      .ios12.shortcut-icon::after {
        background-image: url(${baseURL}ios12-glyphs.png) !important;
      }`);
    }

    GM.addStyle(
    // Avoids layout shifting in the navbar
    `.fas {
        min-width: 20px;
      }`+
    // Restores red background for "delete" buttons
    `.button.is-dark.is-danger, .button.is-fullwidth[href$="/delete"] {
      background-color: hsl(348, 86%, 61%);
    }`+
    // Ensures proper .button separation
    `.button[type="submit"], button+a.button {
      margin-bottom: 0.5rem;
      margin-right: 0.75rem;
    }`+
    // Avoids button overflowing horizontally in version histories
    `.button.is-fullwidth {
      width: auto;
    }`+
    // Wraps code
    `div.content pre {
      white-space: pre-wrap;
    }`+
    // Hides "Preview" tab (to avoid assuming that's how it will look to the public)
    `#previewTab {
      display: none;
    }`
    );

  });
})();
