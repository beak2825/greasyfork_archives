// ==UserScript==
// @name         美丽得Buzzing
// @namespace    https://greasyfork.org/zh-CN/scripts/470215
// @version      1.2.1
// @description  支持拖拽排序,双击标题栏可置顶，双击底部栏可移至最后,版面高度可自己调节
// @match        *://*.buzzing.cc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=buzzing.cc
// @grant        GM_addStyle
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/sortablejs@1.15.4/Sortable.min.js
// @downloadURL https://update.greasyfork.org/scripts/470215/%E7%BE%8E%E4%B8%BD%E5%BE%97Buzzing.user.js
// @updateURL https://update.greasyfork.org/scripts/470215/%E7%BE%8E%E4%B8%BD%E5%BE%97Buzzing.meta.js
// ==/UserScript==

(function () {

    class newBuzzing {
        constructor() {
            this._h = this.storage({ type: 'get', k: 'defaultHeight' }) || 380
            this.selectedIndex = null
            this.sortInstance = null
            this.changeBox()
            this.sortable()


            this.addSlider()
            this.addBottomBar()
            this.makeMoveabel()

            this.modifyRedditLink()
        }

        storage (options) {
            let { type, k } = options;
            if (type == 'set') {
                localStorage.setItem(k, options.v)
            }
            if (type == 'get') {
                return localStorage.getItem(k)
            }
        }

        moveElement (position, that) {
            let sequence = that.sortInstance.toArray()
            let element = sequence.splice(that.selectedIndex, 1)[0]

            if (position === "toTop") {
                sequence.unshift(element);
            } else if (position === "toBottom") {
                sequence.push(element);
            }
            that.sortInstance.sort(sequence, true)
            that.sortInstance.save()
        }

        sortable () {
            let that = this
            that.sortInstance = new Sortable(document.getElementById('Sortable'), {
                group: 'move_move',
                animation: 150,
                store: {
                    set: (sortable) => {
                        const orden = sortable.toArray();
                        that.storage({ type: 'set', k: sortable.options.group.name, v: orden.join('|') })
                    },
                    get: (sortable) => {
                        const orden = that.storage({ type: 'get', k: sortable.options.group.name })
                        return orden ? orden.split('|') : []
                    }
                },
                onChoose: function (evt) {
                    let { oldIndex } = evt
                    that.selectedIndex = oldIndex
                }
            })
        }

        modifyRedditLink () {
            const links = document.querySelectorAll("a");
            const len = links.length;
            for (let i = 0; i < len; i++) {
                let link = links[i]
                link.target = "_blank";

                let { href } = link;
                if (href.includes('old.reddit')) {
                    link.href = href.replace('old.reddit', 'www.reddit')
                }
            }
        }

        addBottomBar () {
            let summaries = document.querySelectorAll('summary');
            summaries.forEach(function (summary) {
                let children = Array.from(summary.children).slice(1)
                let newElement = document.createElement('div')
                newElement.classList.add('item-bottom-bar')

                children.forEach(function (child) {
                    newElement.appendChild(child)
                })

                summary.parentNode.appendChild(newElement)
            })
        }

        makeMoveabel () {
            let that = this
            document.addEventListener("dblclick", function (event) {
                const topBar = event.target.closest(".stick");
                const bottomBar = event.target.closest(".item-bottom-bar");

                if (topBar) {
                    that.moveElement('toTop', that)
                }
                if (bottomBar) {
                    that.moveElement('toBottom', that)
                }
            })
        }


        addSlider () {
            let that = this
            let slider = `
            <div class="slidecontainer">
            <input type="range" id="volume" name="volume" min="380" max="800" class="slider" value=${that._h} />
            </div>
            `
            document.body.insertAdjacentHTML("afterbegin", slider);
            document.getElementById("volume").addEventListener("input", function (e) {
                let { value } = e.target;
                that.storage({ type: 'set', k: 'defaultHeight', v: value });

                var boxes = document.querySelectorAll(".cc-cd");
                for (var i = 0; i < boxes.length; i++) {
                    boxes[i].style.height = `${value}px`;
                }

                var inner = document.querySelectorAll(".feed-content .container");
                for (var j = 0; j < boxes.length; j++) {
                    inner[j].style.height = `${value - 80}px`;
                }
            })
        }

        changeBox () {
            let details = Array.from(document.querySelectorAll("details[id]"));
            let savedOrder = localStorage.getItem('move_move')?.split('|') || [];

            // 按照保存的顺序重新排序
            details.sort((a, b) => {
                return savedOrder.indexOf(a.id) - savedOrder.indexOf(b.id);
            });

            let container = document.createElement("div");
            container.id = 'Sortable';
            container.classList.add('bc-cc');

            details.forEach(detail => {
                let div = document.createElement("div");
                div.id = detail.id;
                div.className = 'cc-cd';
                div.innerHTML = detail.innerHTML;

                detail.remove();
                container.appendChild(div);
            });
            document.querySelector("details.my").insertAdjacentElement("afterend", container);
        }

    }

    let { _h } = new newBuzzing()
    let css = `
    body {
        background-color:#F7F8FA
    }
    .feed-content {
        height:auto;
        mask-image:none;
        -webkit-mask-image:none;
    }
    .feed-content .secondary  {
        display:none
    }
    .card-inner :not(:first-child) {
      display: none;
    }
    .bc-cc {
        padding: 1% 0 20px 1%;
        width: 99%;
        overflow: hidden;
    }
    .cc-cd {
        height:${_h}px;
        width: 24%;
        background-color: #FFF;
        border-radius: 4px;
        margin: 0 1% 1% 0;
        float: left;
        box-sizing: border-box;
        overflow: hidden;
        position:relative;
    }
    @media (max-width: 1024px) {
        .cc-cd {
            width: 32.2%;
        }
    }
    @media (max-width: 768px) {
        .cc-cd {
            width: 49%;
        }
    }
    .cc-cd label {
        display:none
    }
    .stick {
        background-color:#fff;
    }
    .stick span{
        display:none;
    }
    .feed-content .container {
        width: 100%;
        height: ${_h - 80}px;
        overflow-y: scroll;
        overflow-x: hidden;
    }
    .card {
        box-shadow:none;
    }
    .card-inner {
        padding:0 10px
    }
    .my {
        display:none
    }
    .item-bottom-bar{
        position:absolute;
        background:rgba(255,255,255,0.5);
        height:35px;
        line-height:35px;
        width:100%;
        bottom:0;
        padding:0 20px;
        border-top:1px solid #EBEBEB
    }
    .slidecontainer {
      position:absolute;
      right:0;
      top:10px;
    }

    .slider {
      -webkit-appearance: none;
      appearance: none;
      width: 80%;
      height: 15px;
      border-radius: 10px;
      background: #d3d3d3;
      outline: none;
    }

    .slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 25px;
      height: 25px;
      border-radius: 50%;
      background: #04AA6D;
      cursor: pointer;
    }

    .slider::-moz-range-thumb {
      width: 25px;
      height: 25px;
      border-radius: 50%;
      background: #04AA6D;
      cursor: pointer;
    }
    `;
    GM_addStyle(css)
})()