// ==UserScript==
// @name         yuque-html-exporter
// @namespace    https://github.com/zenonux
// @version      1.5
// @description  export yuque document to html.
// @author       换个头像心好累
// @license      GPL-3.0 License
// @match        *://*.yuque.com/*
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE72lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDMgMTE2LmRkYzdiYzQsIDIwMjEvMDgvMTctMTM6MTg6MzcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMS4yIChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjMtMDgtMDRUMTU6Mjk6NTQrMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIzLTA4LTA0VDE1OjMxOjM5KzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIzLTA4LTA0VDE1OjMxOjM5KzA4OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxZmNjMTNiZC1iNjg0LTU5NDMtOTE2Zi00NmEyOTc2MWFiMzkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MWZjYzEzYmQtYjY4NC01OTQzLTkxNmYtNDZhMjk3NjFhYjM5IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6MWZjYzEzYmQtYjY4NC01OTQzLTkxNmYtNDZhMjk3NjFhYjM5Ij4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoxZmNjMTNiZC1iNjg0LTU5NDMtOTE2Zi00NmEyOTc2MWFiMzkiIHN0RXZ0OndoZW49IjIwMjMtMDgtMDRUMTU6Mjk6NTQrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4yIChXaW5kb3dzKSIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6nIOQ9AAAVN0lEQVR4nL2bebAn11XfP+fc7t/y1nmzSRrNotHisT2SbFlIkVJYEiQhREq54q0CjisVG0zKAYFkSBFi/rALOwG7QClkShQGO6FiygUGnKpYuKBMIhVVKAEsx7aMpNFoNJrRSJqZN8tbfr9fL/ee/NH7772RZyTZ91W/7tv3/rrvOed71u6Wd3zzl9isqTiWk1Ocz85hZvSc0HdKHCl4IdOUhXhAT4UgOUmao3gGgxjNI8Q8uBwJcp2Y3RzhblSRa/OQ7VPYpsKMQE8AFVKFEcJyT+Ojgj0TxH/Tifxdz9khj0Nx9J0nDxngiPoRLo+IvbFuYwI9XARITp4ZPgMB+ovGzDawsCmZRJuffnVNpNhCCHdY8O8Sbz8MdoMCOSliEIkSFMxABRQIBiaggWsmIblVBZwoiJEG+Rbq/xKRP5GIR0WK375e7TUxwAAVKSiBbeblJ5JR/q8JHARDEVRK4kRBIAiIFYyiJETKcwgIigGBgtBgdoMGuyFI9nMj4wkR+f2e4/dUZVnaF3mVTV/1LwVidYRgW5Ik+0SehcPe82t5zsEAmAgmxfKMQsrVZjVxBaHtsUDzm3oTwYAk52Ca82vj1B+eTLJPmNmWSN33nwEiggYl8cnPrKxPDo8m+UeBxVBKOFhDoKdLeDDw08RXTGoxpj2nOkaK+weTxck4/+jqeHJ4FJKfEZQCDd8HBqgIJuFAyOyR1VHyYIbfKqI1MTZFWFuytXQ3mzM915rr2TSTAFElN7/1fJI8mOb2iBAOiF46Ey6JASqQ5f4D4zT9jsffIeIwZCPxtKRJV7JtAs022VdjXIA51kaEgCi5hTuSNP2O9/4DcokivejpKkKah99YT/PPeUMNLRcnGxbc1u9pXW+rxAVR0N63N2vZhRY6QAiIppPsc1kSfuNStOGivIAg5D78UcDeU9ndYCBiqBV6b1ZwszLMcoFz1XwtiRKasc6ccswo5iqt+5TGVdv3kUIYWcr9ztkeEXnvxTiIV0SAlH9gX/HGe0AwpHJPmElHV6cl2DFsbC7lztgFvMErocNaxrXwGOAD7wlmX7kYJESOzd2IK8Hhzf+xGHeraB2BBKkkZ4gIYlb48LYkaybSjFVcLz1FZ6wcrOMBa36/KYJKJlRz29fUAhV3E+yPEd7tIsO8YJtAIkpksuGkGfQ0YuInDwTv3xVp3CLHwAofHzDEDBUhmHUCmirCazOkgGnTfyXVqH/PlLq09y3419dp3Tf39q58og+kibs/zz2UeO4w4Ex+tks8EEWObDL5V+vp+D6nPcAK4Ut1CSv5UHK1JF5rg1RMbtuImghrUEBL15FNpC9dojvXmJJ8ZSvq3xloJCTrdl/2ov6tG0RfwG9MCOTAo+9tST6grsfsYGZ3Olk/Fiygqi2ulVCvWVUsJBLHyI95KT2FYGg5p5K6UqBEBRyCE8GJEpVbrI5IHLE6+hLR0xgnWlicknnT16wQpO1z0jCqOocV61mcnd3jc3c88YF2uCA/8uJ/rmmL4j6TyTlefPY7Xxf0psi5QsKbEN3sjDU/5tqZ3fzQ0i2cypYxjJ5EqEg9JxAIeHzIyS0ns4zUUtKQkISExCZMwoSRX+N8vkISJsxHM+yIt9LTmMLGt4huEb/h3NTeQkBEH792x+Btsz0h9Q0DogNhV03ags7xZDL+0LN5etNcb7aEp5SILxSrcltgmFSeAk4kp7h9y1u4Y+ltG2C2WTMzMsvJLCe1lCSkjP2E1XyVE+mLHB4d4VtrT/D42v9j7EfsGexiqH2C+a660NiPjgqVewNUlXE+ucn5bR/a7S7/7Lof11ZX3n74XgxwcYQf5/0zx148Ty/qq2gt8cadtNHQ9GNxnM7OciI5xX+7/lf48ct/lNPZecyshi0VM2soC4oWqqGKw+GkUIWqefN8ffWb/M/Tf8ZXTn8VJ8Ke/i6MQoSVKtT7cq2bqQbBCKbJFdu3LLooTnxpD9y1P/+DRC4iUmV1ZeUTk3F+l4tcuegG66/UDxhzboZIlD946WHuWLqZN83uZyVfq5OUwqc3fwHDE8jNk4ec1DKSkDAOE8ZhwiiMCWZcPdzHDy29nbfM3cC31v6ep0fPsBQvddbS2bcP2+dE8OajyFm0tS9fi8jpiUdu/pufBhFU3cz6yukVk+C0gkfHZ1gXCdPIoEiPj4xfYN/gCr52y+8w0B4r+Xq9lsYJWXd11fi0jyqZFuHYEi8yCQn3P/0fePTcX3Fg5hpKp3pBJEyjwAxiMb9tThdyY2QGmro+eTzD+uj8h4PPnKirl1tFWdUSm35r3Jp+FjxXDa7k8bWn+O1jf1TqbKi8JqGWP/X/6opVfD/dBMETOJWeZqB9HnrjA/zDxds5NDqC4DpR4HSEWGeQ1sQGk1zcmTR8OB7muH6G7r9ijr07h0Qu+tlgCqG9LCmCnk6/y5RG/kXfW+CK3k6+fPJ/83J6hoVotiDcjFBupQ2dJp+AFVneJoxQcZxMTwPw69f9J/YM9nAiOQlVBck2JmJ15tgaDxgu6M/OxYvMDbaip08c56Wjz96WjEd7XVxGfDaFxc6CGqZs1jdgR7yFp9ef56/OfoNZN6TSfsqjYFYzpZvVFa2S4HRz4jiVLrMQzfELe3+OVT8iD35DwaVdRJnOJiMnrCW29/Cy3Xb8nBCtjXpk3n4MCVTAlJIJJpXc266wNX6BvqIkIePJtSNwWZsYqybXzKp9jVQxZjMmJkV015KHirLq1/nhrW/n9sVb+cOX/5R9g91lcAVDHbCjtxUnjkBoIk+abBIMyUc/Fql7LCL2EMLdYlJL3sRqojp9iitY2wts0g9ihbSyczUxhrVobygKYkUsYa1UpRNASceVAkz8hBkd8u92f4i9gz0MtEdmGdvjJc5l53ls5f8wCQk9jevcoA6dC/Lxgbu92X2Rz7J9ZnZd5xal9NtGvktkSZC0mACdPlbYgyJVaIxfZe1rlbHGQ0jJjOp6dbZUMq3yEirKcnaGt8wf5Kb56+tlPzt+jt878ftMQoqWRjrQyhRbnjM3u85S2xelWX5bJK5lmdsqUMKlIlqg0XZppFrJyxqmBDPm3WwhZQtd/lrTFQpmG0VEVzBW6onFOPV4NeTEsZyeYS6aZagDfvv4f+W3jn8WFdjbvxLXylDLILYTPRIEr/42nYtn35qGvJZ8x8AZXS9gYJ1+4xor1lktLWHv4PLyMo2lM2s8QhUQWYmS0HaR1j4urlJ5iWp9Pe0x1AG/fvQhPvbsp9kab2Vvf29pBG1DoaV2mQaZ5fQZvjWSINe14VkxoqsCFfs260tlser+xKcsRQscnL2aUT7BLHSw0taUxjA0LrXQVaFTwrAimrMSisEC2/rz/I9Tf86njj7EG2fewFB7ZOYLYyolYlrHtO6dh4Cg1+lKPt4bS1xKui39tv+/+L6Kcmxyktu33MgtCwc5mZwrJdBIvA6IjAYVpXs0CzUa2kXQGknlfiGaYzk9ywNHf5cd8XZ62ic36xZjaX4/XVJzxKz79b2qItvaEK+0vII4U0zZ2G8WKCaMfEJfY35y179ARUktL4mxFgxbKlAHRlbbu86cFoNqg2rGwPX58qm/4Dvrh9nZ20lu4aJqj2ZlZVogeNmmGMMWMGu9n+5bp9+VfGULVByH11/g/Vf8M35k2y0cGZ2AtvQtEELDjIrIapxa9xuZTxc/jcIAegv89fnHGegQXwZUnWJsa7/hKVRzbhgBvep+JtLI116pv9ErOHEcn5ziwOw+fn7v+zidnsebR9Faf6HlBq06LmOHaqyl++37ByovIAy1z0vJaY6MTzAfLeBbJbnK5bVdX2VmNtQnjZ4aU1aerhewKa+w2TgIIz9hNR/z8Wt+kj2DyziRnK5JKfS96wFCqeu19a8QQXG+RkOtAk0y1dOYc/kKK/mISKKOzvv23rrwb6PBlzRHGGmTh5a4kUrOjWWfjuSmvcTh8Qk+svdf8s4dd/HU+vN1Ftf299VeStvha0stdUSIFdFh7fNLj2PluoJBbgEnDkFL+EtZEbJNS+60vEBV0i/L6qmCjBu9LnW9pee1cbyA1XfiODQ6xj9eupX/uP/fcGxyijTkhAAhGN6qLZQeoPirfH2wUNuGStKFxAqkUKKnWY0x8hMu6+1ge28bK/monruZzlfnPFMGsdjG6s2WrQWAYic1ka/kBSIinhu/zL7hFfzmgfvIQ87p5CzeB1Kfk+Q5We7xIRTwLg1gwYyWQ+y4wcZFWk08naxxHBKW4jlunj/IcrYCuI1PlaZgX/ercwGCsqzzbub5zPuule8woVKBbl/F8XJ6lp5EfOYNH2HRzfH02nEUJdaIoesxcHGRlYXAJE+Y+IQ8hFrffWMhuhFih4h2CaVyhwUT//mOu9gaLbHuJ/VD2g3vGtBlRLUlljHUmecjxA41/ry0urWhn+4X+uNQVvIRZ7JVfusN93Pb4ps5kZ3m6oVdDFyPSF3xHgEQQiALOROfsp5PWM9HJD6l5+LiDROK2L94+qAlgVpkbVIlXpU9sHKpwsnkLP9g8SD/dPsP8sWX/ow3zu4rPUXjUSob0D6unk6JKHkIh3TVT74Ra9TovU3ZgcoLlHZAUMYh5fjaCT6+/4P82/33QA/2L+xi22CRQdRDRWtmReqYjYfsGC6xb+5yrprbxc7BEsECozxpYoFaukypQ9selGKlKKkDvO+yuxnqgCTkJaoqNWg9uG3Zg8pLCBETS7+hEvSxKshot5aNr1VAEPLgObLyHL9wzfv56JveBw6cKolPSXxaVmhCDWdvBQISn5KGjGHU58rZnVw9v5uFeIaxTwubYNTGsUmfW1Wjlj0oViScTM5x59a3cdfSLZyYnMZqoqVhBtJ9v6C2E4YP4TGNXf+oijtkbR/fsgNVX8rxZ1aP8BNXvZtPX/9TGHA2HeHDBV7C26RV6jB0ffbP72Z7fwsTnxFClQM0TGik3vJIFQiASUhwovyTbbczCUktqAIx0rb23fJYMEzcIYv6R9U7JYeHrc4z25BvpO/E8fT5w9xzxV387lvvB+Bsuo5KGykX35KQkoec3bOXsa23wMQnVEW5OumxJozuosCoLFTmPbcuHmT34HLGPin5VdqfskxXSd6X6h2C4YWH6Tl0fjBhvue/SFv3p6x+LBF/v/ocN2+9gS/f8rGaeHepL+S0miDkpXpcObuTmWhIkqctyz/NjiYfqI4BzuarXDvYw4GZqziXr3VimIA1VWEEs6LvMWbFvjiXe3T3rj3s3b//sf5weDTLqsJItRNijXhq7Th7hpfz1ds+SaTK2XRUvPj4GltRmspRUS4bbsWwMrKbdnyteKBjC4w0pMzFQ64e7mbdj6kTu5Yggwmeor6Y5SnRYPbo4q4Djw137EefPLHG4ZfXSfPswcIJaX2BWBxHR6cYao+/uP1X2d5f4Gw2etWw35wJQuJT5uIZ5qNZUp/V0qtE2TCkIrtiRXNu92AnFhpk1Eyo7EcLFSGLHjy1nHPi1AR15hGfMbtl60Pa63nzHqNIbV9OzjPKx3zltl/hwPyVnM/GtN8WeD2bijIXz5ZENCjoEmybPi8A2B4vEWs8NacbvOXeUIl9b371IW/fBnkK3RItsSVaYpHF0UBmPp2VKexqPubs+DR/8AO/xJ3br2cln2xwla9n8xYYRj0icWVeUAmwsGDWEne7mlSdXIhmiSUuSuC0a5VVwRZy7+ktzHx6uHXbaLC0k8HWnaiN1gjrqzBeY74//JgLmkzylJdWj/OpG3+aH999B+t5SrDwPZJ90YIFYo2INaoLHBbaKKhwQH2m/m8wkD4RrnGdtR0ojkMwIgvJcLj4sSxbIEvnydN5ohvf2NTVF/pzybdfeOber379S79z7w0f4N9f906SkJOG/HXV+82aYThRnCohD1A++KQKKcs5UklX6AhEpIhSgbrY2jxjMEb5iJv23nbvgaU3JWvJav2GZPSXp79dX8TFMYfPPffZd1x1z4d/8y0/dVMwGOXp95x4OoRKJ+Krx6jGrXk4QHM+CVlZEa6MuNVvsAQfGESDx8/E2We/nj2PD0n90+jBuXfWnRAC2ZWeu/fe/o4Ax85lr83Xv5pmU5bGarkLnVrlFA/OZitMfFoXXiomeDOcU+L+/DteeO5pQkiRFk3Rj+69dbN1HF/16fsF/vvrRdh3a0XiV+QOVUWqzQozq78baL/tV6Hl+OQUWchpVS2LmWZEA/f+4NLj/RmHMOzcN/IXsO1zrveFdfiBzOf3fT9UQChesMiCp1WKbY2XzbonnCg+BA6NjhFrj7pgi5GHnIX+3H/Z2d/xhcRn1O97tlp0IdIEiNXd783vxXjXa6TvuzYnynqYkIWcXvkVyDQK6oXRDCxEsxwdv8QTq0fYEs8X1WYpcghR/ZNe1L9/wAyx+OkrAa/wsnTlgwV5N/DwayHuYpqKMs6LdFpEaWl7sZYNkipS34XeLH9z/kmeXH+eBTdbnwd5WEXfbWbklpFf4O+iLJyI3IPIl76XgVDhqiYbYg2hqSdPtyof+fPT/7ewHRQ2QUW/JCL3bIKfjde42MWp6Hud6gMXM/9SW6SOiU9Zy8bEbrNPGLrFGaQInHYPtvO3Z5/i4VN/zZW9nfhgRC5+wKl777Q3uVC7BB9nOHEfceo+CISLvcF3v6oRa8T5ZMQ4T4nEtR1Z3aZRoKKoUz5//GFenpxj6AZhZtD/YD+OP7IhjniFdklOvkTC52Pn3qwij74eLHDiyEPOcrKC0+KhOFK8X1BEd9OPViA3z1Wzl/O/Tj3O544/zP6ZXY/2etGbe5H7PHZpornkKKd4/VWeijS6M1K9FzjTLlpc0rUw+i5mebLKSrrOwMX1s7zmOVIZ+LXiny1ujnPJGh9/+vNn5mcW7p2fnbvTsKfsEomHV/ndYHUTFflMpO6aWKNPCpy/VEbEGpH6jBdHy8TqigepVNJvw777ocPO/sL5X33uDz/52Prha67fcvVncvzG8Pki22uKc8v63LlY3C9H6q4R0V9UkSc29d+btJ5GvLC+zChPGLhe/aJz85S4fJxrRd+pPtFz8S8GZ9ccS0/+8kw0PJf59OJudoH2unw8XXJ/WVU/5YxPBbjTCO804x8ZVqabVUxfzB9GfZYnK7w8OstM1C8SrvrhS/GnCCL6bafyNXXuT/sSP1J9ujTvZoo3wV7j2l/Xr8erPNQJjwTRR8qixXUBuxn0RsGuBdsXabRtnCczz6+d7EUqxBqlCCMnsuxEj6rIM4J8UzX6u0j0kKghKsUn8K8S6hdq/x/jkkKcSKSyLAAAAABJRU5ErkJggg==
// @require    https://cdn.bootcdn.net/ajax/libs/marked/4.3.0/lib/marked.umd.min.js
// @grant      none
// @downloadURL https://update.greasyfork.org/scripts/472400/yuque-html-exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/472400/yuque-html-exporter.meta.js
// ==/UserScript==

