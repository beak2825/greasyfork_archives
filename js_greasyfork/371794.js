// ==UserScript==
// @name         多瑙影院-自动显示电影、电视剧豆瓣评分(新版多瑙)
// @namespace    lejo
// @version      0.4
// @description  浏览多瑙影院时经常想要知道一部电影或者电视剧是否值得一看，我比较信赖豆瓣的评分，所以每次都需要手动去豆瓣查找。这款插件会自动在电影的页面显示该电影在豆瓣的评分，省去在豆瓣搜索的麻烦。
// @author       Lejo
// @include      http*://www.dnvod.tv*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/371794/%E5%A4%9A%E7%91%99%E5%BD%B1%E9%99%A2-%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E7%94%B5%E5%BD%B1%E3%80%81%E7%94%B5%E8%A7%86%E5%89%A7%E8%B1%86%E7%93%A3%E8%AF%84%E5%88%86%28%E6%96%B0%E7%89%88%E5%A4%9A%E7%91%99%29.user.js
// @updateURL https://update.greasyfork.org/scripts/371794/%E5%A4%9A%E7%91%99%E5%BD%B1%E9%99%A2-%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E7%94%B5%E5%BD%B1%E3%80%81%E7%94%B5%E8%A7%86%E5%89%A7%E8%B1%86%E7%93%A3%E8%AF%84%E5%88%86%28%E6%96%B0%E7%89%88%E5%A4%9A%E7%91%99%29.meta.js
// ==/UserScript==

if (typeof GM_xmlhttpRequest === "undefined") {
    alert("不支持Greasemonkey 4.x，请换用暴力猴或Tampermonkey");
    return;
}

// Send ajax
function getJSON(url, callback) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        headers: {
            'Accept': 'application/json'
        },
        onload: function (response) {
            if (response.status >= 200 && response.status < 400) {
                callback(JSON.parse(response.responseText), url);
            } else {
                callback(false, url);
            }
        }
    });
}

// Function to execute callback on a list of tasks
// Parameters:
// 1. tasks: a list of tasks
// 2. singleTaskHandler: a callback function, its first argument is a single element in variable tasks. The second argument is a callback function, which should be called when asyn operation is done
// 3. done: a callback function executed when all tasks has finished. If tasks has zero element, it will be executed immediately
function asyncExecTasks(tasks, singleTaskHandler, done) {
    if (tasks.length === 0) {
        setTimeout(done, 0)
        return
    }

    var counter = 0
    var singleTaskDone = function() {
        counter ++
        if (counter === tasks.length) {
            done()
            return
        }
    }

    tasks.forEach(function(task){
        singleTaskHandler(task, singleTaskDone)
    })
}

// Clean the fetched name, get rid of unsearchable substrings
function cleanName (name) {
    var redundantList = ['(枪版慎入)',
                         '(韩版听译)',
                         '-连载',
                         '(听译)']

    redundantList.forEach(function(redName) {
        var subIndex = name.indexOf(redName)
        if(subIndex !== -1) name = name.substring(0, subIndex)
    })

    var matched = name.match(/第(.*)季/g)
    if (matched !== null) {
        var matchedStr = matched[0]
        var subIndex = name.indexOf(matchedStr)
        if(subIndex !== -1) name = name.substring(0, subIndex)

        var seasonNr = matchedStr.substring(1,matchedStr.length-1)
        console.log(seasonNr)

        var mapping = {
            '1':'一',
            '2':'二',
            '3':'三',
            '4':'四',
            '5':'五',
            '6':'六',
            '7':'七',
            '8':'八',
            '9':'九',
            '10':'十',
            '11':'十一',
            '12':'十二',
            '13':'十三',
            '14':'十四',
            '15':'十五',
        }

        name = name + ' 第' + mapping[seasonNr] + '季'
    }
    return name
}

function updateDoubanInfo(){
    console.log(document.getElementsByClassName("video-detail"))
    var container = document.getElementsByClassName("video-detail")[0]
    if(!container) return
    var movieName = container.children[0].children[0].innerHTML

    console.log(movieName)

    movieName = cleanName(movieName)

    var div = document.createElement("DIV")
    div.innerHTML = '豆瓣评分： 读取中...'
    div.style.color = '#007722'
    div.id = 'douban-box'

    // Detect if the div already exists, if yes, then don't insert, just update
    var doubanBox = document.getElementById('douban-box');
    if(doubanBox){
        doubanBox.parentNode.removeChild(doubanBox);
    }
    container.insertBefore(div, container.children[1])

    getJSON('https://api.douban.com/v2/movie/search?q=' + movieName, function(response, url){
        console.log(response)
        var list = response.subjects
        var matchList = []
        // TODO: do more sophisticated things to narrow down possible candidates
        list.forEach(function(subject) {
            if (subject.title === movieName) {
                matchList.push(subject)
                return
            }
        })

        // If we only have an empty list, try to see if the first two items have an alternative name the same as movieName
        var testList = []
        if (matchList.length === 0) {
            testList = list.slice(0, 2)
        }
        asyncExecTasks(testList, function(subject, done) {
            getJSON('https://api.douban.com/v2/movie/subject/' + subject.id, function(response, url){
                response.aka.forEach(function(name){
                    if(movieName === name) matchList.push(response)
                })
                done()
            })
        }, function(){
            fetchDetails(div, matchList)
        })

        var fetchDetails = function(div, matchList) {
            asyncExecTasks(matchList, function(subject, done) {
                getJSON('https://api.douban.com/v2/movie/subject/' + subject.id, function(response, url){
                    console.log(response)
                    subject.ratings_count = response.ratings_count
                    done()
                })
            }, function(){
                populateDiv(div, matchList)
            })
        }

        // Populate div with content
        var populateDiv = function(div, matchList) {
            console.log(matchList)
            if (matchList.length === 0) {
                div.innerHTML = 'Sorry, 在豆瓣电影上找不到对应条目 (<a href="https://movie.douban.com/subject_search?search_text=' + movieName + '" target="_blank">查看豆瓣搜索列表<a>)'
                return
            }

            div.innerHTML = '在豆瓣电影上找到' + matchList.length + '个同名条目: (<a href="https://movie.douban.com/subject_search?search_text=' + movieName + '" target="_blank">查看豆瓣搜索列表<a>)<br \>'
            for(var i=0; i<matchList.length; i++) {
                div.innerHTML += (i + 1) + '. 演员: '

                for(var j=0; j<matchList[i].casts.length; j++) {
                    div.innerHTML += matchList[i].casts[j].name
                    div.innerHTML += (j < matchList[i].casts.length - 1) ? '/' : '; '
                    div.innerHTML += ' '
                }
                div.innerHTML += '评分: <b style="font-weight: bold;">' + matchList[i].rating.average + '</b>; '
                div.innerHTML += '评分人数: ' + matchList[i].ratings_count + ' '
                div.innerHTML += '(<a href="'+ matchList[i].alt + '" target="_blank">豆瓣专页</a>)<br />'
            }

        }

    })

}

var prevUrl = ''

setInterval(function(){
    if(window.location.href !== prevUrl) {
        prevUrl = window.location.href

        updateDoubanInfo()
    }
}, 1000)
