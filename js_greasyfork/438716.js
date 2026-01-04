// ==UserScript==
// @name          fast search
// @namespace     https://github.com/peihaojie/fastSearch
// @author        HaoJie
// @description   该脚实现选中文本快速复制，快速搜索的功能
// @description   注意: 需要增加适配网站，请手动修改 @include
// @supportURL    https://github.com/peihaojie/fastSearch/issues
// @run-at document-body
// @resource      https://at.alicdn.com/t/font_3148281_vf5cr0hy39.css?spm=a313x.7781069.1998910419.83&file=font_3148281_vf5cr0hy39.css
// @include       *
// @exclude       *://www.iconfont.cn/*
// @version       1.2.1
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAFuhJREFUeF7tnQm0d9d4xh9paIJK1BBDESlLgghtRJAKNdRMjUsFSZQWNVRDaEu0hhqCREKrKDG05qDGGBMkQZBQlKSUItFEFW1DWHT9fPtw3e/e75733cPZ53/ed62z7pes/e7h2ef577P3foeLKSQQCAQ2ReBigU0gEAhsjkAQJN6OQGAHCARB4vUIBIIg8Q4EAj4EYgXx4RZaC0EgCLKQiY5h+hAIgvhwC62FIBAEWchExzB9CARBfLiF1kIQCIIsZKJjmD4EgiA+3EJrIQgEQepN9G6Sdpe02d8fSPruDp7/rde1qHksAkGQsUhtXA4C7J2e66z5N/8vV/5P0r+m54tr/s3/uyi38tAfh0AQZBxOQ6lbSuI5OJHhSjb1YqW/LOksSe+T9CFJny9Wc1T0SwgEQXb8QkCGg9Y8l+r0/flaIsupkk4LwpSbpSDIL2O5s6S7pefWkq5SDuqmNX1O0kmS3irp5KYtr1hjQZBtE/o7a4hxrRWb49MTUSDLF1ZsbNWHs2SCsJEeVoubVke6jwb+eQ1ZLuijS333YokEYYN9aHr6np16vTtP0ivSwwlZyCYILIkgd02k+P14G36OwIVriPLxwGV7BJZAkEMSMdh0h2yOwGsSWTg6DkkIrDJB7iXpSEn7x2ybEGAz/wxJsaJIWkWC7CXpzyU92PRaROG1CPwwkQSi/HjJ0KwaQR6eyHHVJU9qwbFz6fh0Se8oWOesqloVghyYiHGXidH/UjIBwQyE59uS2AgPD/ZVw78vLmkXSbuue/h/vyHphpL2S8/UF5bHpxXl3Inxbd78KhDkKYkcvHAtBTJ8NH2rQ4Yz08tfow9XSESBNAdI4t4GErWUcyQ9VdIrWzY6dVtzJsi+kv5G0p0agPh9SZ9MzycknSJp6l9Tbvxvkh5Iw79byHGSnihpEeb4cyXIYYkce1R+I7CUfUN6zq/cVm7115V07/RcL7eyLfQxX4Ek4LPSMjeC4HzEqvGwirMCEQZSzPUFGIjC31rC6RYkObpWAz3UOyeCcNEHOW5cCTh+FV81k9ViLATDqoJpzZ5jlYzlXp+Igo/KyslcCPIHkrjprSHvSjfITPSqCivvg9LzWxUGiT3XQ9PerEL101U5B4Kw3/iHChBBuBMkvbdC3T1X+YBElNKmN/jXPyStwD2P39S33gnCXuNFphFtXfh16bv5jK2LrnQJTP0xxSlt6s8PGpbCKyE9E+RJkv66IMqflfSsip9qBbvarKqdEkkgCp9hpeSRkrhcnL30ShB+gfhmLiE/ScSAHHwGhGyPAHdKkOT+BcF5QsK9YJXtq+qRIB+QdKtCUGCZCjGwKQrZGoH7JquEG2xddFSJ2ZOkN4K8TVIpeyrMIp48ahqj0FoECGX0XEmcHJYQ3A7eVKKiKeroiSCvLrTE/4ekIySt8rFti3eFS0DM3UvIbSS9v0RFrevohSD8Yj22wOC504AcEUitAJhpNWdurl2gOiLHfKRAPU2r6IEgjy+0mXuOJOoKKYvANdMnV64vP+FSby5pVsfrUxOEk6oSZ+Z/IumFZd+LqG0dApi5c8mYI7gIsCfhyH0WMiVB+DV5j6TccJ73kHTiLNCefydfnExKckbCieLvScKFoHuZiiBcSkGOXB8G9CO4QNvXrMR+8e8l/VHbbvtam4ogL5H0h74u/1wLj7pvZNYR6j4EmDvmMEceJQnnq65lCoI8WtIxmahM0e/MLq+cOpHvP5gxKjbtt8+sI6P5caqtXzQsSN8tiSjqXrmapK97lUOvKAK5JPlU2o90Gye4JUGumPYdBB7wys3CbMQLXTU9jn/fnFE7p2Ol7O4yurGxakuCvEzS4RkjuM+q+RpkYNGbau6epNtj+lYEubMkQu97JcjhRa6dXs6F71fTJWJ3hy6tCEKWo1s456rbXxfneFZZjeNbvAo9cqykx3gUa+q0IMifSnqecxBdf586x7TKapdPuRKJCOkR3By6iiRTmyDY8WCg5gmdSbpjrEC7W3Y9M78gnTtmxPIlBjCf491IbYJgH0VAaY+ECYkHtT50CAd7lLMrfKK91KlbXK0mQW6bMq16Ok38K1IYhMwXAVYDVhOrYNCInV4XdyM1CYK7K2nPrMInGb4DIfNG4EaSPuw0RmX1KRmww41kLYJgrcmNuUdwuX27RzF0ukPAG5nma5IIcEf6iEmlFkFwd/XEhZ2Nleekszafxi+RDmk84WK7CPhQgyBe+5xvpk+rlYzxOp93unhP7ynpjY5az06ryP84dIup1CAIAaDJLGsVrHxfYFWK8rNA4OXOvPTcoeVafmcBVJoghLE81dEjUg9z6hWymgjsnT61Lmcc3r+kVeRHRr1ixUsThPNrT3bZ2JgXm9JuK/LejRCf+e+mGlVJguzjDLeDEaPnOHgqzKJdHwJXThFNrFYVuFTnumb7elw4TzoXe6QMtkqsHlbE5lveu4rw+c1neHMpuYKQ3HJ/4whi9TACNvPi3lXkbzNMlrIgK0WQ2yVvQWtnYvWwIjb/8p5V5DxJpJP7TuvhlyIImyhrGJdYPVrPdh/teVcRDn9qZBrbISolCPLrkr4gCZ9zixA9/J8sClF2ZRB4vsM5CvOjUpH/RwNZgiAef2SiknA2vohk9KNnYzkFcYwiD4xVcMT6jFUpp3wJgnjMmsk7+Iicjofu7BHwHOr8lST2MM0klyCXTh5/lzH2mIBhhB4NWS4CHktfMhJzINRMcglCIDjr+TSRvUul+GoGVDRUHAHio33aWCuf5GTAambAmEsQz+Ugl4l/aQQmiq8mAic5bPDwUiRRUhPJJQgd5XPJIhg0nm5RiLIri4An4s0zJZEeronkEOTiaanDKWas/LskIp2EBAIg4LH+PkXSwa3gyyHIQcnn2NLXE5x+AZY2ouy8ECDpKqksxsqPJe0qib/VJYcgnlMI7kyI0RsSCAwIeNyzORzy3KOYUc8hCLkhcK+1CJeDX7QoRNmVR4DQstZEOs3uQ3IIcm46chs7g7H/GIvUsspdRxJRNC3yWkn3syh4y3oJsrvDspJstod5Oxp6K40AYX5IjDRWzpRE3K3q4iXIgY5ENrPISVcd8WhgIwSIekL0k7Hyg7RRH1veXc5LkEMlEanCImFeYkFrWWUJNUscLItwXcBne1XxEsQzoL0kfaXqaKLyuSLAp7fV1+MOGdE7R+PkJciJku4+uhWJsC2WC0VD1VF0BRAgWDUxmS3SJGaWlyA4SHFkO1Y+J+n6YwtHucUhcAVJ/2kcNV6shASqKl6C/NTYq7dIIhtqSCCwGQL/JemyBnjIRIXjVVXxEGQXSRcae/VsSUcadaL4shD4mKQDDENuctTrIchukv7bMBCKYhbPxj4kENgMAdJlkDZjrHDgw8FPVfEQZA9JhGGxSJMNlaVDUbY7BKwHP4QAImBIVfEQ5BqO82dCApH7IyQQ2AyBfzSaj/xE0q/UhtNDEI/tzAMlkRYhJBDYDAGsvA83wsPn/veMOqbiHoLgT36WqZVt2aY8SVSMzUTxGSNwvCPSzdUl4U9STTwE4aSBEweLkPua8EAhgcBmCDxH0hFGePaVRA6RauIhyC0knWzsUTMHF2O/ong/CJDVFic8i5AN2XoDb6lfHoLcTNJHTa1sC+wQcbCMoC2suMe+77clfaomTh6CkJ73k8ZOcYvObXpIILAZAsdKwiXCItUtej0EIQw9tlUWiUDVFrSWWZZrgIcYh97lKdZvSjrHOJBJQtcb+xjFp0Xg1ZLub+hCEwtxzwpyVUlEZ7cIjvkvtChE2cUh8GajQeu3jDERXIB6CEIq3wuMrT1O0tFGnSi+LASstli4XPC5X1U8BCGi+/eNvXqypKcadaL4shCwWvNykkrwwqriIcjO2uYhaBHMCAgaFxIIbIaA1R8EywwsNKqKhyB06HxJlzf07MOSuGAMCQQ2QsDjUXiMJKzEq4qXILzwluUN83iSN4YEAhsh4PFJb7Kv9RLkJY5Ppupn1vHuzRYBT1STJndrXoJgVIZxmUVuLOkMi0KUXQwCHjMTPtn5kqkqXoJgnUuec4twCYRTTEggsB4Ba2RF9Lmw/nJtKL0EuZaks42daxaR29ivKD49AviX72nsBsFDfmjUMRf3EoSGOOrlyHesNAnTMrYzUa4bBCCGNeIm0eD3aTGCHIKQrdYaDO6SjpBBLXCINqZDwBPnGbutB7Tocg5BPD7E5Lgm13VIIDAg4LHifbSkF7SAMIcgJDCxbroxN8HsJCQQGBAgVzo50y2C095pFgVv2RyCkHjR6jAf+xDvTK2mnieEFHaAxMPqPoknU0b4x/2Mc4e5/DeNOlF8NRHgsu81xqE1/ZHNWUEY1/Mc9jARI8v4RqxwcdLyPcg4vuc6op8Ym/hF8VyCYE1JGl+LNLHCtHQoyk6CwKWSZ+qVjK03DQCSSxDPPuQiSURnrJ4+ywh8FG+LAIE88CK0yOclXc+ikFs2lyC0f6qkmxo70uyYztivKN4OARLgELPZItj/Pd6ikFu2BEFIbfB0Y0feL+k2Rp0ovjoI7JQ+rwjbY5FbOoIWWurfrmwJgrDkecI/Vg/6lYVMKNdEwGPsSoA43pmmUoIgdPjtku5k7HkYLxoBW6Hi1ggmDH2SS+ZSBCHglzX/B3ch+0s6d4UmPoayNQLEaX7f1sW2K0HQ9E849LJUShHkipIIw2LN+BOrSNb0zVLZmiiHQZ5kTM9WDJhSBKFDJILHddIisYpY0Jp/WU/gc0b9x5JePMXwSxLkbs4A1U+RxEoSsvoIeCzAiaDDQRB/m0tJgtB5or4T/d0isYpY0Jpv2QOdFrisHKwgk0hpgjzcGYM3VpFJpr9po6+TdB9Hi6SGZg8yiZQmyK+mVcRqDnChJLIFWfOOTAJaNGpG4B6S3mTW2nZqxenVZFKaIAyEaHdY+VrlDc5fGGs7Ub49AqekH0Bry4SrZd8ymdQgyGVSWizCslglTOGtiPVfntQXxzm62SQ49Vb9qkEQ2nyCJIKBWYXMVXxqfceqGOW7RID7MYxZPT+WhzicqYqDUIsgBCPGdgZzeKs8KxHMqhfl+0PAY7HLKLoxZq1FEAZ5lCROpzyCpS8ghcwXAe+nFSO+l3NTXxytmgThRIvYqcTktcrHkzm8NVGPtZ0oXwcBzNLJGMU7YJV3SMLatwupSRAG6D3eQ5echvwKhcwLAfLGQA6vaXpXXw+1CcLUeswLhlcCh/5Xzuv9WHxvPYEYBtCaBmQYM1MtCHLt9Km1x5gOrSvzjfSpRSzWkP4ReKKkZzi7yQkmKQ1IxdaNtCAIg32MpOc7R31i+lRzqodaIwS4wzoho60ujnXX978VQWiXmLxeP/S4Zc948xqo4gRFvphdnW0RPA6CdCctCULkk/dI+jUnCkESJ3CV1fZO5CBnjEf4pOJymJA+3UlLgjD4h2Y6vgRJ+nqF+LFj5Tg4o1uTOUON6XNrgtAnwtY/ckznNinzIkmPyNAP1XIIeJK5rm39+Mx3odxINqlpCoJcIp2T3ypjdE+T9KQM/VDNR8AbfGFomcANXAhWT6OWM9QpCEJ/8TpkP8KlkleOTadjXv3Qy0PgrZLu6qziq5LuOQf/n6kIAq65x4LUQaCIBzsnKdTyEMDiendnFV0e6W40likJQn88+bHXj4ONOxu9ri6YnC/OXNTICEVmKI/MKtTT1AQBYM7ASaSSI/gcPEzSZ3IqCd3RCJAE6eujS29f8HGSjs7Qb6baA0EYLFa/B2WO+jxJf+bIm5jZ7GLVz3E6Qg2A8YOGv0jX0gtBAImN29ULoMVnGxHnQ+oigGHhYzObIJUzKZ27lZ4IgnvmtwohxeUVq8nZheqLajZGwBuMYajtRylQx1t6BbgngoDR9SV9thBYX0kkwdgxpA4CZAojqc1dMqrnNIx4WZ6A1hnNjlPtjSD0+uaSPjKu+6NKvVQSfu58M4eUR4AfNdIZ4NbgFdKJQ5LTvRXU0uuRIIx1L0n/VnDQfLpBEq/JfcGurGRVhBWFJFfOGB3ZASCJJxlTRrM7Vu2VIPT6KimWa4mN+4DCBxJRJgtlWW0mp6/4tokkl87oyhmSyJzcTYLXngkCzpeTxEVgjt3WRvOFGzDOPRwvh5RDwJO5dn3rH0okuaBct/w19U4QRkY+bS4TSa9QWvgsgChvK11xp/VhKHoDSXzzlzoxXD/UEiZEpPQj9M/khoxzIAgTsHMK/gD4NeSDiSg5LqM1+lWizqtJum9yWybSCCRBsDrgRfyLEo2sqwN3BEzZc+S1ku6XU0EJ3bkQZBgrfiRcBLKq1BACB7xR0ut79XAzDJo9AZteHuIlbyYXSbpRhfEeKemZhv5uVJQTSPJfTiZzIwhAcWICSQhOVlPY+wxPzXZK1s1l60AK3FjHCj8MHNeWFvx2cleoY1LGgNJ9G1XfHAnCwPjkgiRHjBplXqFhVeGEhXP6LjaPa4a0j6TfXfN4TdBrWdnit/OovCnQZA5ycyXIgDe/lhCFe5NWQpIfHk7AeLAhay23S1lf+Vvql/8sSZix15Cc4IFDf4i5lfvJZh7b3AnCgK+RjBMJCDGFfFvSl5LdF3/XPmTO8gjhc0gZsPYhasjw3546x+hwwlXK1Gd9e+zruOPIEULREpK2mawCQQawOIPHinf/Zuht3dD3kiMXzlw8kGn49y6SLrvJ4w2NtHWPdlyCS1mOgGsIp2cYJd4hs/JDMwPUmZpfJYIwcH55IQnPTiYkojC319esDAMXv5Akx/fnp2kl8uQ8NA9v1QgyAIDBIyS5oxmR5Srg4YenX23ZM5Fkv4yGSIvBRWJ1k6FVJciAPUkgWZIhTMiOEWj5LuwrCTcET2q2YRTnJpLgbl1NWoJSbRAjKmZzCFFiRdkeLC4KOSYmaWZLIRQtn1vc3XgFhzhWkmqxCJZCkGECOBaFKJObMHjfiMJ6xLbCN5xf4ymE+YAk3qDX9PnMZEaDg1xxWRpBBgBvkqKJYwCJrdKShPsOXko+cfj31EIAOcx7cgQHO7KZnZ9TyUa6SyXIgAU2XZBkeDw59UrPSY36uP2HEBDjnTUayKyTVf3lmXWQ9g2SeO+eNmx+6QRZCwqnKwNRSvufZM69S529BX7ew2rRm4nM+kHlZMUd6ioe/T8IsvG7d0BKB8Z5PQ/n93MQLvnIEnuyJByPiBU2J8lJ4TaMk5Xo8FKDDoKMQxLLYR7yYEAYjCV7EYwoCXPEnUB3QQ8cIJHjEKLkyHEFDCR/1n4QxDcNkIXMSoS94S8Pn2g1BQ9AjjXX2n2dNuEJVM2x8oLnpgCHaLmm9kGQgrOMbdVAFv7ulh7Mz/n3+r+4k35XEvZam/0dDB8hBmWWJHwqsXnPEawpsPZ2S6wgbuhCsQECHP9yDJwj+KKwIrkkCOKCLZQaIYAFMPsrLhRz5DBJr/BUEATxoBY6LRHgBBGSYJqSI3eXhOWASYIgJrii8EQIcABCaCaMHL3ysXR0z/3QaAmCjIYqCk6MAOSAJDmnhWa/+yDIxLMezZsQ4DMLkniTv5I49vaWFoMgFrSibA8IsGGHJB67OY7UOXIfLUGQ0VBFwY4Q8FoAsw8hrtpoCYKMhioKdoaAxwI49iCdTWJ0py4CVgtg/OBN3oexgtSdwKi9PgJjLYAJfP4qa3eCIFbEonyPCPC5ddQOjoBJn3GIp+NBEA9qodMjAtyPYHfFJpzjYCydPy3pXSnNg6vPQRAXbKG0FASCIEuZ6RinC4EgiAu2UFoKAkGQpcx0jNOFQBDEBVsoLQWBIMhSZjrG6UIgCOKCLZSWgkAQZCkzHeN0IRAEccEWSktBIAiylJmOcboQCIK4YAulpSAQBFnKTMc4XQj8P7beUvaPcZZwAAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/438716/fast%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/438716/fast%20search.meta.js
// ==/UserScript==
class InitSearch {
  constructor() {
    this.initStatic();
    this.initStyle();
    this.mouseupListener();
  }