(function () {
  "use strict";

  init();

  function init() {
    const previewPanel = _createPreviewPanel();
    const btn = _createExportButton();
    btn.addEventListener("click", () => {
      const mdDownloadUrl = _getMarkdownFileUrl();
      _parseMarkdownToHtml(mdDownloadUrl).then((docHtml) => {
        _preview(previewPanel, docHtml);
        _copyToClipboard(docHtml).then(() => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(docHtml, "text/html");
          let yuqueLinksCount = _isHasYuqueLink(doc);
          let tableCount = _isHasTableElement(doc);
          let isHasAsterisk = _isHasAsterisk(doc);
          if (yuqueLinksCount || tableCount || isHasAsterisk) {
            _showToast({
              title: "已导出至剪切板",
              message: `检测到
              ${isHasAsterisk ? "加粗异常，" : ""}
              ${yuqueLinksCount ? yuqueLinksCount + "个语雀内链，" : ""}
              ${tableCount ? tableCount + "个表格，" : ""}请手动处理。`,
            });
          } else {
            _showToast({
              title: "已导出至剪切板",
            });
          }
        });
      });
    });
    _toggleElementVisible([btn, previewPanel]);
    _onRouterChange(() => {
      previewPanel.style.border = "none";
      previewPanel.innerHTML = "";
      _toggleElementVisible([btn, previewPanel]);
    });
  }

  function _onRouterChange(handler) {
    history.pushState = _bindEventListener("pushState");
    history.replaceState = _bindEventListener("replaceState");
    window.addEventListener("replaceState", handler);
    window.addEventListener("pushState", handler);
  }

  function _preview(panel, str) {
    panel.style.border = "solid 1px #00b96b";
    panel.innerHTML = str;
  }

  function _parseMarkdownToHtml(url) {
    return window
      .fetch(url)
      .then((res) => res.text())
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(
          window.marked.parse(_parseMarkdownStrong(html)),
          "text/html"
        );
        const docHtml = _addTableWrapDiv(doc);
        return docHtml;
      });
  }

  function _createPreviewPanel() {
    let rightPanel = document.createElement("div");
    rightPanel.style =
      "position:fixed;top:62px;bottom:10px;right:100px;z-index:100;width:600px;overflow-y:scroll;padding:10px;";
    document.body.append(rightPanel);
    return rightPanel;
  }

  function _getMarkdownFileUrl() {
    return (
      window.location.href +
      "/markdown?attachment=true&latexcode=false&anchor=true&linebreak=true"
    );
  }

  function _createExportButton() {
    let btn = document.createElement("button");
    btn.innerText = "导出html";
    btn.style =
      "position:fixed;top:5px;left:50%;transform:translate(-50%,0);z-index:10000;background:#00b96b;padding:10px 14px;border:none;color:#fff;cursor:pointer;";
    document.body.appendChild(btn);
    return btn;
  }

  function _parseMarkdownStrong(md) {
    // 去除语雀md为"默认加粗如 **"** -> "
    // 为加粗左界符尾部去除空格，右界符去除头部空格，添加尾部空格，避免加粗不生效
    return md
      .replace(/\*\*\s?"\s?\*\*/g, '"')
      .replace(/\*\*[^\*]*\*\*/g, (match) => {
        let text = match.replace(/\*\*/g, "");
        return "**" + text.trim() + "** ";
      });
  }

  function _isHasAsterisk(doc) {
    return /\*\*/g.test(doc.body.innerHTML);
  }

  function _isHasYuqueLink(doc) {
    let aList = doc.querySelectorAll("a");
    let yuqueLinks = aList
      ? Array.from(aList).filter((v) => v.href.includes("yuque.com"))
      : [];
    return yuqueLinks.length;
  }

  function _isHasTableElement(doc) {
    let tableList = doc.querySelectorAll("table");
    return tableList?.length || 0;
  }

  function _addTableWrapDiv(doc) {
    doc.querySelectorAll("table").forEach((child) => {
      const parent = document.createElement("div");
      parent.style.overflowX = "auto";
      child.parentNode.replaceChild(parent, child);
      parent.appendChild(child);
    });
    return doc.body.innerHTML;
  }

  function _toggleElementVisible(elArr) {
    elArr.forEach((el) => {
      if (el) {
        el.style.display = "none";
      }
      setTimeout(() => {
        let isAtDetailPage = document.querySelector(".ne-doc-major-viewer");
        if (!isAtDetailPage) {
          if (el) {
            el.style.display = "none";
          }
        } else {
          if (el) {
            el.style.display = "block";
          }
        }
      }, 2000);
    });
  }

  function _bindEventListener(type) {
    const historyEvent = history[type];
    return function () {
      const newEvent = historyEvent.apply(this, arguments);
      const e = new Event(type);
      e.arguments = arguments;
      window.dispatchEvent(e);
      return newEvent;
    };
  }

  function _showToast(opts) {
    let { title, message } = opts;
    let template = `
    <div>${title}</div>
  `;
    let templateMsg = `
      <div>${title}</div>
      <div style="color:red;">${message}</div>
    `;
    let toast = document.createElement("div");
    toast.innerHTML = message ? templateMsg : template;
    toast.style =
      "position:fixed;top:16%;left:50%;transform:translate(-50%,-24%);z-index:20000;background:#67C23A;padding:30px 45px;border-radius:4px;color:#fff;text-align:center;";
    document.body.appendChild(toast);
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 2000);
  }

  function _copyToClipboard(text) {
    return navigator.clipboard.writeText(text);
  }
})();
