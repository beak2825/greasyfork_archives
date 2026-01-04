// ==UserScript==
// @name        Rotate images
// @namespace   BladeMight Scripts
// @include      /^https?.*/
// @grant       none
// @version     1.0009
// @author      BladeMight
// @description 17.06.2020, 22:52:27
// @downloadURL https://update.greasyfork.org/scripts/405601/Rotate%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/405601/Rotate%20images.meta.js
// ==/UserScript==
var mx, my;
var img_b64 = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAABGdBTUEAALGPC/xhBQAAABp0RVh0U29mdHdhcmUAUGl4QnVpbGRlciBTdHVkaW/FWXY7AAABwklEQVQ4T2NwIBGANJw5w0Akgmo4f4T13HGWsyeZzp5mRFOBhqAaLu/hvrSPiwEvQNFwbbPgta0CQNErO3kv7+a5tJfr4n7OCwfZLxxmO3+U5dxxZnQNt1aJ31wjChS9sUH4+ibBa1sErm7jv7KD9/IunksgyzmBUhcOsQFdDtVwb6Hs3cUyd5ZK3V4ueWul+M3VYjfWidxYL3x9oxBQKVAz2HIeIAnV8HCG8sNZSkD+/Xny9xaANS+Rvr0MqFni1moxoDgEAF0O1fC0XxMqxsAA0jxT6cFsRbBmubuLgPqlgeK3V0gAXQ7VAOS/6NADks96tYHkkwkajyerPZ6q+mi6ClTzXIX78+WALodqeFtn+qbBBKj0VYvhyzYDoObnXbrPerSf9mk9naDxZJI6UOrRNBWg5VANH0qt35dbAUXfVZu/rTV7U2/yutH4VbPhy1aDF+36zzt1wZZrAV0O1fAlx/FzHshheMCrVoOXbfpQDT+SPb6nun1Ld/2a6fwlx+lLrsPnfPtPhXYfS2wglr+rsnhbYw50OVTDn2i/3zE+v+K8fyZ6gjSnuAM1f8t0+ZoN1OwI1VxsC9QM1UACcHAAAII+JPmc2jrCAAAAAElFTkSuQmCC')";
var img_b64_push = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAABGdBTUEAALGPC/xhBQAAABp0RVh0U29mdHdhcmUAUGl4QnVpbGRlciBTdHVkaW/FWXY7AAABpUlEQVQ4T2NwIBGANJxh4CMSQTWcZ5U9xyJ+jkngLCM/mgo0BNVwmVvnEpf2f7wARcN1QYdrAnZA0cu8Rld4jICaL3KqXmRXucAmd4FF5iyzGLqGm+JBN0V9gKI3hd2uC9oDNV/lt4RovsitfZlTCygF1Ax0OVTDfdm0OzIJd6TibktGAjXfEgu6IeIN1HxNyBWoFKgZSAI1A0mohofKFQ+VS4D8+/I5EM13pROAmm9JBAM1A8UhAOhyqIanml1Qsf//wZorHigUAjXfk0u7K5sK1AwUvyMBshyqAch/oTcdSD7VngAkH2u2PlatA6JHKpVQzYq59+SygZZDNbwxW/fadCVQ6SujxS8M5gA1P9edBtT8VLv7iUbnE41WoBREM1TDB5v97y33AUXfmm8Gotema18br4BqNpgD1AyUeqY1AehyqIYvDlc+O54HiuIBrwwWATVDNfzwePrd9clX9/tfnW9+cbryxeHCZ/vzn+xOfbQ+ArH8ncUOoM1Al0M1/Pb/+dv36y+v9z+8XoE0u4M1u9766nwVZDlEsy1IM1QDCcDBAQBG/oKAP6AiGQAAAABJRU5ErkJggg==')";
var flip_b64 = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAABGdBTUEAALGPC/xhBQAAABp0RVh0U29mdHdhcmUAUGl4QnVpbGRlciBTdHVkaW/FWXY7AAABXElEQVQ4T2NwIBGANPwPDoajf6FBf6L8fsV7fU9x/5rl/Dnf/mOJzbtKizf1Jq9aDNE1/I3w/x3r8yPZ41uGy5dcx49Ftu8rLN/Wmr5qMnrRrvesVwuh4W94wO8Y35+Jnt/T3L5kO30qtPtQZvWu2vx1g/HLNv3n3TpPJmg8mqYC1QB1QyoWNzzv1H3ar/l4iurDWUr358tBNSDcUGzLwMCA7AYg9+EM5ftzFe4ulrm9QgKq4UsO1A1AaTQ3PJitCBS8s0zq5mqx6xuFoBqAbgCKEgSXd/FANcDdABR9Mkkd2Q0314oCBa/s4L20j+vCYTaoBmQ3AKXvLZSFuwFk8B7uiwfZzx1nOXMGpBiEkcPhzhLpW6vEb6wXvrZFAOiGiwc4zh9lPXuKEagaoQHsBnm4G65tFoS74dwJZohSFA3Ibri6jR/ZDWgIqgGPG9AQVAMeN6AhqAYSgIMDAOGUSM3NHQEIAAAAAElFTkSuQmCC')";
var flip_b64_push = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAABGdBTUEAALGPC/xhBQAAABp0RVh0U29mdHdhcmUAUGl4QnVpbGRlciBTdHVkaW/FWXY7AAABVElEQVQ4T2NwIBGANLwN/g9HH4L+ffX//cvr+3f3N1+dH322v/7R+sw7i4OvTbe9MlqNruGT/9+fvr9/eLz96vr4i8Odj7Zn31seemO2/ZXR+hd6S55pzURoACr94ffrh9en764vvjjd/WR36YPV8bfme14bb3hhsPS57qzHmn2PVJqgGvC44bnu/Keakx+rtj9UrrknVwLVgOyG////I7sByH2o3HhfseyOTOYdiSSoBrgbgNJobnigUAUUvCOVfEss+pqQH1QD0A1AUYLgCo81VAPcDUDRJxp9yG64KRoGFLzMa32Jy+QCmzpUA7IbgNL3ZfPhbgCp5ja9yK57jkXxDIMEVANyONyVzrwpHn1TOOCagAfQDRc49M6zqp1llASqRmgAuUG+FO6G64KecDecZZaHKEXRgOyGq/xOyG5AQ1ANeNyAhqAa8LgBDUE1kAAcHADuzG/GyEfMIwAAAABJRU5ErkJggg==')";
var last, last_img, last_fl, last_flv, lock_timeout = 0;
const bst = "z-index: 2000 !important; min-height: 16px !important; \
padding: 0 !important; width: 16px !important; height: 16px !important; \
border: 0px !important; color: red !important; position: absolute !important;";
window.onmousemove = (event) => {
  mx = event.clientX;
  my = event.clientY;
  var elms = document.elementsFromPoint(mx, my);
  var img = elms[0];
  if (img) {
    var p = img.parentNode;
    // console.log(img);
    if (img.tagName !== "IMG" && img.className.includes("lshowprev")) {
      if (img.firstChild.tagName === "IMG")
        img = img.firstChild;
      else 
        img = p.querySelector("img");
    }
    if (img.tagName === "IMG" || img == last || img == last_fl || img == last_flv) {
      if (img.width >= 48 && img.height >= 18) {
        var bc = img.getBoundingClientRect();
        // console.log("OFFL: ", bc);
        var BMRI_BASE = document.createElement("div");
        BMRI_BASE.className = "BMRI_BASE_DIV";
        BMRI_BASE.style.cssText = "position: fixed !important; left: " + bc.left + "px; top: " + bc.top + "px;";
        var br = img.getBoundingClientRect();
        if (!p.querySelector(".BMRI_rotate_right")) {
          var ch = document.createElement("button");
          ch.style.cssText = bst + "background: "+img_b64+" !important;";
          ch.className = "BMRI_rotate_right";
          var rotation = 0;
          ch.onclick = (e) => { 
            e.stopPropagation();
            e.preventDefault()
            img.style.transition = "transform 0.3s ease-in";
            rotation += 90;
            if (!/rotate/.exec(img.style.transform))
              img.style.transform += "rotate("+rotation+"deg)";
            else
              img.style.transform = img.style.transform.replace(/rotate\(\d+deg\)/, "rotate("+rotation+"deg)");
            img.style["pointer-events"] = "none";
            if (rotation > 270) rotation = -90;
            // console.log("rotate: " + rotation, img)
          }
          // ch.innerText = "→";
          last = ch;
          last_img = img;
          BMRI_BASE.appendChild(ch);
          ch.onmousedown = (e) => { ch.style.background = img_b64_push; };
          ch.onmouseup = (e) => { ch.style.background = img_b64; };
        }
        if (!p.querySelector(".BMRI_flip_img")) {
          var fl = document.createElement("button");
          fl.style.cssText = bst + "background: "+flip_b64+" !important; left: 16px !important;";
          fl.className = "BMRI_flip_img";
          var x = 1;
          fl.onclick = (e) => {
            e.stopPropagation();
            e.preventDefault()
            img.style.transition = "transform 0.3s ease-in";
            if (x == 1) { x = -1; } else { x = 1; }
            if (!/scaleX/.exec(img.style.transform))
              img.style.transform += "scaleX("+x+")";
            else
              img.style.transform = img.style.transform.replace(/scaleX\([\d-]+\)/, "scaleX("+x+")");
          }
          BMRI_BASE.appendChild(fl);
          fl.onmousedown = (e) => { fl.style.background = flip_b64_push; };
          fl.onmouseup = (e) => { fl.style.background = flip_b64; };
          last_fl = fl;
        }
        if (!p.querySelector('.BMRI_flip_ver_img')) {
          var flv = document.createElement("button");
          flv.style.cssText = bst + "background: "+flip_b64+" !important; left: 31px !important; transform: rotate(90deg) !important;";
          flv.className = "BMRI_flip_ver_img";
          var y = 1;
          flv.onclick = (e) => {
            e.stopPropagation();
            e.preventDefault()
            img.style.transition = "transform 0.3s ease-in";
            if (y == 1) { y = -1; } else { y = 1; }
            if (!/scaleY/.exec(img.style.transform))
              img.style.transform += "scaleY("+y+")";
            else
              img.style.transform = img.style.transform.replace(/scaleY\([\d-]+\)/, "scaleY("+y+")");
          }
          BMRI_BASE.appendChild(flv);
          flv.onmousedown = (e) => { flv.style.background = flip_b64_push; };
          flv.onmouseup = (e) => { flv.style.background = flip_b64; };
          last_flv = flv;
        }
        if (!document.querySelector(".BMRI_BASE_DIV"))
          p.appendChild(BMRI_BASE);
      } // else if (img.tagName === "IMG") { console.log("Too small img: " + img.width + "x" + img.height); }
    } else {
      if (last_img) {
        last_img.style.transform = "rotate(0deg)";
        last_img.style.transform = "";
        if (lock_timeout === 0) 
          setTimeout(() => { clock_timeout = 0; last_img.style.transition = "";}, 300);
        lock_timeout = 1;
        last_img.style["pointer-events"] = "";
      }
      var BB = document.querySelector(".BMRI_BASE_DIV");
      if (BB) BB.remove();
      if (last) last.remove();
      if (last_fl) last_fl.remove();
      if (last_flv) last_flv.remove();
    }
  }
  // console.log(mx, my);
}