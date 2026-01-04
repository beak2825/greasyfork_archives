// ==UserScript==
// @name         ncbi论文下载
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  快速批量下载ncbi中pubmed的论文
// @author       webchang
// @match        https://pubmed.ncbi.nlm.nih.gov/?term*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nih.gov
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445098/ncbi%E8%AE%BA%E6%96%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/445098/ncbi%E8%AE%BA%E6%96%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
// 下载某一篇论文
    function download(doi) {
        if (doi.includes("hmg")) {
            const index = "10.1093/hmg/ddz128".lastIndexOf("/");
            doi = doi.slice(0, index) + "%252F" + doi.slice(index + 1);
        }

        const url = `https://sci.bban.top/pdf/${doi}.pdf?download=true`;
        const aEle = document.createElement("a");
        aEle.href = url;
        aEle.target = "_blank";
        document.body.appendChild(aEle);
        aEle.style.display = "none";
        aEle.click();
        aEle.remove();
    }

    // 下载所有
    function downloadAll(doiArr, statusArr) {
        let count = 0;
        for (let i = 0; i < doiArr.length; i++) {
            if (statusArr[i]) {
                count++;
                download(doiArr[i]);
            }
        }
        if (count === 0) {
            message("本页没有可以下载的论文",false);
        } else {
            message(`下载所有：${count}篇可下载论文下载中...`,true);
        }
    }

    // 下载选中
    function downloadChoose(doiArr, statusArr) {
        const checkedArr = document
        .querySelector(".search-results-chunks")
        .getElementsByClassName("search-result-selector");
        let count = 0;
        for (let i = 0; i < checkedArr.length; i++) {
            if (checkedArr[i].checked && statusArr[i]) {
                count++;
                download(doiArr[i]);
            }
        }
        if (count === 0) {
            message("没有可以下载的论文",false);
        } else {
            message(`下载选中：${count}篇可下载论文下载中...`,true);
        }
    }

    // 判断是否可以下载
    function judge(doiArr, callback) {
        GM_xmlhttpRequest({
            method: "POST",
            url: "http://82.157.168.147:9300",
            headers: {
                "Content-Type": "application/json"
            },
            data:JSON.stringify(doiArr),
            onload: function(response){
                console.log(JSON.parse(response.responseText));
                callback(JSON.parse(response.responseText));
                diffDown(JSON.parse(response.responseText), doiArr);
            },
            onerror: function(response){
                console.log("请求失败");
            }
        });
    }

    // 区分可下载和不可下载的论文
    function diffDown(statusArr, doiArr) {
        const icon =
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABKhJREFUaEPtmF1oHFUUx///KXZmg7QgqFREqz74IFajxYJPKZLMjEofCg1o40PR1o+2otLSFm3mTlQIrSjSYrUWEaoR0gpqTXY2eWjAp1Baix8PPoi2ohUfREPtzkYyR2aSXXazXzOTTTSSedud8/Wbc++59xxikT9c5PFjCeDfzuBSBv5XGXBGJtcimOoi2AnBDSRXhYAicgnELwROBsIvXFv/qlXgLVlCrpd/TMgeCLpiBUaMUOQDx8ocjyXfQGhOAE62sIaaHIwdeHUgYxBxlZ0ZSwuSGsDNFjYJg0MAr0/rvKQ3DaHS2EkFMB28DKZxWF9HtiorcyypzcQAKpvvAHk6qaNY8iLrky6n5ACeHwbfESug5EJjyjLWJ1FLBKCyeQXSSeIgsWzC/RAbQA3+djVXrDgvwG2Jg0qgQOB7mZi4W3VfdzmOWmwAx/OfInAkjtG5ygjwtGsZb8exkwAgP0DwkThGZ2SGILgAYhKCW0FsiK/L95Wlb4kjHxtAef45AO0xjF4MiCf6TGO0XLY353dqgqMAVjezIZAzrpW5r5lc+L4pgDuSf0CEJgTbAbQ1M0rgYccyhl71ZNXfLNwbyl8l+tkXLV5yhv0uasg1t8G/BPIuBKeVbXzWSL4uQFhxqGmWiKxr5rDs/Y/KMm4Jf6ucPwjBpugdcUKZRnf0v+dfAHBTApvnIfJpvZO6JoDy/DcAPJfASVG0VMeV50u5vrKMyJdKf44cVpaxc3ZMVQAqVzgOkZ4UwYcq8wkQXswHlJXZXB5bBYDy/B0ADqUMfgEAosh2Kss4XIyxBNA/KisLU4VxAW7/LwMQ+E5fpq/b28k/K6qQyuZfAvnyHIJfqAyELd5+ZWdeqQTIFc5AZO2iAADOKcuISnRpCble4Q+BrFwcAJxQlh7FGgE4w1dupKb9NMfgF24JhfVoMrjZ3dB2cbo2t65JmecyWvaJZ5qf0hJysv4VEpk5ZmGhAHxlGVGsJQDl+R8D2JgUgOQpCYLwogdC+9ax9RMzJ27NkzjqpxHcEfmh1gnI/Ul9AvCUZdiVmzjnPy+C15MYI9njmPqHtXTqXSVmy6bp8kSCfa7d1l8BsN+7fJeGZaMEr40JcUxZxtayPeRo1Hb1msvPNspA31DhzkCTHdBwSpnG56Gsm/V3C3Egpt9fw9txcbpXcZXo9fJbNPC9WIZmNtHsAkDiGcc0jtTKQNU4po6NRv4DCR7ts9s+KspUX+bi3kSLznP+NgjeKXdKUolIxaCKwu6qWZLgqLKNJxNUwQPKMvZU+Kq5frP+QRC7Gn2JYt+qsvnVIH+IlbVZQtoU1/Q+pH+tcv6zELzZ0IbgNWUbu2fLNGpoOoTcS8CsZZjkuMjyB5XF39NN6rhZWfqA8uQacnK4XuMkQI4i/fUGXk1bSidb2EgG94Bsp6BdgGhkHj1lM5xEEJTHlZmJ9lpVFRL5GeQ4RL6Epn2jTP2TRplpCpBkacSCEGxXtvFWErsLBjBdEusPfil4wbGNsF1t2dPSDBSjqgUh5D7X1KPDp5XPvACUZWIPQUMkOJl2/t8Mdt4Amjlu1fslgFZ9ybR2ljKQ9su1Sm/RZ+Af8eEzT82+QLUAAAAASUVORK5CYII=";
        const articles = document
        .querySelector(".search-results-chunks")
        .getElementsByClassName("full-docsum");
        // 插入图片
        for (let i = 0; i < statusArr.length; i++) {
            if (statusArr[i]) {
                const img = document.createElement("img");
                img.src = icon;
                img.style =
                    "width:20px;height:20px;position:absolute;top:2px;right:-10px;cursor:pointer;";
                img.addEventListener("click", function () {
                    download(doiArr[i]);
                });
                articles[i].append(img);
            }
        }
    }

    // 将doi文字替换成链接，并返回doi列表
    function replaceDOIsWithLinks() {
        const spans = document
        .querySelector(".search-results-chunks")
        .getElementsByClassName("full-journal-citation");
        const doiArr = [];
        spans.forEach(span => {
            const content = span.innerHTML;
            const matchResult = content.match(
                /\b(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?!["&\'<>])\S)+)\b/gi
            );

            let doi = matchResult ? matchResult[0] : "";
            doiArr.push(doi);

            if (doi) {
                // 将doi替换为链接
                const link = document.createElement("a");
                link.href = `https://sci-hub.ee/${doi}`;
                link.innerHTML = doi;
                link.target = "_blank";
                const textArr = content.split(doi);
                span.innerHTML = "";
                span.append(textArr[0], link, textArr[1]);
            }
        });
        return doiArr;
    }

    function appendDiv() {
        let isLoading = true;
        // 下载按钮
        const p1 = document.createElement("p");
        p1.innerHTML = "下载所有";
        const p2 = document.createElement("p");
        p2.innerHTML = "下载选中";
        p1.style =
            "background:red;color:white;font-size:12px;margin-bottom:10px;padding:2px 5px;border-radius:2px;";
        p2.style =
            "background:green;color:white;font-size:12px;padding:2px 5px;border-radius:2px;";

        // loading图片
        const loadingImg = document.createElement("img");
        loadingImg.src =
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABHJJREFUaEPtmVtoHGUUx/9nJq710jY7m4BRC2p2EjQVoUGq9CX6UK2XegFrvYuodWdsRbBFQWj7pLZeMHZmTVGEeGltH5Raq+BD8yJeaMQXL90ZMRCo2m1mgpTSXHaOzNJZ9pqZzc4km9Z92/3Od87/d853X8IC/9AC1485Abh04MiFp5yl3bEW8djxp676J8ykNQwQT5vLAWcVMVY4OdozvlEeKhaYSJv3ALyTGZ3535k2W2ry9bAgGgJoe+33xc5i8TsAPZ4gJuFOO9V50P3e+o7RJ4g4XCGWne2W2r0tDIiGAOLaHw8QOZ+UCuHdltK14ZwBiOuZzQS6C8AqAN8CNGgpyd1Bq+Nbgda3/mwVz5/scyA8J8B5OzcRGxp//spxN4DfELr8zdELTi067Q6hlcWCyOEbxp7t+kFKG0+A8X65WCY8bKfkj4NA+AIk0sYrzHjRc0aEV8dS8kved79J3DYw0uFMT2xgEq8jOKYAYe8JJTns9o/rxiABj1QAAB/aivxoKACSbvwF4JIiZ39bitwRxLmfjaRlvgTRbZWTnA9Zatftfv3ddt8KSLrxFYBbi5x9bSnymiDO/Wwk7eg2kLC1kVXKFyCeProeLN5P4LsZ9Dko96md6t7rJy5Ie3545aY+K54jDAzZinxTkP6BKuA5ctf08k0qaBA/uzbdWOuws0Ig4acTinxA0sxlLPAWYroD4BgBw2OKvLaaH98K+AUPu73WygXgF0uRl5fHqwBIaJnHGVgtYurprNpzMmyBfv7iaeMhYnxUza7a8loCcGZT2eF1thR5zitUc2K7oqocQcoAjMME9BXoQzyz+GXea5d04z4A+2rYr7MUeX9xW9NVwBUn6cb35bs3CN9YKXl108+BQiXS5gdgdzRwjEE/EmOTpSZHfQGClrpZ7OZ8ktYLLunmDoBvBtALYBjsHCy+SzQ1QEI3NzK4vwp0YTKXAES529ab+XbNTOaIjVr9pmOLEv8+uczKA1zcb7Sf14J97hLKoEFbST5Wb8Cw7WfIfj6Ud6fIA8Q1QyGCVhAhoMd6Rv41bFH1+Ivr5hoCH6rVR2SSs2rSzAOUXb6PWYp8WT3BorKVdMMFqHZ0328p8rp8JbzgLgSJ2EoC1PnOvqfpzDz4GcBFRUkqSXBTr0L5XbnfWIIW3AJ2ekCCeyKtfZSIaihE6bfpK+AHf/YBJHZlVjpEvbYq6370zdBesRMX3jKZXrDU5BvNIHImDaX3gaLrHDN0W5XVBQWw5L1RSZw4vZ4Eut7B1Pbx1NUj8wng3s7Kl81yPWffJJ7PjM8m9rlRgYSWuZeJJCcHM6rXudlkv+QwN5ODuGYcJ0I7g7fYStfO2QaLol+gIeQ9czALD9pq556whUjvGte4PmdzCg4EkL8zpH+7IqpldU4AZsq6K2ByEtmTm+Rs2NXx8xe4ArUctelmrwM+QsAXtZ7ApV3GjRDo2nr+vPMT7rU3DjAw0pGbnnqZ4GRr/ffrPdhG8VjcMEDQTEVl9z9AVJkN6vc/flrHQA66jp8AAAAASUVORK5CYII=";
        loadingImg.style = `
    width: 30px;
    height: 30px;
    transform: rotate(0);
    transition: all 0.5s;
  `;
        let circle = 1;
        setInterval(() => {
            circle++;
            let angle = circle * 30;
            loadingImg.style.transform = `rotate(${angle}deg)`;
        }, 100);

        const container = document.createElement("div");
        container.append(p1, p2, loadingImg);
        container.style =
            "position:fixed;top:105px;right:15px;z-index:1000;cursor:pointer;text-align:center;";
        document.body.append(container);

        // 获取doi列表，将doi替换为链接
        const doiArr = replaceDOIsWithLinks();
        // 获取论文的可下载状态
        let statusArr = [];
        judge(doiArr, arr => {
            statusArr = arr;
            container.removeChild(loadingImg);
            isLoading = false;
        });
        p1.addEventListener("click", function () {
            if (isLoading) {
                message("数据加载中，请稍后...");
                return;
            }
            downloadAll(doiArr, statusArr);
        });
        p2.addEventListener("click", function () {
            if (isLoading) {
                message("数据加载中，请稍后...");
                return;
            }
            downloadChoose(doiArr, statusArr);
        });
    }


    // 全局弹窗提示
    function message(text,flag = true) {
        const img = document.createElement("img");
        img.src = flag
            ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABRVJREFUaEPVWl1oHFUU/s6sbeMvgrQza1BBfBBLlexsqqQ7m8RYBZuK+JAXIXGrGNAq4l+poFSFVlsVUQQt2tikPvhDWmgUrY0xmUmRJrNRoZiHIFpId5b41ArGkp0jM5vd7m52d2Z2ZxIzsC97z/m+8+2998y95yzBp0dWwzEQ7gdzIwGNDDQi+7GeWQJmGZgF0SwY3+hKSvODmuoBkUfD94J4KwhdAG70iHUWjC/A9L3emjrh0Tdv7lnAxpH1VzWsFRJgSoDRVCtxkR9hCsR98xfNvjPtc397wXQtoPn0esm8KCRg0g4QbvFC4tqWMQOBDwlrzb6JzXOGGz9XAuQxaRuAdwMLvDRSSwjwjB43vnYS4SggqomPMtPHTkBBjBPxY5Ox9CfVsKsKiI5JLzLhzSCCc4tJjF2TcWN/JfuKAiKqlCDgkFuiIO0Y2JFUjL5yHGUFyJrUDsYPQQblGZtwtx4zRkr9lgho/lFqNkM47ZlgGRyEDDZPtBkThVRFAuxU+W/IUnnrMsRTC8W0sC7TXphiiwTImrgbTHtrQV42H+KX9Fh6X44vL8B+w4ZCU8uW62tVzJiZz2Sacm/svAB5XHwKJr1XK+6y+gn8tL4l/b7FeUmAJiV9O9sErYYwpceMSF5ARBU7CXQ8aF6X+GcAbHSyZfD2pJIesmcgqoofMehxJ6eAx/8hRvdk3PhKVsU7Afqp+hGCD04q6V5bgKxKswCuDzjAavBzDOpOKqlvc0ayKlnpvK2K0zldMRqpaUzsEIhOrmDwvwPUU3hDi2hSFzE+d4rJZL6HZC28F8y7nYwDGv9VWMj0TLTP/ZzD93QGI9pHsiodBtAdUIAVYRl0CqGFnmTLnHX2t5+oJu1khp0eXT79FFWlkwx0uHTwx4z5hNBg9hQeCWRV2gXgDS8EBAxbM/Cb67MP4Q8wDiySPAngNi+Eli0Bg+to4ZHx2F8X8htWk14D42WvWACmLQHnAVztxpkZiWTc+NTOXKfETTBpEOzhfkw4rG8xEiBwQbZ5G8CzbvjL2FzwJsDEq8lWY08OqGkkHBUu40EANzgFQMAHk4qxs9AuookfElOvk2+VcVuA+yWURerSFePLHGjz6IYWMyRYMyFWImJgf1IxrDWef+Qx8QiIHq4jeMt1utZNXCQiqkptDD4K0LVLAiK8oseM13Pf3/6LeOWa8zgC0IN1Bm/tJ3sT15pGi0TYVboQHwXjikuB0XO6knonH/y4uGGNaQe/td7gF/37632RFYlYPBQeAxBiUG9SSR3MLzVVvDnDwgARt/gUPJB9kYVjAKt1gBaL0MIPIYPLk62pz/KZZlTcBEEYAPiOOnjKuJKSO8z9WUNxthCwSERJprmLTBoI4KZ3VleMm7ICxqQDIDxf56+zRMTiQXEAQLhO7KXujLf0uPFCVoC1AQX+zgeSvIioJj7ATFbw1/iAuxTCpPussrzvV0oG9hDjOhCesDZzIMGXXintWVjtl/pVX1axZ2E1F7YsAXZpcT6kBpDy/NkKjBmhIaNULC0uptRtIAz5w+gzCqOztGtTtry+kl2ZSpIrdWsqNjj+D92ZnJhqXZqqLSZPFQKfV0sOrlp3xrJxbPKtaLemQlem8LdyFGBnp2zXpt/15b/+2ZgWMugu7caUg3UlIJ9iV2uju1D5qv2rQbnps25gArCdQZ01FIfPEXjIBI5bZfJaV53rJeREYJ/9BaHDzd9tTNMcnoqnh50w3Yz/B19VBNGHXa2nAAAAAElFTkSuQmCC"
        : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAA/pJREFUaEPtWT2IE1EQ/iZ32WiltZAXUDEb8KdQ0EJBG0E8Sw8LLbQ4UfGnUFDBPwQVtPAHlbtCCy38KVUEGwUtFLTwB7IRFfIC1lppNncZeZcfN5vdzXubvZOACymSzJv5vpl58+bNEgb8oQHHj/8EWhH8smBudmpocgunUkuZWRAg0PioRzIgiUhSvf5paGr40eLvvypJRL+vCBRFeiVAG4l5I4jWGwFifsFEzwB+VpC1d0ZrPcKxCCjgKaTGGDwW17B3HYEm6qhPxCFiTKAkMuNJAfeTV0TysrrbxClGBByReQnwWhMD5rL0ypbVdbrrtAk4WasMam9KXf3x5BjSrrg5ncVaBBxhsY6ypGVs6fbE11PAyVnvwVieNDgtfYQPdtldESUbScAR1gMAW7WMzZzQQ1u6o2HqQwnMZLUx5RpVnQIJqDpPoLc9DI0SI8WEe6aAOs4AxjYm1AGoaIc+DF4VdE4EEtDw/qgt3YfKmiOs7QDuxCSxw5bu3aYelaqhJMKi0EVAx/vE2JavuPdboJ1seieIbhmRYN5lV2q32zqEFUlAyQVFoYtASVinGDitAabtPSVbFOkxAo1rrFNAdhdkbcIEvJIl4HReumc6UtBvsJSzXjNjtQ4Q+LxYyqb3MtH1yLLHvC9fqd0wBT9NgPAmX3bXhBL4LOYsrKP+VQt8U6jbm5mDAF8O1kGHbFm9Egd8a00KqUVL5O9vre8dKVQUmf0EvmpCYNozPq8Wc5nDxHzRq4eJjhTK1Uv9gG/sAzpQkNVrgQScXOYGmPeYEmjId3q3JKyjDJxv5u6xvHQv9Au+YYZu2uXq3pAIWI8J2ByPANDl5Zx1Qumyy+7ZRMBPRwBPCtIdCY6AsD4AWBaXQJC3vbocjVKpYfujLd12b9axBxxh/QAwT0NJtAjhpNfrSjgh8ErVT1u688MiMPAEBjuFiiLhTdzIebT6piRSKXoTJ1hGfTnfbv76JhFVRnVagaDd6z/IQjZsIiT8tjqqkJquTQ5PSZMqZNiY9U1ieHJIeKd6Xd2ok00/156yxWiJAcQnwfzCrtQ2eB0ccB+wjhFwTiMKHe20YZ2PRYKB4wXpTrcngeeA+jHWhSbeCWtMQutCo0gYXil73qQioum9miZzpdSNgsrlJrDIy7hGKmrpMbrUa0ZBA1syIsZjlb+t72wMc3uRjB729h4tzuZQ189FY8jbk0Dz6B/c4W47nWZzyKsx1A09B6IycpaGvZHDXD8+rRTyLtI4I3rtytD/Z/wVU8vyQL/k87qvQYRGQNikPc1rKlBTNjCe1sGP47ydjLUHonJDTfWmwJuJUIh60c2M4hDoiXe6FjvnGvPSwX7+E/jX8fsDABEKT4je6toAAAAASUVORK5CYII=";
        img.style = `
    width:20px;
    height:20px;
    margin-right:5px;
  `;
        const div = document.createElement("div");
        div.style = `display:flex;
          justify-content: center;
          align-items: center;
          padding: 0 10px;
          height:50px;
          border-radius:5px;
          position:fixed;
          top:200px;
          left:50%;
          transform:translate(-50%, -100px);
          background:white;
          box-shadow:0 3px 6px -1px rgba(0,0,0,0.3);
          z-index:1000;
          `;
        div.append(img, text);
        document.body.append(div);
        setTimeout(() => {
            div.style.display = "none";
            document.body.removeChild(div);
        }, 4000);
    }
    window.onload = function () {
        appendDiv();
          const meta = document.createElement("meta");
  meta.setAttribute("http-equiv", "Content-Security-Policy");
  meta.setAttribute("content", "upgrade-insecure-requests");
  document.getElementsByTagName("head")[0].appendChild(meta);
    };

})();