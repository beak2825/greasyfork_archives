// ==UserScript==
// @name         ViSearch/Google of Google
// @name:zh-CN    ViSearch/Google of Google
// @name:zh-TW    ViSearch/Google of Google
// @name:fr    ViSearch/Google of Google
// @name:es    ViSearch/Google of Google
// @name:th    ViSearch/Google of Google
// @namespace    https://github.com/new4u
// @version      7.117.2
// @description  Now on Chrome extensions!!! **https://chrome.google.com/webstore/search/visearch** ! Beyond the ChatGPT/AI with eyes.ViSearch as the Free/Lightweight alternatives to ChatGPT,has the potential to be even more intuitive than ChatGPT in the future.
// @description:zh-cn  Beyond the ChatGPT/AI with eyes Now:ViSearch on Chrome extensions https://chrome.google.com/webstore/search/visearch
// @description:zh-tw  Beyond the ChatGPT/AI with eyes Now:ViSearch on Chrome extensions https://chrome.google.com/webstore/search/visearch
// @description:fr  Beyond the ChatGPT/AI with eyes Now:ViSearch on Chrome extensions https://chrome.google.com/webstore/search/visearch
// @description:es  Beyond the ChatGPT/AI with eyes Now:ViSearch on Chrome extensions https://chrome.google.com/webstore/search/visearch
// @description:th  Beyond the ChatGPT/AI with eyes Now:ViSearch on Chrome extensions https://chrome.google.com/webstore/search/visearch
// @author       new4u本爷有空
// @connect    google.com
// @connect    google.com.hk
// @connect    google.com.jp
// @include    *://encrypted.google.*/search*
// @include    *://*.google*/search*
// @include    *://*.google*/webhp*
// @match        *www.google.com*
// @icon        https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/WikiProject_Sociology_Babel_%28Deus_WikiProjects%29.png/240px-WikiProject_Sociology_Babel_%28Deus_WikiProjects%29.png
// @require     https://unpkg.com/d3@4.13.0/build/d3.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/d3-tip/0.9.1/d3-tip.min.js
// @require     http://cdn.bootcss.com/jquery/2.1.4/jquery.min.js
// @require     http://cdn.bootcss.com/bootstrap/3.3.4/js/bootstrap.min.js
// @resource    http://cdn.bootcss.com/bootstrap/3.3.4/css/bootstrap.min.css
// @grant        none
// @copyright    2015-2023, new4u
// @license      GPL-3.0-only
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw
// @note         2023-05-25-v.7.117 发布到了chrome应用商店,并且修复了一个关键词和chrome界面语种的冲突,支持多语种.
// @note         2023-2-21-v1.117 发布迁移到userscript以来第一个正式版本
// @note         2016 Java -> 2019 Node.js -> 2023-2-09 各种各样的历史更新记录，从一个版本迭代到另一个版本
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459689/ViSearchGoogle%20of%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/459689/ViSearchGoogle%20of%20Google.meta.js
// ==/UserScript==

let styleSheet = `
body {
    padding: 30px 40px;
    font-family: OpenSans-Light, PingFang SC, Hiragino Sans GB, Microsoft Yahei, Microsoft Jhenghei, sans-serif;
}

.links line {
    stroke: rgb(255, 255, 255);
    stroke-opacity: 0.5;
}

.links line.inactive {
    stroke-opacity: 0;
}

.nodes circle {
    stroke: #fff;
    stroke-width: 1.5px;
}

.nodes circle:hover {
    cursor: pointer;
}

.nodes circle.inactive {
    display: none !important;
}


@media screen and (max-width: 600px) {
    .text {
      font-size: 8px; /* 当屏幕宽度小于600px时 最小字体为8px */
    }
  }

  .texts text {
    font-size: 12px; /* 最小字体为12px */
    min-font-size: 8px; /* 最小字体不能小于8px */
    max-font-size: 36px;
    font-weight:bold;
    font-family:"Microsoft YaHei";
    text-shadow: 0 0 3px #fff, 0 0 10px #fff;
  }



.texts text:hover {
    cursor: pointer;
}

.texts text.inactive {
    display: none !important;
}


#mode {
    position: absolute;
    top: 160px;
    left: 60px;
}

#mode span {
    display: inline-block;
    border: 1px solid #fff;
    color: #fff;
    padding: 6px 10px;
    border-radius: 4px;
    font-size: 14px;
    transition: color, background-color .3s;
    -o-transition: color, background-color .3s;
    -ms-transition: color, background-color .3s;
    -moz-transition: color, background-color .3s;
    -webkit-transition: color, background-color .3s;
}



#info {
    position: absolute;
    bottom: 40px;
    right: 30px;
    text-align: right;
    width: 270px;
}

#info h4 {
    color: #fff;
}

#info p {
    color: #fff;
    font-size: 12px;
    margin-bottom: 5px;
}

#info p span {
    color: #888;
    margin-right: 10px;
}

#svg g.row:hover {
    stroke-width: 1px;
    stroke: #fff;
}
`;

























