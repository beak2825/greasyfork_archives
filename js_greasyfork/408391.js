// ==UserScript==
// @name              知乎圈子点赞工具2
// @name:en           zhihu-like
// @namespace         http://sunzehui.github.io/
// @version           0.3
// @description       自动点击红心
// @description:en    auto like-btn click
// @author            sunzehui
// @match             *://*.zhihu.com/club/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/408391/%E7%9F%A5%E4%B9%8E%E5%9C%88%E5%AD%90%E7%82%B9%E8%B5%9E%E5%B7%A5%E5%85%B72.user.js
// @updateURL https://update.greasyfork.org/scripts/408391/%E7%9F%A5%E4%B9%8E%E5%9C%88%E5%AD%90%E7%82%B9%E8%B5%9E%E5%B7%A5%E5%85%B72.meta.js
// ==/UserScript==
async function sleep(time){
  return await new Promise(resolve=>{
    setTimeout(resolve,time)
  })
}
function hasClass(element, cls) {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }
//自动签到
    sleep(2000).then(function () {
        chicken_btn = document.querySelector("#root > div > main > div > div.ClubHeaderInfo > div.ClubHeaderInfo-container > div.ClubHeaderInfo-buttonGroup > button")
        chicken_btn.click()
    })

// 点红心
function likeClick(){
  return new Promise((resolve, reject) => {
        let elem = document.querySelector(`#root > div > main > div > div.Club-container > div.Club-mainColumn > div > div.ClubPostList > div > section:nth-child(2) > div.PostItem-footer > div > div.css-2imjyh > div`)
        console.log(elem)
        if (!hasClass(elem, "PostReactionItem-chosen")) {
            elem.click()
            resolve(true)
        }
        reject(false)  
  })
}


 //点关注
  function Follow() {
    return new Promise((resolve, reject) => {
        let elem = document.querySelector(`#root > div > main > div > div.Club-container > div.Club-mainColumn > div > div.ClubPostList > div > section:nth-child(2) > div.PostItem-head.PostItem-webHead > button > div`)
        if(elem!=null){
        elem.click()
        resolve(true)  
        }
      reject(false)
    })
  }
   //评论
    function commentClick(time) {
       return new Promise((resolve, reject) => {
           document.querySelector(`#root > div > main > div > div.Club-container > div.Club-mainColumn > div > div.ClubPostList > div > section:nth-child(2) > div.PostItem-footer > div > button`).click()
           resolve(true)
                
        })
     }


//点击展开
  function showAll(time) {
      return new Promise((resolve, reject) => {

        document.querySelectorAll(".CommentMoreReplyButton Button").forEach((res) => {
          res.click()
      })
      resolve(true)
  
        
      })
                         
  
}
//点击 赞
function zanClick(time) {
      
      return new Promise((resolve, reject) => {
              document.querySelectorAll(".CommentItemV2-likeBtn").forEach((res) => {
                  if (!hasClass(res, "is-liked")) {
                      res.click()
                  }
              })
              resolve(true)
    
            })
   
    
    }
    //关闭
  function closeClik(time) {
    
     return new Promise((resolve, reject) => {
     
       document.querySelector(".Modal-closeButton").click()
                    resolve(true)
       
       
            })

   
}
    //删除
  function deleteNode(time) {
  
    return new Promise((resolve, reject) => {
    
      document.querySelector(`#root > div > main > div > div.Club-container > div.Club-mainColumn > div > div.ClubPostList > div > section:nth-child(2)`).remove()

  
      if (document.querySelectorAll(`#root > div > main > div > div.Club-container > div.Club-mainColumn > div > div.ClubPostList > div > section`).length <= 2) {
                        window.scrollTo(0, 200000000)

        reject(false)
      }
                    resolve(true)
      
      
            
    })
    
    
}


async function executer(callback,print,T,F){
  try{
    await callback()
    print.call(null,T)
  }catch{
    print.call(null,F)
  }
}

async function main(){
  await executer(likeClick,console.log,"点红心成功啦！","点红心失败可能是已经点过");
  await sleep(100)
  await executer(Follow,console.log,"关注成功啦！","关注失败可能是已经关注了");
  await sleep(200)
  await executer(commentClick,console.log,"评论点击成功啦！","评论出错");
  await sleep(1000)
  await executer(zanClick,console.log,"点赞成功啦！","点赞失败可能已经点过");
  await sleep(1000)
  await executer(closeClik,console.log,"关闭窗口成功啦！","关闭出错");
  await sleep(200)
  await executer(deleteNode,console.log,"删除节点成功！","元素数量不足滑动刷新");
  

}
let interval;
    let isOn = false;
    let nav = document.querySelector("#root > div > main > div > div.ClubHeaderInfo > div.ClubHeaderInfo-container")
    let mybtn = document.createElement("button")
    mybtn.style = `width:200px;height:50px;background-color:white;color:#0084ff;font-size: 14px    width: 88px;
    height: 34px;
    border-radius: 5px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    background: #fff;
    font-weight: 600;`
    mybtn.innerHTML = "开始点赞"
    mybtn.addEventListener("click", (event) => {
        if (!isOn) {
            interval = setInterval(function () {
                main()
            }, 5000)
            isOn = true;
            thisTime = 5
            showTime = setInterval(function () {
                mybtn.innerHTML = thisTime.toString()
                thisTime--
            }, 1000)

            setTimeout(function () {
                clearInterval(showTime)
                mybtn.innerHTML = "结束点赞"
            }, 5000)


        } else {
            clearInterval(interval)
            isOn = false;

            mybtn.innerHTML = "开始点赞"
        }


    })
    nav.appendChild(mybtn)