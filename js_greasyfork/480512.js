// ==UserScript==
// @name         阿里国际站产品详情页数据显示
// @namespace    https://space.bilibili.com/20877017
// @version      0.2
// @license      AGPL-3.0-or-later
// @description  国际站详情页显示产品类目ID和产品ID和三个关键词
// @author       By Laine
// @match        https://www.alibaba.com/product-detail*

// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAF5lJREFUeF7tXQe4VNXVXfehqLGXKCAIoqJixxJQUKTYQUVN1KgRC9bo44GJLSrmt0XevKcYGxGwJxo1gAWlqWDAAvaCgNKk2aKgUnTu/605M7x2y8xtc+89e3/f/YbHnLL3OnfN6XsbEBEEBAFbBAzBRhAQBOwREILI2yEIOCAQG4KYlWiJCrRFFhtKi2mMQAVWIYv5Ri2WxAGFyAliVqITKtAXBnZAFm1zn0BbAOvHARDRITYIrAUwHyYWoCL/mcUYoxYzo9QwdIKYg7EtsjgMwOEw0AcmWkdpoNSVMgQMLIKJsQAmowKvGEOxPEwLQyOIORi98AsuQwWOhInmYRohZWuKgIE1yOJFNMOdxlBMCAOFwAmSH0L9EcDZYSgsZQoCNgiMQhbDgh6CBUYQsxLtUAESg4/MJ+Q9LgcCnLcMyxNlXhAKBEIQswrnA/grgO2CUErKEAR8IrAMwF+MDIb7LAe+CWIOxFAYGORXEckvCASOgIlqowaD/ZTriyDmIIyBiT5+FJC8gkCoCBgYa1Sjr9c6PBPErMIsAB28Viz5BIEIEfjUyGBXL/V5IohZBdNLZZJHECgnAkam9ClFyQQxqzAFQNdyGip1CwIeEZhqZNCtlLwlEcQciFtg4MpSKpC0gkCsEDBxq1GDq4rVqWiCmINwOUzUFluwpBMEYouAgUqjGncUo19RBDErcSYq8FAxBUoaQSARCGRxllGLh910dSVIfod8umwCukEp3ycMgWXIorNRC8cdd3eCVKEaQFXCjBd1BYFiEMgYGedNbkeC5A8esveQs1XFwC1pkobA2nwvYnvHxJkgVRgpp3KT1uaib4kIjDIy6G+Xx5YgufscWYwvsTJJLggkD4EK9La7T2JPkIEYk7sBKCIIpB0BE2ONGuvzWpYEyTtQmC9zj7S/GWJfHgHORdpaOYqwJkhV7jYg5x8igoAuCPQ3MhjV2Fg7gjwC4Pe6ICN2CgIAHjUyOKNYgtAnUQuBTRDQCIGlRgYtXQliVqEzgGkaASOmCgIFBLoYGXDfb500GWKZVbgBwPWCmSCgIQJDjEzu/XcgyCCMgGm/caIhaGKyLggYGGlU4xxnggzERBjooQsmYqcgsA4BE5OMGvR0G2LNBrCzwCYIaIjAHCODXdwIskY2CDV8NcRkIrDWyDR0k9tgkp7fQV8sWAkC2iKQRav6O+oNCSJLvNq+F2L4OgQaLPU27kG6owKTBSxBQFsEsjjcqMXLBfuFINq+CWK4JQJCEHkxBAEHBIQg8noIAkIQeQcEAW8ISA/iDTfJpQkCQhBNGlrM9IaAEMQbbpJLEwSEIJo0tJjpDQEhiDfcJJcmCAhBNGloMdMbAkIQb7hJLk0QEIJo0tBipjcEhCDecJNcmiAgBNGkocVMbwgIQbzhJrk0QUAIoklDi5neEBCCeMNNcmmCgBBEk4YWM70hIATxhpvk0gQBIYgmDS1mekNACOINN8mlCQJCEE0aWsz0hoAQxBtukksTBIQgmjS0mOkNASGIN9xik6tZc2CbnYCt2qvPTVsAG2wCNN9EffJhmtUrgNUr858rgG8XAB8/B3wzLzamxFIRIUgsm6WhUhttqV7+rQtPngz8e4s2/gxY8AbwyQvAnJeBuescCPorM025hSAxa82KZkDbzg2fzVtHo+QXbwNvjATeGAGs+SGaOuNeixCkzC20dfuGZGhzYJkVAvDlp4okJMvK5eXXp5waCEEiRn/z7YHdjgZ2PxrYsSuwybYRK1BCdd99AUy7F5gyDFj1XQkZU5RUCBJBY+7UXRFil15A604RVBhwFctnAa/dBUy9K+CCE1CcECSERmIvsUvP/NMDiGoOEYIpDYr8dALw2JnAiqVh1xSf8oUgAbUFJ9f7ngp0Og3o0FstrUYtXLLlStTid4F3/gW02BPo9Htg/zMA6heE/PQtcE9PgBN6HUQI4rOVt9kZ2O80YL9Tge06+iwsgOwzHlG/8vVl/Y2AvU4EOp0O7H5sAJUAuHln4Ou5wZQV51KEIB5bh70EicEeY70NPRYSUrbpw4EnB1gX/usOiix8dviNdwU4ab+pPfDjN97LSEJOIUgJrbThZnW9BSfecZYpdwL/udxZQ86T9j5J9Swbbl66NR+MBkaeUHq+JOUQghTRWlyKPfhC4KBzgS13KCJDTJJMug147kp3ZWjTfqcrorTcyz19/RSP/wF466HS8iQptRDEobU22gI4+CKgy4XJIgZNWrEMWPQWsOBN4KUhxb+SJEkpc5U5k9SkPa0iBLFo2eYbqx6DxOAkPM7yzefAso+BpR8qQix8C/j6M/8acxOzQBa34dc/jgU+ft5/nXEsQQhSr1WarV/XY2y3e7yai0u4JADJwGfJ+8DSD8LXkcOv3n8BfnOefV3T7gP+fWH4upSjBiFIHvVCj9Fqn3I0Q9M6eR5q3n+Bua+ovY1yH0vvPgjoM9Qam++XAENaxQO3oLXQniA79wCOuA7Y6bCgoS2tvCXvAfNfz5MiBoSw0r7n1cAxN1nbdffh6Twury1BOJw64nqg1zWlvchBpV7wuiIE72PMe638PUQxdnFudvl0tUPfWIQgxSCYkDS7Hql6jXYHR6cwb/BxqDRncjyGTF4tP/IG9cMiBAHMSnRHBSZ7xTJ2+fgLSGIc/qdoVPt8qrqpVyCFmY2m3jBrEYLUoZsqguzRB+h9HdDmgPBen+8X111dJSm+mhNeXeUq2Y4gN7YGeH8kbZL6OQjPSR17C3BoZThNxzkEN8sKPcUva8KpJy6lDhgHcIhaX374Crju13HRMFg9Uk2QbXcDTvo7wJWqIIUXiN5/WnkF+fy1IEuOd1k8wn/jlwDPpNUXYnBX13jr7lW71BJkt6OA3z0AbBbQ+nz2Z3WjjqTgxSEdZc/jgf7/aWr56IHAq7XpRCSVBOGm30n3BNNgPLH6+j8UMUwzmDKTWMp6GwCXvArscFBD7Xnma+je6XXukDqCnFALdHM55u32gvIIBx0VzHwEWPOjW2o9vj9yiFoBbCyv1gCjq9KLQWoIsvHWwMWvAC328NdYad3w8oNKuy6q96hYr2kpNQcAi2b4KT3eeVNBkB0PAS6dGgzQz18DTLw5mLLSUsp5z1pf1Z1+P/DkBWmx0tqOxBOEu7pcmw9K6JTg2q2CKi355XS9FDhxmLUdae89aHWiCWK3aeX3tXziPOD1B/yWkvz8vAvDodVmLZvaokPvkWiChEUOgsIbeC8G2CsllSqnPQgccJa+vUdiCRImOYQgihCHXAL0s/GkOP6vwDiLFa2k/hA46Z24IVbY5CBYw48GPhkXfHMf1B+Y+Rjw8+rgyw6yRO51XDgB2GDTpqXOmwbc3R1I+5GaguWJIkgU5KCHDnrqCEN4hunke4G3HgQm3Bzfl4zkoEsgK0nz/XMrexNDkCjIQWcHI44P96738Rng0IEAL0xNvAXgTn2c5JibgZ5XWWuU9k3BxBIkCnJw2HP/UeFfG61/t5u79Pf1AjhsiYPQ2+LZT1tr8tkUYPhR+p0siH0PcvgVwHF/C/f1+eId4MXrgQ/HhFcPhyxH/58KljP5doC703Stw11o7ieUW+iRnkMrnoBuLD98rchBl0K6SawJ0vE44Nyx4TYJT6HyNGpYwj2ELheoa6rvP6OGVQvfBPY8Aej/jKp15InABxanZMPSyarcMx5TblWt5LGzgBkPR6lNfOqKLUEYmuzqkL2Hh/nrXSBG5/OB7xar4+AzH23Y8Gc9AexzSvn3XY6vsb9QNulW4DmbOUl8XuPwNIktQQa/C7TcOzzDWfLfOionbEFKIbwanULnYv2NdPZdS5K8+6R6yiGckHNibiU6OKd2wzyWBDn9IWD/RjEu3Azx8j3JwXsevD/OW3Fe4vDRfy89ve/SQ8Ue5PGMj55VxOCtwzjLQeeoS2VW8tVstWgRhBvTOGPgplvsCOLkwc/NGLvvGeiFMcXdhE4WFr+jIjRx4r56ZcMcG2wCMGb5r/hspZzNFcIgMNb4xy+omONJcNbAQDrnjgGMCmtUHuijiK67xIogfNkuHG9978BPQxXueJAkXD1q20V5N2EwGfYAXmT+dIAPQ5HRRWgSSFGwk7afM8b6ECLTPPsntdImEqPTvDzWQHL4iXpk16BOl6AY+2PbXRVZtmjTtIS1q4DV3wOr6j3c5Fv7UzJfHzqj7j8a2H5fa/3fHAX8s38ybQtD69j0IP3+DhxycRgmAnJLUOHKe+XnjG7qtqeAOonPecdP/wunHZJYaiwI4jRZDAJUIYhC0WnxY/UKRQ4OF0XqECg7QRhu4ILxwCYhOh4TggB9bge6D7Z/9eWSmDU2ZSdIFEu6uhPksCqgb7U9OV7JAGMGSb9hhUBZCRLFURIarTNBGL/9jMftX34uSw8/Rshhh0BZCeJ07yDIJmP0I0ZB0k3aH6rOsjV2FVrA4dv5at6x/BPdkCne3rIRpPMA4JT7ilfUa8rZE4F7e3nNndx83NEnOaxO5xasGnVS/Hf7y90CZSEIo6ZeNg0IO1Am3fE/dXG4x9jL3YBW9Tf/lSKHk9Pupy8BXrs7jtrHS6eyECSKC1A8Ws6JJ8Mk6yZuCx8v3ajuv6RJ6PWR92vqCwMY0em4HykLQarett/J9WMM8675QTX+yw6rNn7riHP+Y28FevzZXsM0hWzmHX+Son1X9UmS8IgMj+j/+E0wrRQ5QRiW4PwXglG+cSmzXlTuaBjURkfpdhlwwh32lvNSFi9nJVl4QJSrn3zqz6/oyG7ircGPGCInCMMSMDxBkMLYfyTGBJsQxUHWFdey9j4Z+IPDnRLeex/RF2A0qKRJmwPrSNG6U0Pt3/mXuqXJE9hhSKQE4cnZP38MbNoiOFM4znzhWmDuK8GVmbSSGK2Xp3Pp4d5Kct5a+gJLP0yOZQw13fFYRYzGcwtaQf8BHEZ/9mq4NkVKkAPPBk4dGZxBU+4Anr0S+HlVcGUmrSQ6Wzj/efvbl5yTPdBXxVGMu/CaNe+pkBS7HmGt7ayXgKnDorurEilB6KSAzgr8CgnxxAB9HQnUx+/sp4C9+tkj+tiZwIxH/CIeXn6OJnJzijwxrGKQsHa6HfrvPcDbDqcCwtAyMoLQicH1i/2bwJBfj58F8JdEdznuNueY74xzwngncRPexszd3T9GkcNup5960wMMicErzOWQyAhCMM57zp+JdILw6BkKNN2FQxEGtrGT954CHjw5PiitI8XRihz820m4qPDGA+UPQxEZQYLYHNT50GH9l4nDEMbt4PVhK5n7MjDiBG9OKIKkVKmkYN3UnbFZ4jIsjIwgF0+uc3DgpREkZkcdak4/NgxASv/C5fJGsnlroEMvoENvgHtebj1FwSp60ycx3vu3l7cjvDyJIAh/Vdh7iAAbbwNUzbS+P098GPiHPyZRCs/UkRAcRnN3uxSh7y0OpT4M2YNmKTrVT5sIgkjvUddkPEbC4yR2ckdn5Tk+TKHrI94E5coT50JeDp2+84QiRtwXW4QgYb5JAZfdfGPVe9ADi51ctXGwHtj58tPDZSs++6h/W3l/KdZUxl/hUCrsDb5i9XFLFxlBePeDd0C8iPQgCjW3s1ZMk+mkfHWVKlu1A7Zsp4iQI8Q+6t/NmpdaUtP0dMDH/QsSI+zezb+2DUuIjCBO4YTdjFo+C7jNwi2/W740fU8PiOw9+OI6CX38PvTbpikKBOBn7t9t85/5v8PAipt7dL/KJef/LQyjhvDLjIwgnMRd4GNzj/sfjb2jhw9PfGqgF3g6ui5G+Iu9Yinw3SLVK5AQUQkvqZEQJEYazsdFRhA20EUTnW+5OTUiu2ZOQHWVQui2uNpPP76F3oJeKNMikRKEMbcZe9urLHkfeOay8MOkedWPJ1A5bucBwQVvAt8HcLSmoMuVs5wn51519pNv2Ud1vQWdfadRIiUIAfS7Ycgyyj1p5wlaTmRb7pWf1O6l/uYp06l3qbggQcsVHwAt9gi61NLL40FRDqHee1oPhw+RE4TOk6+dX3rDNM5BlzVcKpw9SYUvC9qfLNf6t9lJhU3IPe3V3yRC/d1hhlZg7HOSY+WX/u2yK+GYm4CeV4dXvlPJ7AnnvKzw5r6FTvf8IycIG4IXYC6dEmxjc7d96UfAsg/rPp1eWHr+2Gx7gL1Bjgjt68jAv0kQO+GvKHd++XD50q9jgGKQ4A71gHHFpAwmDVegeIdk7quKGFHYGIzmwZZSFoLQhO06qkl7kLcLG0PD0M50ysxJIz/58FYjSeFEADuI+ev5UZ4Y7MGilkMuAfrdFU6tK5erAECzJ6jVp6QuywaNTtkIUiBJv2HeV7aCBsOqPAbJYZi2D8YAS96LokbnOnhQkffPg5iP5Gx7Xg2bkraBF1VLlJUgBSN5vqjXNQCD6JRbuI5Pf7UcYvC+e7lOxbrhwGhcvJa6RWvVI3K4yH/zOEpj4X7ItwvVvgifhTOUjUG5xnHTNcnfx4IgBJARj/Y9Fdi7H7DNLtFByiVZXsDi8OLT8d6OaUSnrXtNhSEkb+kVSOGeS1LYIRAbghQU5GUgkoST0naHqPBoQQndA5EM3KNY9Jb65Fq+iCCQGII0VpQE2bEb0L6bGnfzbvtmrZwbdM2Pai9i3TNLxUNfNENeBEGgNARi14MUq36BKIy7x7NHXKFaw8+VyQ2wWaztki46BBJLkOggkpp0RkAIonPri+2uCAhBXCGSBDojIATRufXFdlcEhCCuEEkCnREQgujc+mK7KwJCEFeIJIHOCAhBdG59sd0VASGIK0SSQGcEhCA6t77Y7oqAEMQVIkmgMwJCEJ1bX2x3RUAI4gqRJNAZASGIzq0vtrsiIARxhUgS6IyAEETn1hfbXREQgrhCJAl0RkAIonPri+2uCAhBXCGSBDojIATRufXFdlcEhCCuEEkCnREQgujc+mK7KwKOBKkCQzpNcy1EEggC6UWgi5HB9IJ5Rn07zUq0RAUCDJOUXhTFspQikEUroxZLLAnC/zSrsAbA+ik1X8wSBJwQWGtk0CAOdoMeJE+Q2QB2FhwFAQ0RmGNk0MCTelOCDMREGOihIThisu4ImJhk1KBnfRiaEmQQRsBEf92xEvs1RMDASKMa5zgTpAo3ALheQ3jEZEFgiJHJvf/rpGkPUolOqIDEDZCXRT8EstjfqMVMR4LkJuqDsBAmWuuHkFisLQIGFhnVaNPY/iY9SH4l624AF2kLlhiuIwL3GBlcXCxBTgHwhI4oic3aIvBbI4MniyPIYGwLMzfMarBpoi10Yni6ETCwBgbaGEOxvCiC5IZZAzEGBvqkGxmxThDgy46xRg36WmFhOQfJEWQweiGL8QKgIJB6BCrQ2xiKCSURJD9ZHwng7NQDJAbqjMAoI2O/MW7bg+QIovZEePRXDi/q/Aql1/a1yKJz472P+uY6EiTfi1QDqEovRmKZxghkjAwGOdnvTpBKtMv3IttpDKSYnj4EluV7j3m+CJLvRc4HcH/6MBKLNEZggJHBcDf7XXuQQgHmQAyF4dwduVUm3wsCsUDARLVRg8HF6FI0QXI9ySCMgSl7I8UAK2liioCBsUa19Z6HlcYlESQ/3JoFoENMzRe1BAEnBD41Mti1FIhKJkieJGYplUhaQSAOCBgZlPy+l5xh3ZykClMAdI2D4aKDIOCCwFQjg25eUPJMkFxPMhC3wMCVXiqWPIJAJAiYuNWowVVe6/JFkPzE/XKYqPWqgOQTBEJDwEClUY07/JTvmyA5klTiTFTgdgCymeinNSRvUAhwE/AKoxYP+y0wEILkScId9z8CuUfObvltGcnvBYG1AIYhi2FGLRx3yIstPDCCrJu8qwOOJImcAi62FSRdEAiMyhOjgdMFvwUHTpB1ROF9kl9wGQwcJT2K32aS/DYIrIWJcWiGO+3uc/hFLjSC1OtR6BD7SAC9gJzXuhZ+lZb8WiOwFMBEABOQxYv1HU2HgUroBGmstKlCLBwFAzsgi7a5T6Ct9DJhNG+iy+R8Yj5MLEBF/hMYVz80QRTWRU4QO6PyoRfaIosNozBc6ogpAhVYhSzmh90zFGt9bAhSrMKSThCIEgEhSJRoS12JQ0AIkrgmE4WjROD/AdKZUkGo/2yvAAAAAElFTkSuQmCC
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480512/%E9%98%BF%E9%87%8C%E5%9B%BD%E9%99%85%E7%AB%99%E4%BA%A7%E5%93%81%E8%AF%A6%E6%83%85%E9%A1%B5%E6%95%B0%E6%8D%AE%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/480512/%E9%98%BF%E9%87%8C%E5%9B%BD%E9%99%85%E7%AB%99%E4%BA%A7%E5%93%81%E8%AF%A6%E6%83%85%E9%A1%B5%E6%95%B0%E6%8D%AE%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==