let s = document.createElement('style');
s.type = "text/css";
s.innerHTML = styleSheet;
(document.head || document.documentElement).appendChild(s);

const colors = ["#6ca46c", "#4e88af", "#c72eca", "#d2907c"];
//临时半径R大小控制,之后改成连接数量影响大小
const sizes = [30, 20, 20, 0.5];
const forceRate = -1000;
// 选择 input 元素中 class 为 gLFyf 的最后一个元素
const input = document.querySelector("input.gLFyf:last-of-type");
let searchtext = input ? input.value : "";
if (searchtext === "") {
    console.log("searchtext is empty");
} else {
    console.log("searchtext:", searchtext);
    // 执行其他逻辑
}












function parseWebPage(Searchtext) {
    //data
    //***开始解析网页
    /* 谷歌获取 */

    //成功在page之外获取到页面元素内容，发现百度的下一页，就是
    let elements = Array.from(document.querySelectorAll(".g"));
    // console.log(elements);
    //读取数组里内容map为value
    let dataPage = elements.map((element) => {
        // console.log(element);

        //搜索到文章的标题
        let title = element.querySelector(".LC20lb");
        title !== null ? (title = title.innerText) : (title = null);

        // console.log(title);

        //搜索到文章的url
        let url = element.querySelector("a");
        url !== null ? (url = url.href) : (url = null);

        // console.log(url);

        //搜索到的文章的来源网站r.split(" - ")[1]
        let siteName = title;
        siteName !== null
            ? (siteName = siteName.split(" - ")[1])
        : (siteName = null);
        // console.log(siteName);

        //搜索到的文章的发布日期
        // let time = element.querySelector(".c-abstract>.newTimeFactor_before_abs"); //之前的query
        let time = element.querySelector(".MUxGbd.wuQ4Ob.WZ8Tjf > span");
        time !== null ? (time = time.innerText) : (time = null); //google几天前时间可以计算一下

        // console.log(time);

        //搜索到的文章的摘要
        let abstract = element.querySelector(
            ".VwiC3b.yXK7lf.MUxGbd.yDYNvb.lyLwlc.lEBKkf span:nth-child(2)"
        );
        abstract !== null ? (abstract = abstract.innerText) : (abstract = null);

        //搜索到关键词如果2023年05月25日更新到多语种
        let keyWords = Array.from(element.querySelectorAll("em"));
        keyWords !== null
            ? (keyWords = keyWords.map((item) => {
            return item.innerText;
        }))
        : (keyWords = null);
        // console.log(keyWords);

        let elementEach = {
            title,
            url,
            siteName,
            time,
            abstract,
            keyWords,
        };

        // console.log(elementEach);
        return elementEach;
    });

    console.log(dataPage);

    let keyWords = [];
    for (let i in dataPage) {
        let temp = dataPage[i].keyWords;
        keyWords = keyWords.concat(temp);
    }
    let keyWordsSet = Array.from(new Set(keyWords));

    let nodes = [];
    let links = [];
    let id = 0;

    let sanidstart = id;
    let sanNode = [];

    for (let j = 0; j < dataPage.length; j++) {
        sanNode.push({
            category: 4,
            id: "san" + j,
            name: dataPage[j].title,
            value: dataPage[j].abstract,
            origin: dataPage[j].siteName,
            time: dataPage[j].time,

            year:
            dataPage[j].time !== null &&
            dataPage[j].time.replace(/[^0-9\u4e00-\u9fa5]/gi, "") !== ""
            ? dataPage[j].time.replace(/[^0-9\u4e00-\u9fa5]/gi, "").substr(0, 4)
            : null,
            url: dataPage[j].url,
            //为了前面能找到,再加一条,也可以用这个循环,就少了一个!,这样资料全一些
            keyWords: dataPage[j].keyWords,
            type: "san",
        });
    }
    let keyidstart = id;
    let keyNode = [];
    for (let i = 0; i < keyWordsSet.length; i++) {
        if (keyWordsSet[i].length <= 4) {
            keyNode.push({
                category: 3,
                id: "key" + i,
                name: keyWordsSet[i],
                value: 30000 + i + "",
                type: "key",
            });
            //     !!! link 如果 keyNode.name 在dataPage.keywords li indexof 就连接(先写san)
            //    for (k)
            for (let j = 0; j < sanNode.length; j++) {
                //keywords是数组,不知道行不行,可以
                if (sanNode[j].keyWords.indexOf(keyWordsSet[i]) !== -1) {
                    links.push({
                        source: "key" + i,
                        target: "san" + j,
                        value: 1,
                    });
                }
            }
        }
    }

    let tagid = id;
    //2,tag,id=20000-29999,tag就是长度大于4的keywordsSet
    let tagNode = [];
    for (let i = 0; i < keyWordsSet.length; i++) {
        if (keyWordsSet[i].length > 4) {
            tagNode.push({
                category: 2,
                id: "tag" + i,
                type: "tag",
                name: keyWordsSet[i],
                value: id,
            });
            for (let j = 0; j < sanNode.length; j++) {
                //keywords是数组,不知道行不行,可以
                if (sanNode[j].keyWords.indexOf(keyWordsSet[i]) !== -1) {
                    links.push({
                        source: "tag" + i,
                        target: "san" + j,
                        value: 1,
                    });
                }
            }

            for (let j = 0; j < keyNode.length; j++) {
                //如果tagNode.name包含了keyNode.name(indexof),就连一条线
                if (keyWordsSet[i].indexOf(keyNode[j].name) !== -1) {
                    links.push({
                        source: "tag" + i,
                        target: keyNode[j].id,
                        value: 1,
                    });
                }
            }
        }
    }

    //1,id=10000,不能用10000+"",,只能用i+"".直接"10000"就好了
    let newsNode = {
        category: 1,
        id: "news",
        //searchtext在前面定义前面获取
        name: searchtext,
        value: id,
        type: "news",
    };
    //和key和tag都建立连接
    for (let i = 0; i < keyNode.length; i++) {
        links.push({
            source: "news",
            target: keyNode[i].id,
            value: 1,
        });
    }
    for (let i = 0; i < tagNode.length; i++) {
        links.push({
            source: "news",
            target: tagNode[i].id,
            value: 1,
        });
    }

    //    合并4个[],用concat(),
    nodes = nodes
        .concat(newsNode)
        .concat(tagNode)
        .concat(keyNode)
        .concat(sanNode);

    //data end

    return {
        nodes,
        links,
    };
}



