  initStatic() {
    this.href =
      "https://at.alicdn.com/t/font_3148281_vf5cr0hy39.css?spm=a313x.7781069.1998910419.83&file=font_3148281_vf5cr0hy39.css";

    this.style = `
      *::selection {
        background: #CCCCCC;
        color: #3399CC;
      }

      .search--btn__wrap {
        height: 30px;
        border-radius: 5px;
        background: #fff;
        position: absolute;
        cursor: pointer;
        box-shadow: 0px 0px 5px 2px #9e9e9e;
        overflow: hidden;
        display: flex;
        z-index: 9999;
      }

      .search--btn__wrap .search--btn {
        cursor: pointer;
        width: 30px;
        height: 30px;
        font-size: 20px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }

      .search--btn__wrap .search--btn:hover {
        background-color: #9e9e9e;
      }

      .iconfont::before {
        z-index: 1;
      }

      .iconfont::after {
        content: attr(after);
        // position: absolute;
        // top: 0;
        // right: 0;
        // bottom: 0;
        // left: 0;
        // display: flex;
        // align-items: center;
        // justify-content: center;
        font-size: 12px;
      }
    `;
  }

  initStyle() {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = this.href;
    document.head.appendChild(stylesheet);
    const style = document.createElement("style");
    const styleText = document.createTextNode(this.style);
    style.appendChild(styleText);
    document.head.appendChild(style);
  }