function waitForPageToLoad(callback) {
  if (document.readyState === "complete") {
    callback();
  } else {
    window.addEventListener('load', callback);
  }
}

// 调用waitForPageToLoad，并传入要在页面加载完后执行的函数
waitForPageToLoad(function() {
    let companyNameSpans = document.getElementsByClassName('company-name detail-separator');
    let href = companyNameSpans[0].querySelector('a').getAttribute('href');
    href = "产品ID：" + href.match(/productId=(\d+)/)[1];
    var h3 = document.createElement('h3');
    h3.textContent = href;
    var styles2 = "position: absolute; font-size: 12px; color: #0265E6; left: 40px; margin-top: 35px;";
    h3.style.cssText = styles2; // 设置字体属性样式
    let shape = document.getElementsByClassName("ua-item action-item share-sns")[0];
    shape.appendChild(h3)

    var metaElement = document.querySelector('meta[name="keywords"]');
    var content = metaElement.getAttribute("content");
    var keywords = content.split("- ")[1];
    var keywordArray = keywords.split(",");
    var keyword1 = keywordArray[0].replace("Buy ", "");
    var keyword2 = keywordArray[1];
    var keyword3 = keywordArray[2].replace("Product on Alibaba.com", "");
    var keywords_info = "关键词:" + keyword1 + "," + keyword2 + "," + keyword3;
    var h2 = document.createElement('h3');
    h2.textContent = keywords_info;
    var styles = "position: absolute; font-size: 12px; color: #0046B8; left: 40px; margin-top: -215px;";
    h2.style.cssText = styles; // 设置字体属性样式
    shape.appendChild(h2);

    var h1 = document.createElement('h3');
    var styles1 = "position: absolute; font-size: 12px; color: #0046B8; left: 40px; margin-top: 155px;";
    var cateids = document.getElementsByClassName('detail-next-breadcrumb-item');
    if (cateids.length === 4) {
        let cateid1 = cateids[1].querySelector('a').getAttribute('href').replace("_p", ":").replace("..", "");
        let cateid2 = cateids[2].querySelector('a').getAttribute('href').replace("_pid", ":").replace("..", "");
        let cateid3 = cateids[3].querySelector('a').getAttribute('href').replace("_pid", ":").replace("..", "");
        let cate_info = "Home" + cateid1 + ">" + cateid2 + ">" + cateid3;
        h1.textContent = cate_info;
        h1.style.cssText = styles1; // 设置字体属性样式
        shape.appendChild(h1);
        // 当长度等于3时执行的代码
    } else {
        let cateid1 = cateids[1].querySelector('a').getAttribute('href').replace("_p", ":").replace("..", "");
        let cateid2 = cateids[2].querySelector('a').getAttribute('href').replace("_pid", ":").replace("..", "");
        let cateid3 = cateids[3].querySelector('a').getAttribute('href').replace("_pid", ":").replace("..", "");
        let cateid4 = cateids[4].querySelector('a').getAttribute('href').replace("_pid", ":").replace("..", "");
        let cate_info = "Home" + cateid1 + ">" + cateid2 + ">" + cateid3 + ">" + cateid4;
        h1.textContent = cate_info;
        h1.style.cssText = styles1; // 设置字体属性样式
        shape.appendChild(h1);
        // 当长度等于4时执行的代码
    }


});