function renderD3Graph(nodes, links, graph) {
    // 获取 graph 元素的宽度和高度
    const width = parseInt(graph.style.width);
    const height = parseInt(graph.style.height);

    d3.selectAll("graph > *").remove();

    // // 创建 D3.js SVG 元素，并设置其大小和位置
    const bbox = graph.getBoundingClientRect();

    const svg = d3.select(graph).append("svg")
    .attr("id","graph-svg")
    .attr("width", bbox.width)
    .attr("height", bbox.height)
    .style("position", "fixed")
    .style("top", bbox.y + "px")
    .style("left", bbox.x + "px")
    .style("z-index", "999");


    //   const svg = d3
    // .select(graph)
    // .append("svg")
    // .attr("width", width)
    // .attr("height", height)
    // .style("position", "fixed")
    // .style("top", "0")
    // .style("right", "0")
    // .style("z-index", "999");

    function dragStarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragging(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragEnded(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    const simulation = d3
    .forceSimulation(nodes)
    .force(
        "link",
        d3
        .forceLink(links)
        .id((d) => d.id)
        .distance(50)
        .strength(1)
        .iterations(1)
    )
    .force("charge", d3.forceManyBody().strength(forceRate))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .alphaDecay(0.05);

    const link = svg
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke-width", (d) => Math.sqrt(d.value));

    const node = svg
    .append("g")
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    //        试着给每种type加一个class,要放在数据读取之后
    .attr("class", function (d) {
        // return "nodes";
        return "nodes " + d.type;
    })
    .attr("r", function (d) {
        //    make radius of node circle
        return sizes[d.category - 1]; // return r;
    })
    .attr("fill", function (d) {
        //    配合现在category从1开始,今后可以重新设计一下category make color of node circle,也可以加到后面,统一修改
        // console.log(d.category);
        return colors[d.category - 1];
    })
    .attr("stroke", "none")
    .attr("name", function (d) {
        //    make text of node
        return d.name;
    })

    .call(
        d3
        .drag()
        .on("start", dragStarted)
        .on("drag", dragging)
        .on("end", dragEnded)
    );

    //固定中心文章位置,用class来控制
    //固定中心文章位置,fx可以设置哈哈,或者大面积的可以用tick,详见https://stackoverflow.com/questions/10392505/fix-node-position-in-d3-force-directed-layout,实验证明,还可以用type属性来控制fx,fy

    svg
        .select(".news")
        .attr("fx", function (d) {
        return (d.fx = width / 2);
    })
        .attr("fy", function (d) {
        return (d.fy = height / 2);
    });

    //san文章点击, 没有name这个
    //存放三度文章size
    svg
        .selectAll(".san")
        .attr("r", function (d) {
        let uniqueWords = new Set(d.keyWords);
        let radius = uniqueWords.size * 10;
        // console.log("radius:", radius);
        return radius;
    })
        .style("fill-opacity", 0.5);

    //    显示所有的文本...
    const text = svg
    .append("g")
    .attr("class", "texts")
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("font-size", function (d) {
        // return d.size;
        let uniqueWords = new Set(d.keyWords);
        let radius = uniqueWords.size * 2;
        let fontSize = radius * sizes[d.category - 1];

        // console.log("d:", d, ";font-size return", fontSize);
        return fontSize;
    })
    .attr("fill", function (d) {
        // return "red";
        return colors[d.category - 1];
    })
    .attr("name", function (d) {
        return d.time;
    })
    .text(function (d) {
        return d.time ? d.time + d.name : d.name;
    })
    .attr("text-anchor", "center")
    .on("click", function (d) {
        if (d.url) {
            window.open(d.url, "_blank");
        }
    })
    .call(
        d3
        .drag()
        .on("start", dragStarted)
        .on("drag", dragging)
        .on("end", dragEnded)
    );

    //圆增加title...
    node.append("title").text(function (d) {
        return d.time + d.name;
    });


    /* //点击任意一个node, 不与之相连的节点和连线都变透明,怎么做

    可以在点击node事件处理函数中通过改变对应元素的透明度实现：

    获取点击的node的相邻节点
    对于不相邻的节点，修改其透明度
    对于不相邻的连线，修改其透明度
    代码示例： */

    var isTransparent = false;

    // 为每个node绑定点击事件
    node.on("click", function(d) {
        // 根据当前状态进行相应的操作
        if (!isTransparent) {
            link.style("opacity", function(l) {
                if (d === l.source || d === l.target) {
                    return 1;
                } else {
                    return 0.1;
                }
            });
            node.style("opacity", function(n) {
                // 只对与点击的圆圈不相关的圆圈透明度进行更改
                var linked = false;
                link.each(function(l) {
                    if (d === l.source || d === l.target) {
                        linked = true;
                        return;
                    }
                });
                if (!linked) {
                    return 0.1;
                } else {
                    return 1;
                }
            });
            isTransparent = true;
        } else {
            link.style("opacity", 1);
            node.style("opacity", 1);
            isTransparent = false;
        }
    });

    simulation.on("tick", () => {
        link
            .attr("x1", (d) => d.source.x)
            .attr("y1", (d) => d.source.y)
            .attr("x2", (d) => d.target.x)
            .attr("y2", (d) => d.target.y);

        node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
        text.attr("transform", function (d) {
            // return 'translate(' + d.x + ',' + (d.y + d.size / 2) + ')';
            return "translate(" + d.x + "," + (d.y + sizes[d.category - 1] / 2) + ")";
        });
    });
}































(function () {
    let button = document.createElement("button");
    button.innerHTML = "ViSearch";
    button.style.cssText =
        "position: fixed; top: 0; right: 0; z-index: 999; width: 100px; height: 50px; background-color: green; color: white; font-size: 20px;";

    // Add button to page
    document.body.appendChild(button);


    // Create graph element
    const graph = document.createElement("div");
    graph.style.position = "fixed"
    graph.style.top = "50px"
    graph.style.right = "0px"
    graph.style.width = "500px"
    graph.style.height = "500px"
    graph.style.background = "#fff"
    graph.style.border = "1px solid #ccc"
    graph.style.display = "none"
    graph.style.opacity = 0.9;


    // Add graph to page
    document.body.appendChild(graph);
    let graphVisible = false;

    // Toggle graph on button click
    button.addEventListener("click", () => {
        if (graphVisible) {
            graph.style.display = "none";
            graphVisible = false;
        } else {
            graph.style.display = "block";
            graphVisible = true;
            data = parseWebPage(searchtext);
            console.log("data", data);
            nodes = data.nodes;
            links = data.links;
            //remove the previous canvs
            d3.select("#graph-svg").remove();
            console.log("#graph-svg", d3.select("#graph-svg"));


            renderD3Graph(nodes, links, graph);
        }
    });

    // Hide graph on outside click
    document.addEventListener("click", (event) => {
        if (
            graphVisible &&
            event.target !== graph &&
            !graph.contains(event.target) &&
            event.target !== button
        ) {
            graph.style.display = "none";
            graphVisible = false;
        }
    });
})();