  mouseupListener() {
    document.body.addEventListener(
      "mouseup",
      (e) => {
        setTimeout(() => {
          const selection = document.getSelection();
          const selectStr = selection.toString();

          const delBtn = document.getElementById("btn");
          delBtn && document.body.removeChild(delBtn);

          if (selectStr === "") {
            return false;
          }

          const { anchorOffset, focusOffset, isCollapsed } = selection;

          if (isCollapsed) {
            return false;
          }

          const position = this.getPosition(e, anchorOffset, focusOffset);
          const btnWrap = this.createBtnWrap(position, selectStr);
          document.body.appendChild(btnWrap);
        }, 100);
      },
      false
    );
  }

  getPosition(e, anchorOffset, focusOffset) {
    let left = e.clientX + 10;
    let top = e.pageY;
    if (anchorOffset > focusOffset) {
      left -= 200;
      top -= 45;
    }
    return { left: `${left}px`, top: `${top}px` };
  }

  createBtnWrap({ left, top }, selectStr) {
    const btn = document.createElement("div");
    btn.classList.add("search--btn__wrap");
    btn.style.left = left;
    btn.style.top = top;
    btn.setAttribute("id", "btn");
    btn.setAttribute("data-text", selectStr);
    this.createBtnList(btn);
    return btn;
  }

