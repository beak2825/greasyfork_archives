// ==UserScript==
// @name         添加手动操作指标窗口
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  try to take over the world!
// @author       You
// @match        *://*.growingio.com/projects/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20532/%E6%B7%BB%E5%8A%A0%E6%89%8B%E5%8A%A8%E6%93%8D%E4%BD%9C%E6%8C%87%E6%A0%87%E7%AA%97%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/20532/%E6%B7%BB%E5%8A%A0%E6%89%8B%E5%8A%A8%E6%93%8D%E4%BD%9C%E6%8C%87%E6%A0%87%E7%AA%97%E5%8F%A3.meta.js
// ==/UserScript==

var ejs = document.createElement("script");
ejs.src = "https://dev.ufilesec.ucloud.cn/echarts.min.js";
document.head.appendChild(ejs);
var result = document.createElement('div');

function renderChart(data) {
    result.style.height = "350px";
    var chart = echarts.init(result, 'macarons');
    var chartOpts = {
        legend: {
            data: data.data.map(function(d) {
                return d.label;
            })
        },
        tooltip : {
            trigger: 'axis'
        },
        toolbox: {
            show : true,
            feature : {
                dataView : {show: true, readOnly: false},
                saveAsImage : {show: true}
            }
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap : false,
                data: data.data[0].data.map(function(d) {
                    var t = new Date(d.x);
                    return (t.getMonth() + 1) + "/" + t.getDate();
                })
            }],
        yAxis: [{
            type: 'value'
        }],
        series: data.data.map(function(d) {
            return {
                name: d.label,
                type: 'line',
                smooth: true,
                data: d.data.map(function(v) {
                    return v.y;
                })
            };
        })
    };
    chart.setOption(chartOpts);
}

function fetchTags() {
    var url = window.gateway + "/_private/v2/projects/"+window.project.id+"/events";
    fetch2(url, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }}).then(function(res) {
        if (res.ok) {
            hideBar();
            res.json().then(function(tags) {
                console.log(tags);
                window._vds_tags = tags;
                window._vds_tag_map = {};
                tags.forEach(function(tag) {
                    window._vds_tag_map[tag.name] = tag;
                });
            });
        }
    });
}
var container = document.createElement("div");
container.style.width = '500px';
container.style.position = 'absolute';
container.style.fontFamily = 'monospace';
container.style.right = 0;
container.style.bottom = 0;
container.style.backgroundColor = 'white';
container.style.border = 'solid gray 2px';
container.style.transition = 'all ease 1s';
container.style.zIndex = 100;

container.addEventListener('mouseover', function(e) {
    if (e.target == container) {
        container.style.right = '0px';
    }
});

function hideBar() {
    container.style.right = -(container.clientWidth - container.clientHeight) + 'px';
}

container.addEventListener('mouseleave', function(e) {
    if (e.target == container && maxBtn.style.display == 'block') {
        hideBar();
    }
});


var tagContent = document.createElement("textarea");
tagContent.style.height = '400px';
tagContent.style.width = '100%';
tagContent.style.display = 'none';
container.appendChild(tagContent);
var fetchBtn = document.createElement('button');
var putBtn = document.createElement('button');
putBtn.textContent = 'update tag';
putBtn.className = 'ant-btn';
container.appendChild(putBtn);
putBtn.addEventListener('click', function(e) {
    var targetTagJson = JSON.parse(tagContent.value);
    if (targetTagJson.id) {
        fetch(location.href.replace(/.*\/projects/, "/projects") + '/' + targetTagJson.id, {
            method: 'PUT',
            body: JSON.stringify(targetTagJson)
        }).then(function(res) {
            if (res.ok) {
                result.textContent = 'updated!';
                res.json().then(function(newTag) {
                    window._vds_tag_map[newTag.name] = newTag;
                });
            }
        });
    }
});
var miniBtn = document.createElement('button');
miniBtn.className = 'ant-btn';
miniBtn.textContent = 'hide';
miniBtn.style.float = 'right';
miniBtn.style.display = 'none';
miniBtn.addEventListener('click', function(e) {
    tagContent.style.display = 'none';
    result.style.display = 'none';
    miniBtn.style.display = 'none';
    maxBtn.style.display = 'block';
});
var maxBtn = document.createElement('button');
maxBtn.textContent = 'show';
maxBtn.className = 'ant-btn';
maxBtn.style.float = 'right';
maxBtn.style.display = 'block';
maxBtn.addEventListener('click', function(e) {
    tagContent.style.display = 'block';
    result.style.display = 'block';
    maxBtn.style.display = 'none';
    miniBtn.style.display = 'block';
});
container.appendChild(miniBtn);
container.appendChild(maxBtn);

fetchBtn.className = 'ant-btn';
fetchBtn.textContent = 'fetch realtime data';
container.appendChild(fetchBtn);
result.style.backgroundColor = 'white';
result.style.fontFamily = 'monospace';
result.style.wordBreak = 'break-all';
container.appendChild(result);
document.body.appendChild(container);
console.log('start');
fetchBtn.addEventListener('click', function() {
    console.log('fetching');
    fetch(location.href.replace(/.*\/projects/, "/projects").replace('events', 'realtime'), {

        method: "POST",
        body: tagContent.value
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function(data) {
                result.textContent = JSON.stringify(data);
                if (echarts) {
                    renderChart(data);
                }
            });
        }
    }, function(e) {
        alert("Error submitting form!");
    });
});
document.addEventListener('click', function(e) {
    if (e.target.parentElement == container) return;
    setTimeout(function() {
        var showingTag = document.querySelector(".gr-measure-table__row--hoverd td:nth-child(2),.ant-table-expanded-row input");

        if (!showingTag) return;
        console.log("expanded tag element:", showingTag);
        try {
            /*var reactTagId = showingTag.getAttribute('data-reactid');
            var tagId;
            if (!reactTagId) {
                var viewportImg = showingTag.querySelector('img').src;
                var url = new URL(viewportImg);
                var curTag = _vds_tags.find((t) => {
                    return t.screenshot.viewport && t.screenshot.viewport == url.pathname;
                });
                if (curTag) {
                    tagId = curTag.id;
                } else {
                    return;
                }
            } else {
                tagId = reactTagId.replace(/[\.0-9]+\$(.*)-extra-row/, '$1');
            }
            */
            var name = showingTag.innerText || showingTag.value;
            var selectedTag = window._vds_tag_map[name];
            if (selectedTag) {
                tagContent.value = JSON.stringify(selectedTag, 0, 2);
                window.selectedTagName = selectedTag.name;
            }
        } catch (e) {
            console.log(e);
        }
    }, 100);
});
window.fetchTags = fetchTags;
window.fetch2 = fetch;
setTimeout(fetchTags, 1000);
console.log("fetching tags");