  createBtnList(btn) {
    const btnList = [
      {
        url: "https://www.google.com/search?q=",
        title: "google搜索",
        after: "谷歌",
        icon: "icon-google",
      },
      {
        url: "https://cn.bing.com/search?q=",
        title: "必应搜索",
        after: "必应",
        icon: "icon-Bing",
      },
      {
        url: "https://www.baidu.com/s?wd=",
        title: "百度一下",
        after: "百度",
        icon: "icon-baidu",
      },
      {
        url: "https://www.so.com/s?q=",
        title: "360搜索",
        after: "360",
        icon: "icon-icon-test",
      },
      {
        url: "https://www.sogou.com/web?query=",
        title: "搜狗搜索",
        after: "搜狗",
        icon: "icon-sougoushuru",
      },
      {
        url: "https://www.zhihu.com/search?q=",
        title: "知乎搜索",
        after: "知乎",
        icon: "icon-shejiaotubiao-10",
      },
      {
        url: false,
        title: "点击复制",
        after: "复制",
        icon: "icon-fuzhi",
      },
    ];
    btnList.forEach((btnItem) => this.createBtnItem(btn, btnItem));
  }

  createBtnItem(btn, { url, title, icon, after }) {
    const search = document.createElement("div");
    search.classList.add("search--btn", "iconfont", icon);
    search.setAttribute("title", title);
    search.addEventListener("mouseup", (e) => {
      const text = btn.getAttribute("data-text");
      switch (url) {
        case false:
          this.copyText(text);
          break;
        default:
          window.open(`${url}${text}`);
          break;
      }
      e.stopPropagation();
      document.body.removeChild(btn);
    });
    btn.appendChild(search);
    setTimeout(() => {
      const content = window
        .getComputedStyle(search, "before")
        .getPropertyValue("content");
      if (content === "none") {
        search.setAttribute("after", after);
      }
    }, 100);
  }

  copyText(text) {
    const input = document.createElement("input");
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
  }
}

new InitSearch();
