// ==UserScript==
// @name            历史记录（改）
// @description     原脚本历史记录功能的修改版
// @version         1.0.0
// @namespace       history_change
// @license         MIT
// @author          Pikaqian
// @match           *://www.pixiv.net/*
// @match           *://www.pixivision.net/*
// @icon            data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANv/bAEMAAwICAgICAwICAgMDAwMEBgQEBAQECAYGBQYJCAoKCQgJCQoMDwwKCw4LCQkNEQ0ODxAQERAKDBITEhATDxAQEP/bAEMBAwMDBAMECAQECBALCQsQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEP/AABEIAGQAZAMBIgACEQEDEQH/xAAdAAEAAgMBAQEBAAAAAAAAAAAABgcDBAUCAQgJ/8QALxAAAgEEAgEDAwMEAgMAAAAAAQIDAAQFEQYSIQcTMSJBURQVYSMycYEWMxdCkf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD+qdKw3bXSWsz2MEU1wqMYo5ZDGjvrwGYKxUE/JCnX4PxXF47y6HM3M+HyOPnxGatP++wuSCWXQIlhcfTNEdjTr8HasEcMgCQUpSgUqI8/z17jDiMNa28yRZu7NrcX6XEUS2UYQuznvIjkkKVBj7MpIJGgayYTnnpn7bYPBc347N+0ySY+SCDKQyNbywdFkhcBiVdO8YZT5Hdd62KCVUrwZoV12lQdjobYeTXrYPxQfaUpQKVHOac7wvBbFLzKR3d1LLto7Oxi965kjUr7six7BZY1YM2vJ+lVDO6I3ft7iC7gS5tZ45oZVDJJGwZWB+CCPBFBkpSlBqZW/wD2vHz34srq89lC3sWsfeWT+FXY2f8AdVpyPneUzuR4libL0lz9yuXvlaS6lnhtLvj4UNu7kjYllULtfpJ7+50IKswq1qjudzHFeG30Gbzt8lnNm7u0wtsW7M1xcSSEQxIigkkl3JIHhVZjpVJAduyiuoYPbvLlZ5AzakCddrvxsfkDQ/nW/G9Vw+YcztOLC0tTE097kTKttEpHj207NI43sRglFLAHTSRj/wBhWDnuWykHGRc8dMMoupUhlm911Mdu4PaSNkB+oeNeQPO9jxVYCFA5kO2dpJJSzEkl313bz92KqSfuQN/FBuZjI3WeZP3aQXSRSGSFZkRvbJO/B6j48f8AwVr7P5PivlKDXyOOssw1ucvbJfi0mS4t1uh7qwzISUkRW2EddnTAAj81PvTfldpcR5PHZHPSTT21yqqtywAhQQQj21bQ2PIfZJJMh8+NCE1iOAuc/eW9ljLXtflna3lLyRLEehDM0sasY9ptdked9fvQX3UJ9TvUUcDsrX9HaR32RvZ0ihtGcqzqWCkjQPwSPnxUqxGOXEYy3xwl90W6de/tqnb+eqgAf4AqrubZbD8g5D79pioHmxXu2IyPuq7MOymSNAu9KHXR2QQ0ZHXWiQ4l7krr9M19nMlJctDH2lnmYeAB5PgAAf4A/NWd6YcdHFeDY3ECExE+9ePE0AiaN7iZ52RlBIDKZSCd+SCfvUQ4HwqPlccHIuU4+aG3s70y2eOnV0JlhaRVll03SVDtXRCrKGRHDEhSts0ClKUCohzzk3p1jHtMDzzP4zFvkLe6uLWW9uUt+iRhIZXjlYgIwF0ibBDf1Tr71L6r7kfo7x/L3fK8jYQiwvOY4uPEX89oVgljXcoe6jkCMRcBJvDEHZhiB0BsBsc/vZcJ6cj/AIPZ482QhhhiWEhLeKx0AzRlPCqI/wC3r4+NVXWPvbDI2UN7jLyG7tZVBimhlEiOv5DAkGrmzHFMJnOOnit5atFjTHFEIbWVoOiRlSiq0ZBUDqBoaGvHx4qn/wDx9Z+mcp41i7q4uMcY47i2aa2VGBZesveVQBNK8qvM7aDbmG/kGg9UpSgVmsr26xt3Hf2bMJoSSoDlQ2xrR+xHn71hrBFdG5l6WUD3KqJDNJGy9YQjdCW2QT9f06UE7P4BICx+b8tNrgLKyt0Juc9FJEWhm6Nbx+0e8ynR2VZo1A8Hbg/Y1EeP41eQ5tMa9xasxH6i4ikkIkeAMA5UDz8sBv4G/wDFQrg1rl0w4veQQTwX8807GKW/N0UjMzso2YowpPbZVV0N6BIAq7vTzH28OG/cVVGkunYdwdnqp69f48g+KCS2lpa2FrFZWVvHBBAoSONF0qqPgAVmpSgUpSgVB+fZvI8MnvueXl5OnGcFxjKXuRjjAOpYfalRwPkt7az614/P2qcVy+UJgpeN5WLlDxLhpLKZMgZXKILYoRJ2YEFR1J2QRqgyces8ljsBjcfmckcjkLazhhurwoFNzMqAPL1HgdmBbQ/NcPnfGJ86LbIRX0kaY+C47QquxIWCFW/O19vWh8hj/FSsfFCARo0H5yj5PaPgpORSY/JW9nDYDIyG4s3iZYSASSGA/t7DsRtVAJJABI88T5Rb8pwmPzMcAtxkbZbmFDKre4hSOTsnwWQxzQOG0PEqbCttRb/P8ziuK29pm4eKw5jNQE22ORUjWWFZdCQ+43mKLQBcj5CgaJ0KgWZyF/ns2cxf3J6Rwfp7a0VVEVuCduwIUMzPpASxIAjXqq7YsGlNC9yDCuRNkQFlDrEZGfq6kxgfA7KGXZI1vYrVwNquMa/ubXHGxfISMHjluBdGODX/AFRyFVKISFYr52V2T5rfpQKkPpjZ5iwzcwwyxfs11LJNkUdyRHOUXTxj4DHS9l8Dz2+d75XHMPecqyX6XHNF+ktZgmQnLEGNSjHrH9JVpO3TanQAYk+QFNw4+wt8ZZxWNquo4lCjwAT/ACdeNn5NBs0pSgUpSgVFPVnFZvO+lnMcHxm2juMxkMBkLXHwysFSS5kt3WJWJ8AFyoJqV1oZ22zN5ibi24/lbfG5B1Agup7U3McZ2NkxB07eNjXYfO6DZtLmO8tYbuJJUSeNZFWWJo3AYbAZGAZT58ggEHwRWauXaZQwS2uKzNzajJ3JlMcUBZg6ITpvI2Pp6k78bJAJ+a0eN5rJZ7LZi9Rov2KB47PHkJ9c8sff9RMGDeYyzJGo6g7hdtsrroIZ6jKbjlccsiyqLW1Ecf8AUPRux2T1+NjQG6j1dLmMEo5zlrw3Ylhlito0jEaARlFPYdh9TE7B+r4+1c2gUpSgmfo+yWdpl8PHYLbxx3rXkbiZpDP731O5BUBPr7AKCfAB8b1Vh1UXDLq4teWY72LdpVuPdtpmNyyLFGUL9/bB6yN3jjUbGwGbRGyDbtApSlApSlArVylrc32NurKzyM2PuJ4Xiiu4URpLd2UgSKsishZSdgMpXY8gjxW1Sgg7cbg4jgl4/gbm6uMtnJ2SbI3U4kupHcD3bh2Lox6qPAj/ALNJ1XquhL8dj7XF2FvjbKMRwW0axRqPsoGhWcqpYMVBK/B15FeqCqOWcVlwF415FcQvZ3kjOiBCro5JLbO9MCT8+P8AfzXAqa+qhuWnxCwzIIkaZp0O+x2oCkfb53UKoFKUoMdxnG4xbzckTHZLIHFRte/o8ZAZ7u59sF/ahiBBkkfXVU2OxIGxur6qih81a3DOUwcrxs1xHG6T2NwbO5Vo2VfdCK/0k/3Aq6nY2Nkj5BoO/SlKBSlKBSlKBSlKCkOV8kvsp6ncg47cxQC2wltYm2dVIkPvo7OGJOiNqNaA/wB1gpSgUpSg+68bqbel7SRTZK3WT+jJ7c3t9FAEmtM2wOxJAUHZPhRrXnalBP6UpQKUpQf/2Q==
// @grant           GM_setClipboard
// @grant           GM_xmlhttpRequest
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_addValueChangeListener
// @grant           GM_listValues
// @grant           GM_deleteValue
// @grant           GM_download
// @require         https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/532306/%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%EF%BC%88%E6%94%B9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/532306/%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%EF%BC%88%E6%94%B9%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //tagCookie修改部分！！！请在``中输入标签内容；
    //输入“锁定锁定”
    var tagSave=`锁定锁定`//←←隐私
    var tagSaveSafe=`锁定锁定`//←←公开
    var tagProhibit=`锁定锁定`//←←屏蔽

    /*     window.addEventListener('keydown',function(e){
        if(e.keyCode==68){
            GM_setValue('tagProhibit','风景,風景');
            tagProhibit=GM_getValue('tagProhibit');
        }
    }) */

    if((tagSave!=GM_getValue('tagSave')&&tagSave!='锁定锁定')||(tagSaveSafe!=GM_getValue('tagSaveSafe')&&tagSaveSafe!='锁定锁定')||(tagProhibit!=GM_getValue('tagProhibit')&&tagProhibit!='锁定锁定')){
        if(tagSave!=GM_getValue('tagSave')&&tagSave!='锁定锁定'){
            GM_setValue('tagSave',tagSave)
        }
        if(tagSaveSafe!=GM_getValue('tagSaveSafe')&&tagSaveSafe!='锁定锁定'){
            GM_setValue('tagSaveSafe',tagSaveSafe)
        }
        if(tagProhibit!=GM_getValue('tagProhibit')&&tagProhibit!='锁定锁定'){
            GM_setValue('tagProhibit',tagProhibit)
        }
    }

    var match_rules=[
        /([_=:;&\-\/\.\?\d\w]+?illust_id=(\d+)(?:&|$|))/,
        /(http(?:s|):\/\/[_\-\/\.\d\w]+?\/(\d{4,})_p\d{1,4}[_\-\/\.\d\w]*)/
    ];
    let style = document.createElement('style'),rightButton,centerWrap,number=1,elem,deleteCookie,deleteAll,alert_count=0,morefunction,No1,No2,No3,No4,No5,visual_check="",No8,allBookmark=[],isProhibit
    var svg_re="M1023.914667 315.733333h10.325333l-3.754667 105.130667h-12.202666c-62.890667 0-128.597333 22.528-146.432 109.824V832h-117.333334V325.12h117.333334v91.050667C901.888 332.629333 964.778667 315.733333 1023.914667 315.733333z"
    var svg_cat="M851.633231 841.386667C696.753231 841.386667 606.641231 784.128 606.641231 578.56S696.753231 315.733333 851.633231 315.733333c52.565333 0 100.437333 6.570667 131.413333 16.896V433.066667c-36.608-14.08-74.154667-19.712-119.210667-19.712-97.621333 0-136.106667 36.608-136.106666 166.144 0 127.658667 37.546667 163.328 137.984 163.328 42.24 0 84.48-5.632 121.088-19.712v99.498666c-29.098667 9.386667-87.296 18.773333-135.168 18.773334z"
    var svg_moe="M859.989333 315.733333c116.394667 0 168.021333 58.197333 168.021334 175.530667V832h-117.333334V517.546667c0-71.338667-19.712-104.192-83.541333-104.192-56.32 0-93.866667 18.773333-108.885333 78.848V832h-117.333334V517.546667c0-71.338667-18.773333-104.192-81.664-104.192-56.32 0-91.050667 16.896-107.008 76.032V832h-117.333333V325.12h117.333333v60.074667C441.344 335.445333 488.277333 315.733333 555.861333 315.733333c78.848 0 122.965333 26.282667 145.493334 75.093334C730.453333 335.445333 789.589333 315.733333 859.989333 315.733333z"
    var same_img="", isChangingSrc=0

    document.body.appendChild(style);
    style.textContent=`
    #rightButton{
    height:21px;
    width:21px;
    border-bottom-right-radius:21px;
    border-top-right-radius:21px;
    color:#fff;
    padding:6px;
    opacity:.20;
    left:-20px;
    cursor:pointer;
    transform-origin:0px 17px;
    transition: 0.2s
    }


    #rightButton{
    position:fixed;
    z-index:10;
    font-size:14px}


    #rightButton{top:38%;background:#000}
    #deleteCookie{
    height:21px;
    width:21px;
    border-bottom-right-radius:21px;
    border-top-right-radius:21px;
    color:#fff;
    padding:6px;
    opacity:.20;
    left:-20px;
    cursor:pointer
    }


    #deleteCookie{
    position:fixed;
    z-index:10;
    font-size:14px;
    transform-origin:0px 17px;
    transition: 0.2s}


    #deleteCookie{top:45%;background:#000}

    #deleteAll{
    height:21px;
    width:21px;
    border-bottom-right-radius:21px;
    border-top-right-radius:21px;
    color:#fff;
    padding:6px;
    opacity:.20;
    left:-20px;
    cursor:pointer;
    transform-origin:0px 17px;
    transition: 0.2s
    }


    #deleteAll{
    position:fixed;
    z-index:10;
    font-size:14px}


    #deleteAll{top:57%;background:#f00}
    #morefunction{
    height:21px;
    width:21px;
    border-bottom-right-radius:21px;
    border-top-right-radius:21px;
    color:#fff;
    padding:6px;
    opacity:.20;
    left:-20px;
    cursor:pointer;
    transform-origin:0px 17px;
    transition: 0.2s
    }


    #morefunction{
    position:fixed;
    z-index:11;
    font-size:14px}


    #morefunction{top:52%;background:#000}

    .No{
    height:14px;
    width:14px;
    border-radius:21px;
    color:#fff;
    padding:6px;
    opacity:.0;
    left:-20px;
    cursor:pointer;
    position:fixed;
    z-index:10;
    font-size:14px;
    top:52%;
    background:#000;
    transition: 0.4s;
    transform-origin: 7px 40%;
    }

    #No1{
    height:14px;
    width:14px;
    border-radius:21px;
    color:#fff;
    padding:6px;
    opacity:.0;
    left:-20px;
    cursor:pointer;
    position:fixed;
    z-index:10;
    font-size:14px;
    top:52%;
    transition: 0.4s;
    background:#f00;
    transform-origin: 7px 40%;
    }



    #text{
    top:0%;
    background:#fff;
    color:black;
    opacity:.0;
    position:fixed;
    overflow:auto;
    z-index:3;
    left:-350px;
    width:280px;
    height:100%;
    border-radius:0px;
    transform-origin:-160px 0px;
    font-size:15px;
    padding-left:40px;
    padding-top:58px;
    line-height:30px;
    transition: 0.5s;
    }::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-thumb{background:rgba(117,117,117,0.7);}


  #blackcover{
    top:0%;
    background:#000;
    color:black;
    opacity:.0;
    position:fixed;
    overflow:auto;
    z-index:1;
    left:0px;
    width:100%;
    height:100%;
    transform-origin:0px 0px;
    display:none;
    transition: 0.5s
    }
    #covertitle{
    top:0%;
    background:none;
    color:black;
    opacity:.0;
    position:fixed;
    overflow:auto;
    z-index:5;
    left:-360px;
    width:150x;
    height:36px;
    transform-origin:-160px 0px;
    padding-top:27px;
    padding-right:130px;
    font-size:20px;
    transition: 0.5s
    }

    #pagenumber{
    top:34.7px;
    background:none;
    color:#606060;
    opacity:.0;
    position:fixed;
    z-index:5;
    left:-200px;
    width:50x;
    height:30px;
    font-weight:551;
    transform-origin:-160px 0px;
    font-size:10px;
    transition: 0.5s
    }

    #bigeye{
    height:37px;
    width:37px;
    color:#fff;
    opacity:.0;
    left:-154px;
    padding-top:25px;
    transition: 0.5s
    }

    #bigeye{
    position:fixed;
    z-index:4;}

    #bigeye{top:0px;background:none}
    #whitecover{
    height:65px;
    width:320px;
    box-shadow:0px 0px 60px #fff;
    opacity:.0;
    left:-300px;
    transition: 0.5s
    }

    #whitecover{
    position:fixed;
    z-index:3;}

    #whitecover{top:0px;background:#fff}

    #pages{
    top:32px;
    height:15px;
    width:15px;
    opacity:.0;
    left:-200px;
    position:fixed;
    z-index:5;
    transition: 0.5s
    }

    #bigImg{
    position:absolute;
    transform-origin:-160px 0px;
    opacity:1;
    transition: 0.3s;
    z-index: 2;
    }
    #bigImg_1{
    position:absolute;
    opacity:1;
    z-index: 2;
    }



    #slider{
    width:140px;
	outline:none;
	border-radius:3px;
	left:10px;
	top:72%;
	position:fixed;
	-webkit-appearance:button;
    cursor: pointer;
    transition: 0.3s;
    opacity:0;
    }

    #slider_box{
    width: 23px;
    text-align: center;
    font-size: 13px;
    line-height: 23px;
    height: 23px;
    left: 10px;
    top: 74.6%;
    position: fixed;
    border-radius: 6px;
    cursor: pointer;
    background-color: #cbcbcb;
    opacity:0;
    transition: 0.3s;
    }



    #path14{
    transition:0.3s
    }
    #explodeFinish{
    position: fixed;
    bottom: 10px;
    left: 10px;
    font-size: 17px;
    background-color: black;
    color: white;
    padding-top: 8px;
    padding-bottom: 8px;
    padding-left: 12px;
    padding-right: 12px;
    border-radius: 10px;
    opacity: 0;
    transition: 0.2s
    }
    #insideText{
    cursor:pointer
    }
    #visual_img{
    position:fixed;
    z-index:10000;
    width:150px;
    }


    #add{
    top: 31.2%;
    left: 86.8%;
    position: absolute;
    background-color: white;
    border-radius: 16px;
    transition: 0.2s;
    }
    #add_text_all{
    position: absolute;
    top: 32.5%;
    left: 89%;
    width: 63px;
    height: 108px;
    display: flex;
    flex-direction: column;
    }
    .add_text{
    height: 25%;
    font-size: 13px;
    font-weight: 550;
    position: relative;
    transition: 0.2s;
    opacity: 0;
    cursor: pointer;
    z-index: 1;
    }
    #add_cover{
    top: 31.2%;
    left: 86.8%;
    width:32px;
    height:32px;
    position: absolute;
    background-color: white;
    border-radius: 16px;
    cursor:pointer;
    transition: 0.2s;
    opacity:0;
    z-index:1;
    }


    #link{
    top: 85.7%;
    left: 86.8%;
    position: absolute;
    background-color: whitesmoke;
    border-radius: 16px;
    transition: 0.2s;
    z-index: 1;
    display: flex;
    background-color: rgb(241, 240, 240);
    width: 32px;
    height: 32px;
    justify-content: center;
    align-items: center;
    border-radius: 16px;
    }
    #user_link_num{
    font-size: 16px;
    font-weight: 550;
    transition: all 0.5s ease 0s;
    }
    #link_text_all{
    position: absolute;
    top: 85.7%;
    left: 89%;
    width: 63px;
    height: 108px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin-left: 40px;
    }
    .link_text{
    font-size: 14px;
    font-weight: 550;
    position: relative;
    transition: 0.2s;
    opacity: 0;
    cursor: pointer;
    z-index: 1;
    margin-bottom: 10px;
    margin-top: 20px;
    }
    #user_link_add{
    position: relative;
    top: 0px;
    padding-left: 9px;
    font-size: 24px;
    font-weight: 550;
    color: black;
    z-index: 1;
    margin-top: 12px;
    opacity: 0;
    cursor: pointer;
    }
    #link_cover{
    width:32px;
    height:32px;
    position: absolute;
    background-color: white;
    border-radius: 16px;
    cursor:pointer;
    transition: 0.2s;
    opacity:0;
    z-index:2;
    }
    #link_num{
    background-color: whitesmoke;
    width: 32px;
    height: 32px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 16px;
    font-weight: 550;
    font-size: 15px;
    }



    #check{
    border-radius: 20px;
    height: 24px;
    position: fixed;
    top: 165px;
    width: 118px;
    left: 16px;
    outline: 0;
    border: none;
    background-color: #000;
    opacity: 0;
    transition: 0.2s;
    }
    #checkInput{
    border: none;
    width: 85px;
    height: 15px;
    left: 32px;
    top: 169px;
    position: fixed;
    background-color: #000000;
    color: white;
    cursor: text;
    font-weight:550;
    opacity:0;
    transition: 0.2s;
    }
    #checkInput:focus{
    outline:0;
    }



    #tag_view_out{
    opacity: 0;
    border-radius: 10px;
    width: 300px;
    height: 140px;
    position: fixed;
    top: 264px;
    left: 152px;
    z-index: 100;
    font-size: 17px;
    padding: 13px;
    overflow: hidden;
    transition: 0.3s;
    }

    #tag_view_text{
    left: 5px;
    top: -3px;
    position: relative;
    border:0;
    outline:none;
    width: 281px;
    height: 130px;
    transition: 0.3s;
    font-Weight:551;
    resize: none;
    }

    #help{
    cursor: pointer;
    left: 293px;
    position: relative;
    top: -6px;
    }

    #spin{
    cursor: pointer;
    left: 277px;
    position: relative;
    top: -30px;
    transform: rotate(0deg);
    transform-origin: 8px 8px;
    transition: 0.5s;
    }

    title{
    display:block;
    }

    .lock_svg{
    cursor: pointer;
    left: 295px;
    position: relative;
    top: -77px;
    }

    #trash{
    cursor: pointer;
    left: 295px;
    position: relative;
    top: -126px;
    }
    #userImgBack{
    width: 100%;
    height: 60%;
    position: fixed;
    top: 40%;
    background-color: #000;
    opacity:1;
    overflow: auto;
    justify-content: center;
    display: flex;
    z-index: 2;
    }
    #userImgUl{
    display:flex;
    flex-wrap: wrap;
    justify-content: center;
    top: 20px;
    position: relative;
    z-index: 2;
    }
    .userImgAll{
    width: 180px;
    height: 210px;
    background-color: none;
    margin: 29px;
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    z-index: 2;
    }
    .userImgPic{
    width: 180px;
    height: 180px;
    position: relative;
    cursor: pointer;
    border-radius: 8px;
    z-index: 2;
    }
    .userImgText{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #fff;
    cursor: pointer;
    top: 12px;
    position: relative;
    z-index: 2;
    }
    #userImgTitle{
    position: fixed;
    width: 100px;
    height: 30px;
    display: flex;
    top: 42%;
    font-size: 20px;
    font-weight: 550;
    color: #fff;
    justify-content: center;
    z-index: 2;
    }
    #userImgTitleBackground{
    background-color: #000;
    position: fixed;
    width: 100%;
    height: 63px;
    z-index: 2;
    opacity: 0.75;
    }
    #userImgCross{
    position: fixed;
    z-index: 2;
    right: 30px;
    top: 42%;
    cursor: pointer;
    }

    .userPageAll{
    position: relative;
    top: 22px;
    left: 141px;
    background-color: black;
    opacity: 0.55;
    width: 32px;
    height: 18px;
    z-index: 3;
    border-radius: 16px;
    }
    .userImgR18{
    color: white;
    background-color: red;
    height: 16px;
    line-height: 16px;
    padding: 0px 6px;
    border-radius: 5px;
    text-align: center;
    font-size: 10px;
    font-weight: 550;
    display: flex;
    align-content: center;
    justify-content: flex-end;
    position: relative;
    top: 23px;
    left: 7px;
    z-index: 3;
    }

    #userImgPageSvg{
    z-index: 3;
    stroke: none;
    fill: currentcolor;
    width: 9px;
    line-height: 0;
    font-size: 0px;
    vertical-align: middle;
    position: relative;
    left: 5px;
    top: 4px;
    }

    .userPageText{
    color: white;
    font-size: 10px;
    font-weight: 550;
    display: flex;
    align-content: center;
    justify-content: flex-end;
    position: relative;
    top: -20px;
    left: -6px;
    }

    #user_svg{
    position: relative;
    top: -53px;
    left: 80px;
    z-index: 1;
    cursor: pointer;
    opacity: 0.5;
    }
    #user_svg_background{
    width: 20px;
    height: 20px;
    opacity: 0;
    z-index: 2;
    position: relative;
    top: -73px;
    left: 80px;
    cursor: pointer;
    }
    .history_textOut{
    display: flex;
    flex-direction: row;
    height: 20%;
    width: 100%;
    transform: translateY(30px);
    align-items: center;
    }
    .history_img{
    position: relative;
    height: 65%;
    left: 65px;
    }
    .history_title{
    transform: translateX(120px);
    width: 380px;
    font-weight: 550;
    cursor:pointer;
    }

    #history_all{
    position: fixed;
    width: 50%;
    height: 85%;
    top: 7.5%;
    left: 25%;
    background-color: #f5f5f5;
    border-radius: 6px;
    transform-origin: -340px 245px;
    transform: scale(0.01);
    transition: 0.5s;
    }
    #history_bigTitle{
    height: 9%;
    width: 100%;
    position: absolute;
    background-color: #d1d1d17d;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    }
    #history_bigTitleText{
    cursor: default;
    color: #000;
    opacity: 0.6;
    text-align: center;
    font-size: 22px;
    font-weight: 550;
    }
    #history_back{
    overflow: auto;
    position: relative;
    background-color: #f5f5f5;
    width: 100%;
    height: 81%;
    top: 9%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    border-radius: 6px;
    }
    .history_date{
    display: flex;
    justify-content: center;
    padding-top: 5%;
    padding-bottom: 2%;
    font-size: 20px;
    font-weight: 550;
    height: 20%;
    width: 100%;
    transform: translateY(30px);
    cursor: default;
    }
    #history_pageBack{
    top: 91%;
    height: 9%;
    width: 100%;
    position: absolute;
    background-color: #d1d1d17d;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    }
    .history_page{
    padding-left: 1px;
    padding-right: 1px;
    cursor: pointer;
    }
    #history_pageNum{
    cursor: pointer;
    font-size: 16px;
    font-weight: 550;
    opacity: 0.7;
    }
    #history_close{
    position: fixed;
    left: 91%;
    transition: all 0.25s ease 0s;
    cursor: pointer;
    }
    #history_clear{
    position: fixed;
    left: 83%;
    transition: all 0.25s ease 0s;
    cursor: pointer;
    }
    #history_visible{
    position: fixed;
    left: 75%;
    transition: all 0.25s ease 0s;
    cursor: pointer;
    }
    #history_delete{
    left: 140px;
    position: relative;
    cursor: pointer;
    opacity: 0;
    transition: 0.2s;
    }
    #history_R18{
    opacity: 1;
    background-color: rgb(255, 255, 255, 0);
    left: 20%;
    position: fixed;
    }
    #sort_ul{
    gap: 24px;
    position: relative;
    left: -3%;
    display: flex;
    flex-wrap: wrap;
    width: 1224px;
    }
    .sort_img{
    width: 184px;
    border-radius: 7px;
    }
    .sort_text_div{
    width: 184px;
    display: flex;
    flex-direction: column;
    position: relative;
    top: 6px;
    }
    .sort_li{
    display: flex;
    flex-direction: column;
    }
    .sort_img_name{
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    font-weight: 550;
    }
    .sort_author_name{
    position: relative;
    top: -5px;
    }
    .sort_R18{
    padding: 0px 6px;
    border-radius: 3px;
    color: rgb(255, 255, 255);
    background: rgb(255, 64, 96);
    font-weight: bold;
    font-size: 10px;
    line-height: 16px;
    user-select: none;
    }
    .sort_page{
    }
    .sort_up{
    position: absolute;
    width: 184px;
    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;
    }
    #sort_page_path{
    transform: scale(1.1) translate(0px, 3px);
    }
    .sort_page_number{
    transform: translate(0px, 3px);
    }
    .sort_R18{
    padding: 0px 6px;
    border-radius: 3px;
    color: rgb(255, 255, 255);
    background: rgb(255, 64, 96);
    font-weight: bold;
    font-size: 10px;
    line-height: 16px;
    user-select: none;
    }
    #sort_more_out{
    display: flex;
    justify-content: center;
    margin: 40px auto 0px;
    padding: 0px 0px 64px;
    }
    #sort_more_background{
    cursor: pointer;
    background-color: black;
    color: white;
    width: 350px;
    height: 40px;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    }
    #sort_more_text{
    font-weight: 550;
    font-size: 19px;
    }
    .sort_down{
    border-radius: 5px;
    background-color: rgba(255,255,255,1);
    position: absolute;
    transform: translate(5px, -23px);
    }
    .sort_bookmark{
    margin-left: 6px;
    margin-right: 6px;
    font-weight: 550;
    }
    .sort_love_button{
    background: none;
    border: none;
    width: 40px;
    height: 40px;
    position: relative;
    top: -86px;
    left: 145px;
    cursor: pointer;
    }
    .sort_gif{
    width: 48px;
    height: 48px;
    transform: translate(-115px, 70px);
    position: absolute;
    stroke: none;
    line-height: 0;
    font-size: 0px;
    vertical-align: middle;
    }
    .sort_gif_circle{
    fill: rgba(0, 0, 0, 0.32);
    transform: scale(2);
    }
    .sort_gif_path{
    fill: rgb(255, 255, 255);
    transform: scale(2);
    }
    #load_count_div{
    display: flex;
    position: fixed;
    height: 34px;
    top: 95%;
    left: 2%;
    background-color: rgba(0,0,0,0.2);
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    transition: 0.5s;
    }
    #load_count_text{
    font-size: 20px;
    font-weight: 550;
    color: black;
    margin-left: 20px;
    margin-right: 20px;
    }
    #sort_out_div{
    display: flex;
    width: 162px;
    height: 30px;
    position: fixed;
    top: 670px;
    left: 20px;
    background-color: rgba(0,0,0,0.2);
    border-radius: 15px;
    align-items: center;
    justify-content: space-around;
    }
    .sort_input{
    outline: none;
    border: 0;
    font-size: 15px;
    font-weight: 550;
    width: 30px;
    height: 20px;
    border-radius: 4px;
    position: relative;
    background-color: unset;
    text-align: center;
    }
    #sort_input_text{
    font-weight: 550;
    position: relative;
    left: 2px;
    }
    #sort_start{
    width: 1em;
    height: 1em;
    vertical-align: middle;
    fill: currentColor;
    overflow: hidden;
    position: relative;
    left: -6px;
    transform: scale(1.6);
    cursor: pointer;
    top: -1px;
    }

    #userImgGif{
    position: relative;
    top: -83px;
    left: 78px;
    z-index: 3;
    transform: scale(2);
    }

    #loveTagView{
    position: fixed;
    left: 1%;
    bottom: 5%;
    background-color: black;
    width: 9%;
    height: auto;
    border-radius: 5px;
    color: white;
    display: flex;
    padding: 6px;
    opacity: 0;
    transition: 0.5s;
    }

    #link_add{
    height: 32px;
    width: 32px;
    border-radius: 25px;
    position: absolute;
    z-index: 0;
    font-size: 30px;
    font-weight: 550;
    background-color: whitesmoke;
    display: flex;
    justify-content: center;
    top: 85.7%;
    left: 86.8%;
    transition: 0.5s;
    opacity: 0;
    cursor: pointer;
    margin-left: 0px;
    }
    `;

    //初始化、预设各个cookie
    if(getCookie("slider")==""){
        setCookie("slider",1,90)
    }
    if(getCookie("preImg")==""){
        setCookie("preImg",0,90)
    }
    if(getCookie("R-18_block")==""){
        setCookie("R-18_block",0,90)
    }
    if(getCookie("aside")==""){
        setCookie("aside","2,false",90)
    }
    if(getCookie("tagCookie")==""){
        setCookie("tagCookie","",90)
    }
    if(getCookie("tagCookieSafe")==""){
        setCookie("tagCookieSafe","",90)
    }
    if(getCookie('tagCookieSetting')==''){
        setCookie('tagCookieSetting',0,90)
    }
    if(getCookie('tagCookieType')==''){//0为使用cookie中的正则，1为使用代码中的正则，无法直接修改
        setCookie('tagCookieType',0,90)
    }
    if(document.cookie.length<7000){
        setCookie('Size',0,90)
    }
    if(document.cookie.length>=7000&&document.cookie.length<7650){
        setCookie('Size',1,90)
    }
    if(document.cookie.length>=7650){
        setCookie('Size',2,90)
    }
    if(getCookie('svgTitle')==''){//此cookie只能手动到F12修改
        setCookie('svgTitle',1,90)//1为开启，0为关闭
    }
    if(getCookie('bigGif')==''){//动图预览
        setCookie('bigGif',0,90)//1为开启，0为关闭
    }
    if(getCookie('history_R18')==''){//历史R-18显示
        setCookie('history_R18',0,90)//0为隐藏，1为显示
    }
    if(getCookie('unfold')==''){//自动展开
        setCookie('unfold',0,90)//0为关闭，1为打开
    }
    if(getCookie('singleSort')==''){//单页排序
        setCookie('singleSort',0,90)//0为关闭，1为打开
    }
    if(GM_getValue("pixiv_user_outLink")==null){
        var outLink='{}'
        GM_setValue("pixiv_user_outLink",JSON.parse(outLink))
    }
    if(GM_getValue("tagSave")==null){
        GM_setValue("tagSave","")
    }
    if(GM_getValue("tagSaveSafe")==null){
        GM_setValue("tagSaveSafe","")
    }
    if(GM_getValue("tagProhibit")==null){
        GM_setValue("tagProhibit","")
    }


    setCookie("outUrl",2,90)//暂时强制设置为2（moe）



    function pictureSize(element){
        var mouseX=event.clientX
        var mouseY=event.clientY
        var wide=element.clientWidth
        var hight=element.clientHeight
        var pagewide=document.documentElement.clientWidth
        var pagehight=document.documentElement.clientHeight
        var w1=wide/pagewide
        var h1=hight/pagehight
        if(w1<=h1){
            element.style.height=pagehight-mouseY+"px"
        }
        else{
            element.style.width=pagewide-mouseX+"px"
        }
        event.preventDefault()
    }
    //————————————————————————————————删除cookie
    function delCookie(name){
        var date = new Date();
        date.setTime(date.getTime() - 10000);
        document.cookie = name + "=a; expires=" + date.toGMTString()+";path=/";
    }
    /*
    function downloadIamge(imgsrc, name) {
        let image = new Image();
        image.setAttribute("crossOrigin", "anonymous");
        image.onload = function() {
            let canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            let context = canvas.getContext("2d");
            context.drawImage(image, 0, 0, image.width, image.height);
            let url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
            let a = document.createElement("a"); // 生成一个a元素
            let event = new MouseEvent("click"); // 创建一个单击事件
            a.download = name || "photo"; // 设置图片名称
            a.href = url;
            a.dispatchEvent(event);
        };
        image.src = imgsrc;
        event.preventDefault()
    }
    */
    function downloadIamge(imgsrc, name){
        if(name==''){
            name='photo'
        }
        GM_download(imgsrc,name)
    }
    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
    function lastcookie(){
        var matchrule=/pixivid/
        var cookie_separate=document.cookie.split(";")
        for(var r=0;r<cookie_separate.length;r++){
            if(cookie_separate[r].match(/pixivid/)!=null){
                var results=cookie_separate[r].match(/pixivid/)
                var results_1=cookie_separate[r].split("=")[0].split("d")[1]
                }
            else{
                continue
            }
        }
        if(results==null){
            return 0
        }
        else{
            return parseInt(results_1)+1
        }
    }

    function getelemt(findelement){
        //——————————————————————————
        var elem_1 = document.getElementsByTagName("svg");
        for(var h=0;h<elem_1.length;h++){
            var match_result=elem_1[h].id.match(findelement)
            if(match_result!=null){
                return elem_1[h]
                break
            }
        }
        //——————————————————————————
    }
    function retract(){
        var cookie_retract=getCookie("pixiv_preurl")
        var retract_num=lastcookie()
        var new_cookieNum=-1
        var new_cookieNum_1=1
        if(cookie_retract.substr(cookie_retract.length-1,1)!=","){
            new_cookieNum_1=0
        }
        for(var j=0;j<cookie_retract.split(",").length-new_cookieNum_1;j++){
            if(j>0&&cookie_retract.split(",")[j].match(cookie_retract.split(",")[j-1].match(/\d{6,10}/)[0])!=null){
                setCookie("pixivid"+new_cookieNum,getCookie("pixivid"+new_cookieNum)+","+cookie_retract.split(",")[j],-1)
            }
            else{
                setCookie("pixivid"+(new_cookieNum+1),cookie_retract.split(",")[j],-1)
                new_cookieNum++
            }
            retract_num++
        }
        delCookie("pixiv_preurl")
        return 0
    }
    //————————————————————————————————————————————————核爆·用户页面图片下载
    function user_savepicture(){
        getFinalUrl(2,"-1",-1)
    }
    function visualImg(event){
        if(event.target.localName.match(/text\d{1,3}/)!=null){
            var offT=event.target.offsetTop
            var offL=event.target.offsetLeft
            var imgId=event.target.innerText
            if(imgId.match("-")!=null){
                window.open("https://pixiv.re/"+imgId+".png","block")
            }
        }
    }
    var visual_out=1
    function visualPic(event){
        if(event.target.localName.match(/text\d{1,3}/)!=null){
            if(visual_out==1){
                visual_out=0
                if(document.getElementsByClassName("visual_img")!=null){
                    for(var re=0;re<document.getElementsByClassName("visual_img").length;re++){
                        document.getElementsByClassName("visual_img")[re].remove()
                    }
                }
                visual_check=event.target.localName.match(/text\d{1,3}/)[0]
                var visual_page=event.target.innerText.split("-")[1]
                var visual_pid=event.target.innerText.match(/\d{6,10}/)[0]
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://www.pixiv.net/artworks/"+visual_pid,
                    headers:{
                        "User-Agent": navigator.userAgent,
                    },
                    onload: function(res) {
                        if(res.status === 200){
                            //console.log('成功')
                            var p=res.responseText
                            var visual_url=p.substring(p.match('"thumb":"').index+9,p.match('","small":"').index)
                            if(event.target.innerText.match("-")!=null){
                                var visual_url_new=visual_url.split("_p0_")[0]+"_p"+(parseInt(visual_page)-1)+"_square1200.jpg"
                                }
                            else{
                                visual_url_new=visual_url.split("_p0_")[0]+"_p0_square1200.jpg"
                            }
                            var visual_img=document.createElement("img")
                            visual_img.id="visual_img"
                            visual_img.style.left="160px"
                            visual_img.style.top=(event.screenY-78)+"px"
                            visual_img.src=visual_url_new
                            visual_img.className="visual_img"
                            document.body.appendChild(visual_img)
                        }}})
            }
        }
        else{
            visual_out=1//移出id显示范围
            var visual_remove=document.getElementsByClassName("visual_img")
            if(visual_remove.length!=0){
                for(re=0;re<visual_remove.length;re++){
                    visual_remove[re].remove()
                }
            }
        }
    }

    function transform(className,transform){
        var elements=document.getElementsByClassName(className)
        for(var tr=0;tr<elements.length;tr++){
            elements[tr].style.transform=transform
        }
    }

    function focusOpacity(element){
        element.onmouseleave=function(){
            element.style.opacity='0.2'
        }
        element.onmouseenter=function(){
            element.style.opacity='0.4'
        }
    }

    function removeRepeatArrElement(arr){
        var obj = {};
        var newArr = [];
        var len = arr.length;
        for(var i=0; i<len; i++){
            if(!obj[arr[i]]){
                newArr.push(arr[i]);
                obj[arr[i]] = true;
            }
        }
        return newArr;
    }

    function loveTagView(tag){
        var a=document.createElement('a')
        a.id='loveTagView'
        var tag_removed=removeRepeatArrElement(tag)
        a.innerText=tag_removed
        document.body.appendChild(a)
        setTimeout(function(){
            a.style.opacity=1
        },250)
        setTimeout(function(){
            a.style.opacity=0
        },1250)
        setTimeout(function(){
            a.remove()
        },1750)
    }
    //————————————————————————————————————————————————
    function addAllButton () {
        var divNew=document.createElement("div")
        divNew.setAttribute("id","divnew")
        document.body.appendChild(divNew)


        if(getCookie('svgTitle')==1){
            var rightButton_title_text='下载全部链接'
            var deleteCookie_title_text='历史记录'
            var morefunction_title_text='更多功能'
            var No1_title_text='清空链接'
            var No2_title_text='核爆'
            var No3_title_text='储存链接预览'
            var No4_title_text='删除/回溯'
            var No5_title_text='预览图'
            var No6_title_text='链接打开上限'
            var No7_title_text='R-18模糊'
            var No8_title_text='代理网站切换'
            var No9_title_text='标签查询'
            var No10_title_text='自动添加标签'
            var No11_title_text='作者作品下载'
            var No12_title_text='搜索结果排序'
            var No13_title_text='自动多图展开'
            }
        else{
            rightButton_title_text=''
            deleteCookie_title_text=''
            morefunction_title_text=''
            No1_title_text=''
            No2_title_text=''
            No3_title_text=''
            No4_title_text=''
            No5_title_text=''
            No6_title_text=''
            No7_title_text=''
            No8_title_text=''
            No9_title_text=''
            No10_title_text=''
            No11_title_text=''
            No12_title_text=''
            No13_title_text=''
        }


        rightButton = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        var path2 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        rightButton.setAttribute("aria-hidden","true");
        rightButton.setAttribute('viewbox', '0 0 24 24');
        rightButton.setAttribute('width', '24px');
        rightButton.setAttribute('height', '24px');
        path2.setAttribute('d','M 10 4 L 12 4 L 12 19 L 10 19 Z M 4 11 L 5 11 L 10 16 L 10 19 L 4 13 Z M 18 11 L 17 11 L 12 16 L 12 19 L 18 13 Z')
        path2.setAttribute('fill', '#fff');
        rightButton.appendChild(path2);
        rightButton.id = 'rightButton';
        var rightButton_title=document.createElement('div')
        rightButton_title.id='rightButton_title'
        rightButton_title.title=rightButton_title_text
        document.getElementById('divnew').appendChild(rightButton_title)
        document.getElementById("rightButton_title").appendChild(rightButton);

        deleteCookie = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        var path3 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        deleteCookie.setAttribute("aria-hidden","true");
        deleteCookie.setAttribute('viewbox', '0 0 24 24');
        deleteCookie.setAttribute('width', '24px');
        deleteCookie.setAttribute('height', '24px');
        path3.setAttribute('d','M538.87104 32c-128 0-243.2 51.2-332.8 128L110.07104 57.6c-12.8-12.8-32-6.4-38.4 6.4L1.27104 422.4c-6.4 12.8 12.8 32 25.6 25.6l339.2-70.4c19.2-6.4 25.6-25.6 12.8-38.4L295.67104 256c64-57.6 147.2-96 243.2-96C737.27104 160 897.27104 320 897.27104 512s-160 352-358.4 352c-153.6 0-281.6-89.6-332.8-217.6l-115.2 57.6c76.8 172.8 249.6 294.4 448 294.4 268.8 0 486.4-217.6 486.4-480C1025.27104 249.6 807.67104 32 538.87104 32zM615.67104 300.8h-57.6c-12.8 0-25.6 12.8-25.6 32V512H353.27104c-19.2 0-32 12.8-32 25.6v51.2c0 12.8 12.8 25.6 32 25.6h262.4c6.4 0 12.8 0 19.2-6.4 0-6.4 6.4-12.8 6.4-19.2v-256c0-19.2-12.8-32-25.6-32z')
        path3.setAttribute('fill', '#fff');
        path3.style.transform="scale(0.018) translate(0px, 60px)"
        deleteCookie.appendChild(path3);
        deleteCookie.id = 'deleteCookie';
        var deleteCookie_title=document.createElement('div')
        deleteCookie_title.id='deleteCookie_title'
        deleteCookie_title.title=deleteCookie_title_text
        document.getElementById('divnew').appendChild(deleteCookie_title)
        document.getElementById("deleteCookie_title").appendChild(deleteCookie);
        morefunction = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        var path5 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        morefunction.setAttribute("aria-hidden","true");
        morefunction.setAttribute('viewbox', '0 0 24 24');
        morefunction.setAttribute('width', '24px');
        morefunction.setAttribute('height', '24px');
        path5.setAttribute('d','M 841.639 555.272 c 1.77544 -14.2014 3.10676 -28.626 3.10676 -43.2715 c 0 -14.6456 -1.33132 -29.0691 -3.10676 -43.2715 l 93.8658 -73.4499 c 8.43204 -6.65661 10.8737 -18.6395 5.32528 -28.4039 l -88.7616 -153.779 c -5.54734 -9.54233 -17.0872 -13.5363 -27.0726 -9.54233 l -110.509 44.6028 c -22.8566 -17.5303 -47.9317 -32.3979 -75.0032 -43.7156 L 622.841 86.8306 c -1.99749 -10.4295 -11.0957 -18.6395 -22.1904 -18.6395 l -177.523 0 c -11.0957 0 -20.1929 8.20999 -21.9683 18.6395 l -16.6431 117.61 c -27.0726 11.3167 -52.1477 25.9623 -75.0032 43.7156 l -110.508 -44.6028 c -9.98542 -3.77191 -21.5242 0 -27.0726 9.54233 l -88.7616 153.779 c -5.54734 9.54233 -3.10676 21.5242 5.32528 28.4039 l 93.6438 73.4499 c -1.77544 14.2014 -3.10676 28.626 -3.10676 43.2715 c 0 14.6456 1.33132 29.0691 3.10676 43.2715 l -93.6438 73.4499 c -8.43204 6.65661 -10.8737 18.6395 -5.32528 28.4039 l 88.7616 153.779 c 5.54734 9.54233 17.0861 13.5363 27.0726 9.54233 l 110.509 -44.6028 c 22.8566 17.5303 47.9317 32.3979 75.0032 43.7156 l 16.6431 117.61 c 1.77544 10.4295 10.8737 18.6395 21.9683 18.6395 l 177.523 0 c 11.0957 0 20.1929 -8.20999 21.9683 -18.6395 l 16.6431 -117.61 c 27.0726 -11.3167 52.1477 -25.9623 75.0032 -43.7156 l 110.508 44.6028 c 9.98542 3.77191 21.5252 0 27.0726 -9.54233 l 88.7616 -153.779 c 5.54734 -9.54233 3.10676 -21.5242 -5.32528 -28.4039 L 841.639 555.272 Z M 511.888 667.333 c -85.8769 0 -155.333 -69.4559 -155.333 -155.333 s 69.4559 -155.333 155.333 -155.333 c 85.8769 0 155.333 69.4559 155.333 155.333 S 597.765 667.333 511.888 667.333 Z')
        path5.style.transform="scale(0.0205)"
        path5.setAttribute('fill', '#fff');
        morefunction.appendChild(path5);
        morefunction.id = 'morefunction';
        var morefunction_title=document.createElement('div')
        morefunction_title.id='morefunction_title'
        morefunction_title.title=morefunction_title_text
        document.getElementById('divnew').appendChild(morefunction_title)
        document.getElementById("morefunction_title").appendChild(morefunction);

        No1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        var path6 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        No1.setAttribute("aria-hidden","true");
        No1.setAttribute('viewbox', '0 0 24 24');
        No1.setAttribute('width', '24px');
        No1.setAttribute('height', '24px');
        path6.setAttribute('d','M975.84684 177.147982H796.422168V104.289287a104.944321 104.944321 0 0 0-107.60847-104.249325H328.226866a105.407651 105.407651 0 0 0-108.303466 104.249325v72.858695H40.498728a34.749775 34.749775 0 1 0 0 68.57289h935.348112a34.749775 34.749775 0 1 0 0-68.57289z m-324.331234 571.517967v-393.830784a37.413924 37.413924 0 0 0-74.712016 0v393.830784a37.413924 37.413924 0 0 0 74.712016 0z m-218.34442 0v-393.830784a34.749775 34.749775 0 1 0-68.804554 0v393.830784a34.749775 34.749775 0 1 0 68.804554 0z m400.433241-428.580559a37.066427 37.066427 0 0 0-37.413924 35.792269v536.304861a35.792268 35.792268 0 0 1-35.676436 35.328938H256.410664a36.023933 36.023933 0 0 1-36.487264-35.328938V354.371835a34.749775 34.749775 0 1 0-68.804555 0V892.066687a108.535131 108.535131 0 0 0 105.407651 110.73595h503.987571A113.515932 113.515932 0 0 0 871.597515 892.066687V355.877659a37.298092 37.298092 0 0 0-37.529757-35.792269z m-112.010108-142.937408H289.770448V104.289287a37.877255 37.877255 0 0 1 38.456418-35.560603h360.586832a33.012286 33.012286 0 0 1 32.780621 35.560603z m0 0')
        path6.style.transform="scale(0.014) translate(0px, -22px)"
        path6.setAttribute('fill', '#fff');
        No1.appendChild(path6);
        No1.id = 'No1';
        No1.setAttribute('className', 'No');
        var No1_title=document.createElement('div')
        No1_title.id='No1_title'
        No1_title.title=No1_title_text
        document.getElementById('divnew').appendChild(No1_title)
        document.getElementById("No1_title").appendChild(No1);

        No2 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        var path7 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        No2.setAttribute("aria-hidden","true");
        No2.setAttribute('viewbox', '0 0 24 24');
        No2.setAttribute('width', '24px');
        No2.setAttribute('height', '24px');
        if(getCookie("Size")==2){
            No2.style.backgroundColor="red"
        }
        else{
            No2.style.backgroundColor="black"
        }
        path7.setAttribute('d','M879.420952 785.798095c-24.088381 43.495619-89.941333 84.382476-121.660952 135.289905 43.446857 1.536 96.768-6.704762 121.660952 13.433905 4.656762 11.824762 5.461333 27.672381 4.559238 45.104762-32.207238 28.891429-116.736 17.993143-184.734476 17.993143H298.154667c-64.463238 0-160.816762 14.336-162.206477-36.010667-1.852952-64.048762 84.626286-32.768 126.171429-40.594286-25.916952-41.74019-78.896762-95.378286-126.171429-130.730667 71.753143 6.38781 166.66819 28.647619 243.297524 45.104762 2.535619-42.496 6.509714-83.529143 4.534857-130.657523 24.576 11.995429 39.399619 33.718857 63.097905 54.101333 11.849143 10.24 51.712 53.662476 63.073524 54.052571 15.652571 0.536381 48.88381-42.008381 63.097905-54.052571 25.648762-21.918476 43.715048-36.303238 63.049143-54.101333 12.726857 32.304762-3.462095 93.500952 8.97219 126.147047 67.34019-7.826286 161.28-28.062476 234.349714-45.080381z m-482.133333 76.702476c-58.270476-9.435429-127.024762-32.207238-180.224-31.622095 45.470476 24.624762 77.507048 107.398095 139.654095 85.674667-12.653714-11.605333-44.544-27.477333-40.545524-40.594286 39.375238 3.242667 86.137905 21.308952 117.126096 17.968762 2.974476-24.039619-5.924571-59.952762 4.534857-76.531809 26.843429 19.72419 47.152762 46.031238 76.653714 63.073523 24.088381-22.479238 46.713905-46.34819 76.580572-63.073523v76.531809c32.621714 3.510857 79.384381-16.14019 121.660952-17.968762-10.971429 19.065905-35.181714 24.81981-45.104762 45.080381 78.774857 0.512 93.45219-62.805333 139.727238-94.695619-62.561524 11.093333-122.270476 24.966095-184.783238 36.156952-12.995048-26.209524 4.120381-82.310095-8.947809-108.178285-34.06019 29.013333-64.512 61.70819-103.66781 85.625904-36.10819-26.940952-66.901333-59.221333-103.643429-85.625904-1.609143 37.400381 5.217524 83.285333-9.020952 108.178285z M667.623619 528.944762c-46.518857 70.582857-43.300571 191.000381-126.122667 225.401905-9.679238-87.893333-15.506286-179.712-26.989714-265.923048-14.116571 85.113905-22.991238 175.34781-31.573333 265.923048-79.872-38.838857-75.53219-161.792-112.713143-243.419429-3.730286 54.881524 16.871619 124.318476 22.552381 184.832-12.239238 3.267048-9.020952-8.923429-17.993143-9.045333v45.056c-35.498667-71.168-61.781333-151.503238-94.598095-225.28-72.338286 24.624762-157.281524 15.652571-193.77981-31.548953-59.172571-76.409905 11.02019-182.442667 72.094476-225.304381-4.656762-64.560762 40.643048-113.859048 90.063239-130.706285 20.553143-7.021714 45.372952 2.730667 67.632761-4.559238 22.454857-7.314286 29.891048-29.720381 49.615239-45.031619C453.632 0.731429 629.735619 6.753524 699.270095 114.371048c70.680381-5.924571 151.942095 23.600762 166.716953 99.108571 2.29181 11.678476-4.461714 25.185524 0 36.108191 21.211429 52.662857 113.834667 76.312381 90.136381 189.244952-13.336381 63.171048-129.219048 114.93181-216.356572 67.608381-34.084571 60.513524-59.855238 129.365333-85.601524 198.241524-6.826667-10.654476-6.826667-16.65219-22.576762-8.972191 7.070476-60.513524 27.574857-107.666286 36.035048-166.765714z')
        path7.style.transform="scale(0.014)"
        path7.setAttribute('fill', '#fff');
        No2.appendChild(path7);
        No2.id = 'No2';
        No2.setAttribute('class', 'No');
        var No2_title=document.createElement('div')
        No2_title.id='No2_title'
        No2_title.title=No2_title_text
        document.getElementById('divnew').appendChild(No2_title)
        document.getElementById("No2_title").appendChild(No2);

        No3 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        var path9 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        No3.setAttribute("aria-hidden","true");
        No3.setAttribute('viewbox', '0 0 24 24');
        No3.setAttribute('width', '24px');
        No3.setAttribute('height', '24px');
        path9.setAttribute('d','M512 808.96C177.3568 808.96 64.6144 525.9264 63.488 523.0592l-4.5056-11.5712 4.8128-11.4688C65.024 497.152 188.2112 215.04 512 215.04c334.6432 0 447.3856 283.0336 448.512 285.9008l4.5056 11.5712-4.8128 11.4688C958.976 526.848 835.7888 808.96 512 808.96zM125.952 512.6144C149.1968 562.0736 253.8496 747.52 512 747.52c248.1152 0 360.96-187.5968 386.048-236.1344C874.7008 461.824 770.1504 276.48 512 276.48c-248.1152 0-361.0624 187.5968-386.048 236.1344zM512 675.84a163.84 163.84 0 1 1 163.84-163.84 163.84 163.84 0 0 1-163.84 163.84z m0-266.24a102.4 102.4 0 1 0 102.4 102.4 102.4 102.4 0 0 0-102.4-102.4zM563.2 542.72a81.92 81.92 0 1 1 81.92-81.92 81.92 81.92 0 0 1-81.92 81.92z m0-102.4a20.48 20.48 0 1 0 20.48 20.48 20.48 20.48 0 0 0-20.48-20.48z')
        path9.style.transform="scale(0.015) translate(79px, -153px) rotate(12deg)"
        path9.setAttribute('fill', '#fff');
        No3.appendChild(path9);
        No3.id = 'No3';
        No3.setAttribute('class', 'No');
        var No3_title=document.createElement('div')
        No3_title.id='No3_title'
        No3_title.title=No3_title_text
        document.getElementById('divnew').appendChild(No3_title)
        document.getElementById("No3_title").appendChild(No3);

        No4 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        var path11 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        No4.setAttribute("aria-hidden","true");
        No4.setAttribute('viewbox', '0 0 24 24');
        No4.setAttribute('width', '24px');
        No4.setAttribute('height', '24px');
        path11.setAttribute('d','M 10.24 2.56 C 5.99893334 2.56 2.56 5.99893334 2.56 10.24 2.56 14.48106666 5.99893334 17.92 10.24 17.92 14.48106666 17.92 17.92 14.48106666 17.92 10.24 17.92 9.81333334 17.885866659999998 9.38666666 17.80906666 8.96 17.57866666 8.53333334 17.06666666 8.53333334 17.06666666 8.53333334 L 15.36 8.53333334 15.36 7.68 C 15.36 6.82666666 14.50666666 6.82666666 14.50666666 6.82666666 L 12.8 6.82666666 12.8 5.97333334 C 12.8 5.12 11.94666666 5.12 11.94666666 5.12 L 11.09333334 5.12 11.09333334 3.41333334 C 11.09333334 2.56 10.24 2.56 10.24 2.56 M 8.10666666 5.12 C 8.81493334 5.12 9.38666666 5.69173334 9.38666666 6.4 9.38666666 7.108266660000001 8.81493334 7.68 8.10666666 7.68 7.3984000000000005 7.68 6.82666666 7.108266660000001 6.82666666 6.4 6.82666666 5.69173334 7.3984000000000005 5.12 8.10666666 5.12 M 5.54666666 8.53333334 C 6.25493334 8.53333334 6.82666666 9.10506666 6.82666666 9.81333334 6.82666666 10.521600000000001 6.25493334 11.09333334 5.54666666 11.09333334 4.8384 11.09333334 4.26666666 10.521600000000001 4.26666666 9.81333334 4.26666666 9.10506666 4.8384 8.53333334 5.54666666 8.53333334 M 9.81333334 9.38666666 C 10.521600000000001 9.38666666 11.09333334 9.958400000000001 11.09333334 10.66666666 11.09333334 11.37493334 10.521600000000001 11.94666666 9.81333334 11.94666666 9.10506666 11.94666666 8.53333334 11.37493334 8.53333334 10.66666666 8.53333334 9.958400000000001 9.10506666 9.38666666 9.81333334 9.38666666 M 14.08 11.09333334 C 14.78826666 11.09333334 15.36 11.66506666 15.36 12.373333339999999 15.36 13.081600000000002 14.78826666 13.65333334 14.08 13.65333334 L 14.08 13.65333334 C 13.37173334 13.65333334 12.8 13.081600000000002 12.8 12.373333339999999 L 12.8 12.373333339999999 C 12.8 11.66506666 13.37173334 11.09333334 14.08 11.09333334 M 9.38666666 13.65333334 C 10.09493334 13.65333334 10.66666666 14.22506666 10.66666666 14.933333339999999 10.66666666 15.6416 10.09493334 16.21333334 9.38666666 16.21333334 8.6784 16.21333334 8.10666666 15.6416 8.10666666 14.933333339999999 8.10666666 14.22506666 8.6784 13.65333334 9.38666666 13.65333334 Z')
        path11.style.transform="scale(0.8) translate(-1px, -2px)"
        path11.setAttribute('fill', '#fff');
        No4.appendChild(path11);
        No4.id = 'No4';
        No4.setAttribute('class', 'No');
        var No4_title=document.createElement('div')
        No4_title.id='No4_title'
        No4_title.title=No3_title_text
        document.getElementById('divnew').appendChild(No4_title)
        document.getElementById("No4_title").appendChild(No4);


        var slider=document.createElement("input")
        slider.id="slider"
        slider.type="range"
        slider.min="1"
        slider.max="10"
        slider.style.display="none"
        if(getCookie("slider")!=""){
            slider.value=getCookie("slider")
        }
        else{
            slider.value="3"
        }
        document.body.appendChild(slider)


        var oText=document.createElement("cookie_text");
        oText.setAttribute("id","text");
        oText.type="text";
        var text1=document.createTextNode("");
        oText.appendChild(text1)
        document.getElementById("divnew").appendChild(oText)

        var Covertitle=document.createElement("cover_title");
        Covertitle.setAttribute("id","covertitle");
        Covertitle.type="text";
        var text2=document.createTextNode("已储存链接");
        Covertitle.appendChild(text2)
        document.getElementById("divnew").appendChild(Covertitle)


        var Textbackground=document.createElement("text_background")
        Textbackground.type="text";
        Textbackground.display="none";
        Textbackground.setAttribute("id","textbackground")
        document.getElementById("divnew").appendChild(Textbackground)

        var BlackCover=document.createElement("black_cover")
        BlackCover.type="text";
        BlackCover.setAttribute("id","blackcover")
        document.getElementById("divnew").appendChild(BlackCover)

        var BigEye = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        var path8 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        path8.setAttribute('d','M512 808.96C177.3568 808.96 64.6144 525.9264 63.488 523.0592l-4.5056-11.5712 4.8128-11.4688C65.024 497.152 188.2112 215.04 512 215.04c334.6432 0 447.3856 283.0336 448.512 285.9008l4.5056 11.5712-4.8128 11.4688C958.976 526.848 835.7888 808.96 512 808.96zM125.952 512.6144C149.1968 562.0736 253.8496 747.52 512 747.52c248.1152 0 360.96-187.5968 386.048-236.1344C874.7008 461.824 770.1504 276.48 512 276.48c-248.1152 0-361.0624 187.5968-386.048 236.1344zM512 675.84a163.84 163.84 0 1 1 163.84-163.84 163.84 163.84 0 0 1-163.84 163.84z m0-266.24a102.4 102.4 0 1 0 102.4 102.4 102.4 102.4 0 0 0-102.4-102.4zM563.2 542.72a81.92 81.92 0 1 1 81.92-81.92 81.92 81.92 0 0 1-81.92 81.92z m0-102.4a20.48 20.48 0 1 0 20.48 20.48 20.48 20.48 0 0 0-20.48-20.48z')
        path8.style.transform="scale(0.03)"
        path8.setAttribute('fill', '#000');
        BigEye.setAttribute("aria-hidden","true");
        BigEye.setAttribute('viewbox', '0 0 24 24');
        BigEye.setAttribute('width', '37px');
        BigEye.setAttribute('height', '26px');
        BigEye.appendChild(path8);
        BigEye.id = 'bigeye';
        document.getElementById("divnew").appendChild(BigEye);
        var Whitecover = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        Whitecover.setAttribute("aria-hidden","true");
        Whitecover.setAttribute('viewbox', '0 0 24 24');
        Whitecover.setAttribute('width', '37px');
        Whitecover.setAttribute('height', '26px');
        Whitecover.id = 'whitecover';
        document.getElementById("divnew").appendChild(Whitecover);


        var Pages = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        var path10 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        path10.setAttribute('d','M8,3 C8.55228475,3 9,3.44771525 9,4 L9,9 C9,9.55228475 8.55228475,10 8,10 L3,10 C2.44771525,10 2,9.55228475 2,9 L6,9 C7.1045695,9 8,8.1045695 8,7 L8,3 Z M1,1 L6,1 C6.55228475,1 7,1.44771525 7,2 L7,7 C7,7.55228475 6.55228475,8 6,8 L1,8 C0.44771525,8 0,7.55228475 0,7 L0,2 C0,1.44771525 0.44771525,1 1,1 Z')
        path10.style.transform="scale(1.5)"
        path10.setAttribute('fill', '#606060');
        Pages.setAttribute("aria-hidden","true");
        Pages.setAttribute('viewbox', '0 0 24 24');
        Pages.setAttribute('width', '37px');
        Pages.setAttribute('height', '26px');
        Pages.id = 'pages';


        var Pagenumber=document.createElement("page_number");
        Pagenumber.setAttribute("id","pagenumber");
        Pagenumber.type="text";
        var text3=document.createTextNode("");
        Pagenumber.appendChild(text3)
        document.body.appendChild(Pagenumber)
        Pages.appendChild(path10);
        document.getElementById("divnew").appendChild(Pages);

        var preImg_pointer=getCookie("preImg")
        var path12_color='#fff'
        if(preImg_pointer==1){
            path12_color='#0f0'
        }
        else if(preImg_pointer==2){
            path12_color='#00a4ff'
        }
        else if(preImg_pointer==3){
            path12_color='#f00'
        }

        No5 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        var path12 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        No5.setAttribute("aria-hidden","true");
        No5.setAttribute('viewbox', '0 0 24 24');
        No5.setAttribute('width', '24px');
        No5.setAttribute('height', '24px');
        if(getCookie('bigGif')==1){
            No5.style.backgroundColor='#f00'
        }
        path12.setAttribute('d','M1000.118474 874.180089l-137.726949-137.616258a222.405362 222.405362 0 1 0-179.872446 92.509783 219.139985 219.139985 0 0 0 131.362231-43.639823l137.616258 137.256513a33.926711 33.926711 0 0 0 48.399524 0 34.341801 34.341801 0 0 0 0-48.510215z m-207.545131-159.007243a160.307859 160.307859 0 0 1-219.859474 0 155.382121 155.382121 0 1 1 219.859474 0z M613.309696 953.130256H172.400822a87.694736 87.694736 0 0 1-87.639391-87.63939V158.509134a87.694736 87.694736 0 0 1 87.639391-87.63939h497.029077a87.694736 87.694736 0 0 1 87.639391 87.63939v143.897957a35.448708 35.448708 0 0 0 70.869744 0v-143.897957A158.702843 158.702843 0 0 0 669.429899 0H172.400822A158.702843 158.702843 0 0 0 13.891687 158.509134v706.981732a158.702843 158.702843 0 0 0 158.509135 158.509134h440.908874a35.448708 35.448708 0 1 0 0-70.869744z M550.520376 266.792347a32.709113 32.709113 0 0 0-32.626094-32.626095H198.0534a32.626094 32.626094 0 0 0 0 65.252189h319.674846a32.819803 32.819803 0 0 0 32.764457-32.626094z m-124.111988 180.757972a32.709113 32.709113 0 0 0-32.626094-32.626095H197.998054a32.626094 32.626094 0 1 0 0 65.252189h195.78424a32.709113 32.709113 0 0 0 32.626094-32.626094zM197.998054 595.792887a32.626094 32.626094 0 0 0 0 65.252189h106.650525a32.626094 32.626094 0 1 0 0-65.252189z')
        path12.setAttribute('left','1000px')
        path12.style.transform="scale(0.0124) translateX(134px) translateY(62px)"
        path12.setAttribute('fill',path12_color);
        path12.id='path12';
        No5.appendChild(path12);
        No5.id = 'No5';
        No5.setAttribute('class', 'No');
        var No5_title=document.createElement('div')
        No5_title.id='No5_title'
        No5_title.title=No5_title_text
        document.getElementById('divnew').appendChild(No5_title)
        document.getElementById("No5_title").appendChild(No5);

        var No6 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        var path13 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        No6.setAttribute("aria-hidden","true");
        No6.setAttribute('viewbox', '0 0 24 24');
        No6.setAttribute('width', '24px');
        No6.setAttribute('height', '24px');
        path13.setAttribute('d','M423.1984 640a83.84 83.84 0 0 1-64-28.8 259.84 259.84 0 0 1-26.88-308.48L441.1184 128a261.12 261.12 0 1 1 448 272l-35.2 57.6a83.84 83.84 0 1 1-145.92-90.24l35.2-57.6a92.8 92.8 0 0 0-158.72-96.64L476.9584 389.76a92.8 92.8 0 0 0 9.6 109.44 83.84 83.84 0 0 1-64 139.52zM357.9184 1024A261.12 261.12 0 0 1 135.1984 626.56L166.5584 576a83.84 83.84 0 1 1 144 87.68l-31.36 51.2a92.8 92.8 0 0 0 30.72 128 91.52 91.52 0 0 0 70.4 10.88 92.16 92.16 0 0 0 57.6-41.6L545.4384 634.24a93.44 93.44 0 0 0-6.4-105.6A83.84 83.84 0 1 1 673.4384 424.96a262.4 262.4 0 0 1 17.28 296.96L581.2784 896A259.84 259.84 0 0 1 417.4384 1016.32a263.68 263.68 0 0 1-59.52 7.68z')
        path13.style.transform="scale(0.0124) translate(1300px, 567px) rotate(137deg)"
        path13.setAttribute('fill','#fff');
        path13.id='path13';
        No6.appendChild(path13);
        No6.id = 'No6';
        No6.setAttribute('class', 'No');
        var No6_title=document.createElement('div')
        No6_title.id='No6_title'
        No6_title.title=No6_title_text
        document.getElementById('divnew').appendChild(No6_title)
        document.getElementById("No6_title").appendChild(No6);

        var slider_box=document.createElement("text")
        slider_box.id="slider_box"
        slider_box.type="text"
        slider_box.style.display="none"
        document.body.appendChild(slider_box)

        var No7 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        var path14 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        No7.setAttribute("aria-hidden","true");
        No7.setAttribute('viewbox', '0 0 24 24');
        No7.setAttribute('width', '24px');
        No7.setAttribute('height', '24px');
        path14.setAttribute('d','M512 64c-247.424 0-448 200.576-448 448s200.576 448 448 448 448-200.576 448-448-200.576-448-448-448z m0 128a318.46912 318.46912 0 0 1 176.4352 53.05856L245.05856 688.4352A318.46912 318.46912 0 0 1 192 512c0-176.73216 143.26784-320 320-320z m0 640a318.44352 318.44352 0 0 1-176.43008-53.05856l443.37152-443.37152A318.44352 318.44352 0 0 1 832 512c0 176.73216-143.26784 320-320 320z')
        path14.style.transform="scale(0.015) translate(750px, -216px) rotate(67deg)"
        if(getCookie("R-18_block")==""||getCookie("R-18_block")=="0"){
            var path14_color="#fff"
            }
        else if(getCookie("R-18_block")=="1"){
            path14_color="#f00"
        }
        path14.setAttribute('fill',path14_color);
        path14.transition="0.5"
        path14.id='path14';
        No7.appendChild(path14);
        No7.id = 'No7';
        No7.setAttribute('class', 'No');
        var No7_title=document.createElement('div')
        No7_title.id='No7_title'
        No7_title.title=No7_title_text
        document.getElementById('divnew').appendChild(No7_title)
        document.getElementById("No7_title").appendChild(No7);

        No8 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        var path15 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        No8.setAttribute("aria-hidden","true");
        No8.setAttribute('viewbox', '0 0 24 24');
        No8.setAttribute('width', '24px');
        No8.setAttribute('height', '24px');
        if(getCookie("outUrl")==0){
            var svg=svg_cat
            path15.style.transform="scale(0.017) translate(-391px, -130px)"
        }
        else if(getCookie("outUrl")==1){
            svg=svg_re
            path15.style.transform="scale(0.017) translate(-424px, -120px)"
        }
        else if(getCookie("outUrl")==2){
            svg=svg_moe
            path15.style.transform="scale(0.016) translate(-204px, -130px)"
        }
        path15.setAttribute('d',svg)
        path15.id="path15"
        path15.setAttribute('fill', '#fff');
        No8.appendChild(path15);
        No8.id = 'No8';
        No8.setAttribute('class', 'No');
        var No8_title=document.createElement('div')
        No8_title.id='No8_title'
        No8_title.title=No8_title_text
        document.getElementById('divnew').appendChild(No8_title)
        document.getElementById("No8_title").appendChild(No8);

        if(window.location.href.match('\/users\/')==null)
        {
            var user_add = document.createElementNS("http://www.w3.org/2000/svg", "svg");//人物右侧更多功能
            var path16 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            user_add.setAttribute("aria-hidden","true");
            user_add.setAttribute('viewbox', '0 0 32 32');
            user_add.style.height="32px"
            user_add.style.width="32px"
            path16.setAttribute('d','M512 688a80 80 0 1 1 0 160 80 80 0 0 1 0-160z m0-256a80 80 0 1 1 0 160 80 80 0 0 1 0-160z m0-256a80 80 0 1 1 0 160 80 80 0 0 1 0-160z')
            path16.style.transform="scale(0.02) translate(300px, 280px)"
            path16.setAttribute('fill', '#666666');
            path16.id="path16"
            path16.style.transition="0.4s"
            user_add.appendChild(path16);
            user_add.id = 'add';
            var div_add=document.createElement("div")
            document.body.appendChild(div_add)
            div_add.id="div_add"
            var add_cover=document.createElement("a")
            add_cover.id="add_cover"
            div_add.appendChild(add_cover)
            div_add.appendChild(user_add);
        }
        else
        {
            var user_link = document.createElement("a");//人物右侧更多功能
            user_link.style.height="32px"
            user_link.style.width="32px"
            user_link.id = 'link';
            var user_link_num=document.createElement('text')
            user_link_num.id='user_link_num'
            var user_id=window.location.href.match(/(?<=users\/)\d+/)[0]
            var jsonLink=GM_getValue("pixiv_user_outLink")
            user_link_num.innerText=0
            if(jsonLink[user_id]!=null){
                user_link_num.innerText=jsonLink[user_id].length
            }
            var div_link=document.createElement("div")
            document.body.appendChild(div_link)
            div_link.id="div_link"
            var add_link_cover=document.createElement("a")
            add_link_cover.id="link_cover"
            div_link.appendChild(add_link_cover)
            div_link.appendChild(user_link);
            user_link.appendChild(user_link_num)
        }

        var recommend=document.createElement("div")//相似作者推荐框
        document.body.appendChild(recommend)
        recommend.id="recommend"
        recommend.outerHTML=`<div class="recommend" id="recommend" style="height:270px;left:0px; transform: translateY(0px);opacity: 1;transition: 0.75s;position: fixed;bottom: -350px;z-index: 2;width: 100%;background-color: rgba(0, 0, 0, 0.8);padding: 16px 0px;">
	<div class="recommend_title" id="recommend_title" style="font-size: 16px;line-height: 24px;font-weight: bold;display: flow-root;color: rgb(255, 255, 255);margin-bottom: 24px;text-align: center;">推荐用户</div>
	<div class="recommend_cross" id="recommend_cross" style="color: rgb(255, 255, 255);padding-top: 16px;padding-right: 16px;transition: color 0.2s ease 0s;position:absolute;top: 0px;right: 0px;cursor: pointer;">
		<svg viewBox="0 0 24 24" size="24" class="recommend_svg" id="recommend_svg" style="stroke: none;fill: currentcolor;width: 24px;height: 24px;line-height: 0;font-size: 0px;vertical-align: middle;">
			<path d="M14.8284 12L19.4142 16.5858C20.1953 17.3668 20.1953 18.6332 19.4142 19.4142
			C18.6332 20.1953 17.3668 20.1953 16.5858 19.4142L12 14.8284L7.41421 19.4142
			C6.63317 20.1953 5.36684 20.1953 4.58579 19.4142C3.80474 18.6332 3.80474 17.3668 4.58579 16.5858L9.17157 12
			L4.58579 7.41421C3.80474 6.63317 3.80474 5.36684 4.58579 4.58579
			C5.36684 3.80474 6.63317 3.80474 7.41421 4.58579L12 9.17157L16.5858 4.58579
			C17.3668 3.80474 18.6332 3.80474 19.4142 4.58579C20.1953 5.36684 20.1953 6.63317 19.4142 7.41421L14.8284 12Z" transform="">
			</path>
		</svg>
	</div>
	<div class="recommend_inner_all" id="recommend_inner_all" style="height:225px;position: relative;z-index: 0;overflow: auto;">
		<div class="recommend_inner_1" id="recommend_inner_1" style="overflow-x: auto;padding: 0px;margin: 0px;">
			<ul class="recommend_inner_2" id="recommend_inner_2" style="vertical-align: top;overflow: hidden;list-style: none;padding: 0px;min-width: 100%;box-sizing:border-box;display: inline-flex;margin: 0px;">
				<div class="recommend_inner_real" id="recommend_inner_real" style="white-space: nowrap;line-height: 0;padding: 0px 0px 24px;margin: 0px;list-style: none;"></div>
			</ul>
		</div>
	</div>
</div>`


        var No9 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        var path17 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        No9.setAttribute("aria-hidden","true");
        No9.setAttribute('viewbox', '0 0 24 24');
        No9.setAttribute('width', '24px');
        No9.setAttribute('height', '24px');
        path17.setAttribute('d','M1024.000065 920.894642L670.809372 566.972705a365.621836 365.621836 0 1 0-103.836601 103.836602L920.894708 1024zM146.50766 365.880696a219.373101 219.373101 0 1 1 219.373101 219.373101 219.373101 219.373101 0 0 1-219.373101-219.373101z')
        path17.style.transform="scale(0.0124) translate(490px, -73px) rotate(37deg)"
        path17.setAttribute('fill','#fff');
        path17.id='path17';
        No9.appendChild(path17);
        No9.id = 'No9';
        No9.setAttribute('class', 'No');
        var No9_title=document.createElement('div')
        No9_title.id='No9_title'
        No9_title.title=No9_title_text
        document.getElementById('divnew').appendChild(No9_title)
        document.getElementById("No9_title").appendChild(No9);

        var check=document.createElement('check')
        var checkInput=document.createElement('input')
        check.id='check'
        checkInput.id='checkInput'
        check.style.display='none'
        checkInput.style.display='none'
        check.appendChild(checkInput)
        document.getElementById("divnew").appendChild(check);


        var No10 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        var path18 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        No10.setAttribute("aria-hidden","true");
        No10.setAttribute('viewbox', '0 0 24 24');
        No10.setAttribute('width', '24px');
        No10.setAttribute('height', '24px');
        path18.setAttribute('d','M602.286735 614.33737l23.025908-204.67474h-204.674739l-23.025908 204.67474z m-11.257111 102.337369h-204.674739L358.212109 978.146718a51.168685 51.168685 0 0 1-102.33737-11.25711L284.017516 716.674739H102.368685a51.168685 51.168685 0 0 1 0-102.337369h192.905941l23.025908-204.67474H102.368685a51.168685 51.168685 0 0 1 0-102.337369h227.18896L358.212109 45.853282a51.168685 51.168685 0 0 1 102.337369 11.25711L432.406701 307.325261h204.67474L665.224217 45.853282a51.168685 51.168685 0 0 1 102.33737 11.25711L739.41881 307.325261H921.067641a51.168685 51.168685 0 0 1 0 102.337369h-192.905942l-23.025908 204.67474H921.067641a51.168685 51.168685 0 0 1 0 102.337369h-227.18896L665.224217 978.146718a51.168685 51.168685 0 1 1-102.337369-11.25711z')
        path18.style.transform="scale(0.0124) translate(270px, -73px) rotate(17deg)"
        if(getCookie('tagCookieSetting')==0){
            path18.setAttribute('fill','#fff');
        }
        else if(getCookie('tagCookieSetting')==1){
            path18.setAttribute('fill','#f00');
        }
        path18.id='path18';
        No10.appendChild(path18);
        No10.id = 'No10';
        No10.setAttribute('class', 'No');
        var No10_title=document.createElement('div')
        No10_title.id='No10_title'
        No10_title.title=No10_title_text
        document.getElementById('divnew').appendChild(No10_title)
        document.getElementById("No10_title").appendChild(No10);


        var No11 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        var path19 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        No11.setAttribute("aria-hidden","true");
        No11.setAttribute('viewbox', '0 0 24 24');
        No11.setAttribute('width', '24px');
        No11.setAttribute('height', '24px');
        path19.setAttribute('d','M682.225853 470.765979c8.511293-8.511293 21.278232-17.022585 29.789524-29.789524 51.067756-59.579048 72.345987-136.180682 59.579048-217.037962-17.022585-114.902451-106.391158-204.271023-221.293608-221.293609-93.624219-12.766939-182.992792 21.278232-242.57184 89.368573-46.812109 63.834695-72.345987 140.436328-59.579049 217.037962 12.766939 63.834695 42.556463 119.158097 93.624219 161.71456-148.947621 51.067756-255.338779 191.504084-255.338779 353.218644v93.624219C86.435368 977.187891 133.247478 1024 192.826526 1024h638.346948c59.579048 0 106.391158-46.812109 106.391158-106.391158v-93.624219c0-161.71456-106.391158-302.150888-255.338779-353.218644zM375.819318 151.592505c34.045171-42.556463 85.112926-63.834695 136.180682-63.834694 8.511293 0 17.022585 0 29.789524 4.255646 76.601634 12.766939 136.180682 76.601634 148.947621 148.947621 8.511293 55.323402-8.511293 106.391158-42.556463 144.691975-42.556463 46.812109-102.135512 72.345987-165.970206 59.579048-76.601634-12.766939-136.180682-76.601634-148.947621-148.947621-8.511293-51.067756 8.511293-106.391158 42.556463-144.691975z m476.632387 766.016337c0 12.766939-8.511293 21.278232-21.278231 21.278232h-638.346948c-12.766939 0-21.278232-8.511293-21.278231-21.278232v-93.624219c0-161.71456 131.925036-289.383949 289.383949-289.383949h97.879865c161.71456 0 289.383949 131.925036 289.38395 289.383949v93.624219z')
        path19.style.transform="scale(0.0124) translate(201px, -122px) rotate(17deg)"
        path19.setAttribute('fill', '#fff');
        No11.appendChild(path19);
        No11.id = 'No11';
        No11.setAttribute('class', 'No');
        var No11_title=document.createElement('div')
        No11_title.id='No11_title'
        No11_title.title=No11_title_text
        document.getElementById('divnew').appendChild(No11_title)
        document.getElementById("No11_title").appendChild(No11);

        var No12 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        var path20 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        No12.setAttribute("aria-hidden","true");
        No12.setAttribute('viewbox', '0 0 24 24');
        No12.setAttribute('width', '24px');
        No12.setAttribute('height', '24px');
        path20.setAttribute('d','M407.568 154.019c-11.952-11.925-26.904-17.894-41.853-17.894-5.972 0-11.952 2.984-17.929 2.984h-2.992c-8.964 5.961-14.94 11.941-20.921 17.902L81.77 398.634c-23.912 23.862-23.912 59.669 0 80.551 11.956 11.929 26.901 17.894 41.841 17.894 14.948 0 29.896-5.965 41.845-17.894l146.459-146.177v495.198c0 32.815 26.908 56.677 56.797 56.677 29.892 0 56.789-26.854 56.789-56.677V198.775c-0.001-14.925-5.973-32.819-17.933-44.756zM942.59 541.831c-11.956-11.941-26.904-17.905-41.849-17.905-14.944 0-29.889 5.965-41.845 17.905L709.45 690.977V195.791c0-32.819-26.901-56.681-56.785-56.681-29.892 0-56.797 26.85-56.797 56.681v635.391c0 32.811 26.904 56.693 56.797 56.693 14.944 0 29.885-5.98 41.841-17.905l245.097-244.615c26.896-23.859 26.896-59.658 2.987-83.524z')
        path20.style.transform="scale(0.015) translate(-27px, -42px)"
        if(getCookie('singleSort')==1){
            path20.setAttribute('fill', '#f00');
        }
        else{
            path20.setAttribute('fill', '#fff');
        }
        No12.appendChild(path20);
        No12.id = 'No12';
        No12.setAttribute('class', 'No');
        var No12_title=document.createElement('div')
        No12_title.id='No12_title'
        No12_title.title=No12_title_text
        document.getElementById('divnew').appendChild(No12_title)
        document.getElementById("No12_title").appendChild(No12);

        var No13 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        var path21 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        No13.setAttribute("aria-hidden","true");
        No13.setAttribute('viewbox', '0 0 24 24');
        No13.setAttribute('width', '24px');
        No13.setAttribute('height', '24px');
        path21.setAttribute('d','M664.608723 120.804367 93.448322 120.804367c-13.671371 0-24.840758 10.900258-25.206078 24.537859l0 76.92909c0.364297 13.637602 11.533684 24.537859 25.206078 24.537859l571.160401 0c13.900591 0 25.222451-11.266601 25.222451-25.223474l0-75.556836C689.832198 132.070968 678.509315 120.804367 664.608723 120.804367zM93.442182 557.577035l495.547283 0c13.956873 0 25.223474-11.266601 25.223474-25.223474l0-75.556836c0-13.956873-11.266601-25.223474-25.223474-25.223474L93.442182 431.573249c-13.589506 0-24.709775 10.770298-25.199938 24.293289l0 77.415161C68.733431 546.805714 79.851653 557.577035 93.442182 557.577035zM664.608723 742.371808 93.448322 742.371808c-13.671371 0-24.840758 10.900258-25.206078 24.537859l0 76.92909c0.364297 13.637602 11.533684 24.537859 25.206078 24.537859l571.160401 0c13.900591 0 25.222451-11.266601 25.222451-25.223474l0-75.556836C689.832198 753.638409 678.509315 742.371808 664.608723 742.371808zM952.532295 480.136292 742.957139 318.316789c-11.658528-9.416464-33.742499-4.092201-33.742499 23.877827l0 309.62585c0 33.966603 22.083971 33.911344 33.742499 23.877827l209.575156-161.819502C964.134541 505.135662 963.349665 489.497497 952.532295 480.136292z')
        path21.style.transform="scale(0.015) translate(-17px, -42px)"
        if(getCookie('unfold')==0){
            path21.setAttribute('fill', '#fff');
        }
        else{
            path21.setAttribute('fill', '#f00');
        }
        path21.id='path21'
        No13.appendChild(path21);
        No13.id = 'No13';
        No13.setAttribute('class', 'No');
        var No13_title=document.createElement('div')
        No13_title.id='No13_title'
        No13_title.title=No13_title_text
        document.getElementById('divnew').appendChild(No13_title)
        document.getElementById("No13_title").appendChild(No13);

        divNew.insertBefore(No5_title,oText)//将元素按顺序放到相应位置
        divNew.insertBefore(No6_title,oText)
        divNew.insertBefore(No7_title,oText)
        divNew.insertBefore(No8_title,oText)
        divNew.insertBefore(No9_title,oText)
        divNew.insertBefore(No10_title,oText)
        divNew.insertBefore(No11_title,oText)
        divNew.insertBefore(No12_title,oText)
        divNew.insertBefore(No13_title,oText)

        for(var i=1;i<14;i++){
            focusOpacity(document.getElementById('No'+i))
        }
        //——————————————————————————————————————————————————————————————————————————————————————————————
    }
    addAllButton ()
    if(window.location.href.match('#preview')!=null){
        document.getElementById('divnew').style.display='none'
        document.getElementById('div_add').style.display='none'
    }


    function addImg(top_1,left_1,innerHTML,event,type,isChangingSrc){
        if(type=='img'){
            var elem_3=document.getElementById("bigImg_1")
            if(elem_3!=null&&isChangingSrc==0){
                bigpicture_1('move',top_1,left_1,innerHTML,event,'img','','')
            }
            else if(elem_3!=null&&isChangingSrc==1){
                elem_3.remove()
                bigpicture_1('add',top_1,left_1,innerHTML,event,'img','','')
            }
            else{
                bigpicture_1('add',top_1,left_1,innerHTML,event,'img','','')
            }
        }
        else if(type=='gif'){
            elem_3=document.getElementById("bigImg_1")
            if(elem_3!=null&&isChangingSrc==0){
                bigpicture_1('move',top_1,left_1,innerHTML,event,'gif','','')
            }
            else if(elem_3!=null&&isChangingSrc==1){
                elem_3.remove()
                bigpicture_1('add',top_1,left_1,innerHTML,event,'gif')
            }
            else{
                bigpicture_1('add',top_1,left_1,innerHTML,event,'gif')
            }
        }
    }

    function bigpicture_1(position,x,y,innerHTML,event,type){
        if(type=='img'){
            if(position=='move'){
                var bigImg_1 = document.getElementById("bigImg_1");
                bigImg_1.style.top=parseInt(x)+15+"px"
                bigImg_1.style.left=parseInt(y)+15+"px"
                if(getCookie("preImg")!="3"){
                    var spaceX=1,spaceY=1//1为下，0为上
                    if((720-(event.screenY+bigImg_1.height))<(event.screenY-bigImg_1.height)){
                        spaceY=0
                    }
                    if((1280-(event.screenX+bigImg_1.width))<(event.screenX-bigImg_1.width)){
                        spaceX=0
                    }
                    if(spaceX==0){//0时向左，1时向右
                        bigImg_1.style.left=(parseInt(bigImg_1.style.left.match(/\d+/)[0])-bigImg_1.width-30)+"px"
                    }
                    if(spaceY==0){//0时向上，1时向下
                        bigImg_1.style.top=(parseInt(bigImg_1.style.top.match(/\d+/)[0])-bigImg_1.height-30)+"px"
                    }
                    if(spaceX==0&&spaceY==0){bigImg_1.style.transformOrigin='right bottom'}
                    else if(spaceX==0&&spaceY!=0){bigImg_1.style.transformOrigin='right top'}
                    else if(spaceX!=0&&spaceY==0){bigImg_1.style.transformOrigin='left bottom'}
                    else if(spaceX!=0&&spaceY!=0){bigImg_1.style.transformOrigin='left top'}
                }
            }
            if(position=='add'){
                bigImg_1 = document.createElement("img");
                bigImg_1.id = 'bigImg_1';
                bigImg_1.className='bigImg_1'
                bigImg_1.src = innerHTML;
                bigImg_1.style.top=parseInt(x)+15+"px"
                bigImg_1.style.left=parseInt(y)+15+"px"
                if(getCookie("preImg")!="3"){
                    spaceX=1//1为下，0为上
                    spaceY=1//1为下，0为上
                    if((720-(event.screenY+bigImg_1.height))<(event.screenY-bigImg_1.height)){
                        spaceY=0
                    }
                    if((1280-(event.screenX+bigImg_1.width))<(event.screenX-bigImg_1.width)){
                        spaceX=0
                    }
                    if(spaceX==0){//0时向左，1时向右
                        bigImg_1.style.left=(parseInt(bigImg_1.style.left.match(/\d+/)[0])-bigImg_1.width-30)+"px"
                    }
                    if(spaceY==0){//0时向上，1时向下
                        bigImg_1.style.top=(parseInt(bigImg_1.style.top.match(/\d+/)[0])-bigImg_1.height-30)+"px"
                    }
                    if(spaceX==0&&spaceY==0){bigImg_1.style.transformOrigin='right bottom'}
                    else if(spaceX==0&&spaceY!=0){bigImg_1.style.transformOrigin='right top'}
                    else if(spaceX!=0&&spaceY==0){bigImg_1.style.transformOrigin='left bottom'}
                    else if(spaceX!=0&&spaceY!=0){bigImg_1.style.transformOrigin='left top'}
                }
                document.body.appendChild(bigImg_1)
            }
        }

        else if(type=='gif'){
            if(position=='add'){
                var iframe=document.createElement('iframe')
                iframe.src='https://www.pixiv.net/artworks/'+innerHTML.match(/(?<=\d+\/)\d+(?=\_)/)[0]+'#preview'
                //https://i.pximg.net/c/360x360_70/img-master/img/2022/03/20/19/27/53/97050863_p0_square1200.jpg
                iframe.style.position='absolute'
                iframe.id = 'bigImg_1';
                iframe.className='bigImg_1'
                iframe.style.top=parseInt(y)+25+"px"
                iframe.style.left=parseInt(x)+25+"px"
                iframe.style.width='300px'
                iframe.style.height='300px'
                if(getCookie("preImg")!="3"){
                    spaceX=1//1为下，0为上
                    spaceY=1//1为下，0为上
                    if((720-(event.screenY+parseInt(iframe.style.height.match(/\d+/)[0])))<(event.screenY-parseInt(iframe.style.height.match(/\d+/)[0]))){
                        spaceY=0
                    }
                    if((1280-(event.screenX+parseInt(iframe.style.width.match(/\d+/)[0])))<(event.screenX-parseInt(iframe.style.width.match(/\d+/)[0]))){
                        spaceX=0
                    }
                    if(spaceX==0){//0时向左，1时向右
                        iframe.style.left=(parseInt(iframe.style.left.match(/\d+/)[0])-parseInt(iframe.style.width.match(/\d+/)[0])-50)+"px"
                    }
                    if(spaceY==0){//0时向上，1时向下
                        iframe.style.top=(parseInt(iframe.style.top.match(/\d+/)[0])-parseInt(iframe.style.height.match(/\d+/)[0])-50)+"px"
                    }
                    if(spaceX==0&&spaceY==0){iframe.style.transformOrigin='right bottom'}
                    else if(spaceX==0&&spaceY!=0){iframe.style.transformOrigin='right top'}
                    else if(spaceX!=0&&spaceY==0){iframe.style.transformOrigin='left bottom'}
                    else if(spaceX!=0&&spaceY!=0){iframe.style.transformOrigin='left top'}
                }
                document.body.appendChild(iframe)
            }

            else if(position=='move'){
                iframe=document.getElementById('bigImg_1')
                iframe.style.top=parseInt(x)+25+"px"
                iframe.style.left=parseInt(y)+25+"px"
                if(iframe.style.width=='300px'&&iframe.style.height=='300px'){
                    var iframeCanvas=document.getElementById('bigImg_1').contentWindow.document.getElementById('iframe_canvas')
                    if(iframeCanvas!=null){
                        iframe.style.width=iframeCanvas.width+'px'
                        iframe.style.height=iframeCanvas.height+'px'
                    }
                }
                if(getCookie("preImg")!="3"){
                    spaceX=1//1为下，0为上
                    spaceY=1//1为下，0为上
                    if((720-(event.screenY+parseInt(iframe.style.height.match(/\d+/)[0])))<(event.screenY-parseInt(iframe.style.height.match(/\d+/)[0]))){
                        spaceY=0
                    }
                    if((1280-(event.screenX+parseInt(iframe.style.width.match(/\d+/)[0])))<(event.screenX-parseInt(iframe.style.width.match(/\d+/)[0]))){
                        spaceX=0
                    }
                    if(spaceX==0){//0时向左，1时向右
                        iframe.style.left=(parseInt(iframe.style.left.match(/\d+/)[0])-parseInt(iframe.style.width.match(/\d+/)[0])-50)+"px"
                    }
                    if(spaceY==0){//0时向上，1时向下
                        iframe.style.top=(parseInt(iframe.style.top.match(/\d+/)[0])-parseInt(iframe.style.height.match(/\d+/)[0])-50)+"px"
                    }
                    if(spaceX==0&&spaceY==0){iframe.style.transformOrigin='right bottom'}
                    else if(spaceX==0&&spaceY!=0){iframe.style.transformOrigin='right top'}
                    else if(spaceX!=0&&spaceY==0){iframe.style.transformOrigin='left bottom'}
                    else if(spaceX!=0&&spaceY!=0){iframe.style.transformOrigin='left top'}
                }
            }
        }
    }
    var m="",n=""
    function GetMouse(oEvent){
        m=oEvent.clientX;
        n=oEvent.clientY;
        document.getElementById("bigImg").style.left=(parseInt(m)-100)+"px";
        document.getElementById("bigImg").style.top=n+"px";
    }
    function mouseX(event){
        document.body.addEventListener('mousemove',(event)=>{
            return event.clientX
        })
    }
    function mouseY(event){
        document.body.addEventListener('mousemove',(event)=>{
            return event.clintY
        })
    }
    function cookie_size(){
        if(document.cookie.length>=7000&&document.cookie.length<7650&&getCookie("Size")!=1){
            alert("链接储存即将溢出")
            var explode=document.getElementById("No2")
            explode.style.backgroundColor="black"
            setCookie("Size",1,-1)
        }
        else if(document.cookie.length>=7650){
            alert('链接储存过大，已停止"核爆"与"Alt"功能使用，请尽快下载链接或清空cookie')
            explode=document.getElementById("No2")
            explode.style.backgroundColor="red"
            setCookie("Size",2,-1)
        }
        else if(document.cookie.length<7000){
            setCookie("Size",0,-1)
        }
    }


    function urlChange(old_url){
        if(window.location.href.match(/#preview/)==null&&old_url!=window.location.href&&window.location.href.match(/(?<=artworks\/)\d+/)!=null){
            if(GM_getValue('pixiv_history')!=null){
                var old_value=GM_getValue('pixiv_history')
                var comma=','//分隔符，避免首位出现逗号
                }
            else{
                old_value=''
                comma=''
            }
            var id=window.location.href.match(/(?<=artworks\/)\d+/)[0]
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://www.pixiv.net/ajax/illust/"+id,
                headers:{
                    "User-Agent": navigator.userAgent,
                },
                onload: function(res) {
                    if(res.status === 200){
                        //console.log('成功')
                        var p=res.responseText
                        var p_json=JSON.parse(p)
                        //作品预览图url
                        // if(p.match(/(?<=\"thumb\"\:\").*?(?=\"\,\")/)!=null){
                        //     if(p.match(/(?<=\"thumb\"\:\").*?(?=\"\,\")/)[0].match(/(?<=img\/).*?(?=\_square)/)!=null){
                        //         var srcPart=p.match(/(?<=\"thumb\"\:\").*?(?=\"\,\")/)[0].match(/(?<=img\/).*?(?=\_square)/)[0]
                        //         }
                        //     else if(p.match(/(?<=\"thumb\"\:\").*?(?=\"\,\")/)[0].match(/(?<=img\/).*?(?=\_custom)/)!=null){
                        //         srcPart=p.match(/(?<=\"thumb\"\:\").*?(?=\"\,\")/)[0].match(/(?<=img\/).*?(?=\_custom)/)[0]+'@'//标定使用custom
                        //     }
                        //     else{
                        //         srcPart='https://www.pixiv.net/favicon.ico'
                        //     }
                        // }
                        var srcPart=p_json.body.urls.thumb
                        if(srcPart.match(/custom/)!=null){
                            srcPart=srcPart.match(/(?<=img\/).*?(?=\_custom)/)[0]+"@"
                        }
                        else{
                            srcPart=srcPart.match(/(?<=img\/).*?(?=\_square)/)[0]
                        }
                        //浏览时间
                        var timestamp=new Date(Date.parse(new Date()))
                        var year=timestamp.getFullYear()-2000
                        var month=timestamp.getMonth()+1
                        var day=timestamp.getDate()
                        if(month<10){
                            month='0'+month
                        }
                        if(day<10){
                            day='0'+day
                        }
                        //R-18
                        var R18type=0
                        var img_tags=p_json.body.tags.tags
                        if(img_tags.find((element)=>{return element.tag=="R-18"})!=null){
                            R18type=1
                        }
                        // for(var R18Loop=0;R18Loop<img_tags.length;R18Loop++){
                        //     if(img_tags[R18Loop].tag=="R-18"){
                        //         R18type=1
                        //         break;
                        //     }
                        // }
                        // if(p.match(/(?<=\"tag\"\:\")R-18(?=\")/)!=null){//为R-18
                        //     var R18type=1
                        //     }
                        // else if(p.match(/(?<=\"tag\"\:\")R-18G(?=\")/)!=null){//为R-18
                        //     R18type=1
                        // }
                        // else{
                        //     R18type=0
                        // }
                        //作品名称
                        var title=p_json.body.alt
                        // if(p.match(/(?<=\<title\>).*?(?=\<\/title\>)/)!=null){
                        //     var title=p.match(/(?<=\<title\>).*?(?=\<\/title\>)/)[0].replace(' - pixiv','')
                        //     }
                        if(GM_getValue('pixiv_history')!=null){
                            if(GM_getValue('pixiv_history').split(',')!=null){
                                var GM_split=GM_getValue('pixiv_history').split(',')
                                }
                            else{
                                GM_split=[GM_getValue('pixiv_history')]
                            }
                            if(title!=GM_split[0].split('+')[1]){
                                if(GM_getValue('pixiv_history')!=null&&GM_getValue('pixiv_history').split(',').length<=500){
                                    GM_setValue('pixiv_history',srcPart+'+'+title+'+'+year+month+day+'+'+R18type+comma+old_value)
                                }
                                else{
                                    old_value=old_value.replace(/^.*?,/,'')
                                    GM_setValue('pixiv_history',srcPart+'+'+title+'+'+year+month+day+'+'+R18type+comma+old_value)
                                }
                            }
                        }
                        else if(GM_getValue('pixiv_history')==null){
                            if(GM_getValue('pixiv_history')!=null&&GM_getValue('pixiv_history').split(',').length<=500){
                                GM_setValue('pixiv_history',srcPart+'+'+title+'+'+year+month+day+'+'+R18type+comma+old_value)
                            }
                            else{
                                old_value=old_value.replace(/^.*?,/,'')
                                GM_setValue('pixiv_history',srcPart+'+'+title+'+'+year+month+day+'+'+R18type+comma+old_value)
                            }
                        }
                        return window.location.href
                    }
                }
            })
        }
        else{
            return old_url
        }
    }

    function innerHistory(src,title,date,date_type,R18_type,element_id){
        if(src!=null&&title!=null&&date!=null&&date_type!=null){
            var historyBack=document.getElementById('history_back')

            if(date_type=='add'){
                var historyDate=document.createElement('div')
                historyDate.className='history_date'
                historyDate.innerText='20'+date.substring(0,2)+'年'+date.substring(2,4)+'月'+date.substring(4,6)+'日'
                historyBack.appendChild(historyDate)
            }

            var history_textOut=document.createElement('div')
            history_textOut.className='history_textOut'
            history_textOut.id='history'+element_id
            historyBack.appendChild(history_textOut)
            history_textOut.onmouseenter=function(){
                history_textOut.getElementsByTagName('svg')[history_textOut.getElementsByTagName('svg').length-1].style.opacity='0.8'
            }
            history_textOut.onmouseleave=function(){
                history_textOut.getElementsByTagName('svg')[history_textOut.getElementsByTagName('svg').length-1].style.opacity='0'
            }

            var historyImg=document.createElement('img')
            historyImg.className='history_img'
            historyImg.src=src
            history_textOut.appendChild(historyImg)

            var historyTitle=document.createElement('a')
            historyTitle.className='history_title'
            historyTitle.innerText=title
            if(src.match(/(?<=\/)\d+(?=\_)/)!=null){
                historyTitle.href='https://www.pixiv.net/artworks/'+src.match(/(?<=\/)\d+(?=\_)/)[0]
            }
            else{
                historyTitle.href='javascript:alert("该链接获取失败")'
            }
            if(R18_type=='1'){
                var historyR18 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                var pathHistoryR18 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                historyR18.setAttribute("aria-hidden","true");
                historyR18.setAttribute('viewbox', '0 0 16 16');
                historyR18.setAttribute('width', '16px');
                historyR18.setAttribute('height', '16px');
                pathHistoryR18.setAttribute('d','M512 64c-247.424 0-448 200.576-448 448s200.576 448 448 448 448-200.576 448-448-200.576-448-448-448z m0 128a318.46912 318.46912 0 0 1 176.4352 53.05856L245.05856 688.4352A318.46912 318.46912 0 0 1 192 512c0-176.73216 143.26784-320 320-320z m0 640a318.44352 318.44352 0 0 1-176.43008-53.05856l443.37152-443.37152A318.44352 318.44352 0 0 1 832 512c0 176.73216-143.26784 320-320 320z')
                pathHistoryR18.style.transform="scale(0.015)"
                pathHistoryR18.setAttribute('fill', '#f00');
                pathHistoryR18.style.opacity='0.6'
                pathHistoryR18.id='pathHistoryR18'
                historyR18.appendChild(pathHistoryR18);
                historyR18.id = 'history_R18';
                history_textOut.appendChild(historyR18);
            }
            history_textOut.appendChild(historyTitle)
            //delete

            var historyDelete = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            var pathHistoryDelete = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            historyDelete.setAttribute("aria-hidden","true");
            historyDelete.setAttribute('viewbox', '0 0 25 25');
            historyDelete.setAttribute('width', '25px');
            historyDelete.setAttribute('height', '25px');
            pathHistoryDelete.setAttribute('d','M512 466.944l233.472-233.472a31.744 31.744 0 0 1 45.056 45.056L557.056 512l233.472 233.472a31.744 31.744 0 0 1-45.056 45.056L512 557.056l-233.472 233.472a31.744 31.744 0 0 1-45.056-45.056L466.944 512 233.472 278.528a31.744 31.744 0 0 1 45.056-45.056z')
            pathHistoryDelete.style.transform="translate(0px, 0px) scale(0.025)"
            pathHistoryDelete.setAttribute('fill', '#000');
            pathHistoryDelete.style.opacity='0.5'
            pathHistoryDelete.id='pathHistoryDelete'
            historyDelete.appendChild(pathHistoryDelete);
            historyDelete.id = 'history_delete';
            historyDelete.onclick=function(){
                var GMall=GM_getValue('pixiv_history').split(',')
                var history_itemNumber=((parseInt(document.getElementById('history_pageNum').innerText)-1)*15+1)+parseInt(historyDelete.closest('div').id.match(/\d+/)[0])//第几条历史记录
                if(getCookie('history_R18')==0){//隐藏R-18
                    var count=0
                    for(var i=0;i<GMall.length;i++){
                        if(GMall[i].split('+')[GMall[i].split('+').length-1]==0){
                            count++
                            if(count==history_itemNumber){
                                console.log(GMall[i])
                                GMall[i]=''
                                break
                            }
                        }
                    }
                }
                else if(getCookie('history_R18')==1){//显示R-18
                    console.log(GMall[history_itemNumber-1])
                    GMall[history_itemNumber-1]=''
                }
                var final_value=''
                for(var j=0;j<GMall.length;j++){
                    if(GMall[j]!=''&&j!=GMall.length-1){
                        var comma=','
                        }
                    else{
                        comma=''
                    }
                    final_value=final_value+GMall[j]+comma
                }
                GM_setValue('pixiv_history',final_value)
                if(document.getElementById('history_back').getElementsByClassName('history_textOut').length==15){
                    var history_deleteAdd=(parseInt(document.getElementById('history_pageNum').innerText))*15-1
                    }
                else{
                    history_deleteAdd=0
                }
                if(historyDelete.closest('div').previousSibling!=null&&historyDelete.closest('div').nextSibling!=null){
                    if(historyDelete.closest('div').previousSibling.className=='history_date'&&historyDelete.closest('div').nextSibling.className=='history_date'){
                        historyDelete.closest('div').previousSibling.remove()
                    }
                }
                historyDelete.closest('div').remove()
                if(history_deleteAdd!=0){
                    addHistory(history_deleteAdd,1)
                }
                for(var q=0;q<document.getElementsByClassName('history_textOut').length;q++){
                    if(document.getElementsByClassName('history_textOut')!=null){
                        document.getElementsByClassName('history_textOut')[q].id='history'+q
                    }
                }
            }
            history_textOut.appendChild(historyDelete);
        }
    }

    function addHistory(startNum,addType){//addType为0则为添加15条历史记录，为1则为一条历史记录
        if(GM_getValue('pixiv_history')!=null){
            var GMvalue_split=GM_getValue('pixiv_history').split(',')
            }
        else{
            GMvalue_split=['']
        }
        var src=[]
        var title=[]
        var date=[]
        var R18type=[]
        var history_count=0
        if(getCookie('history_R18')==1){//放置R-18
            for(var j=0;j<GMvalue_split.length;j++){
                R18type[j]=GMvalue_split[j].split('+')[3]
                if(GMvalue_split[j].split('+')[0].match('@')!=null){//通过@标定custom
                    src[j]='https://i.pximg.net/c/250x250_80_a2/custom-thumb/img/'+GMvalue_split[j].split('+')[0].replace('@','')+'_custom1200.jpg'
                }
                else{//square情况
                    src[j]='https://i.pximg.net/c/250x250_80_a2/img-master/img/'+GMvalue_split[j].split('+')[0]+'_square1200.jpg'
                }
                title[j]=GMvalue_split[j].split('+')[1]
                date[j]=GMvalue_split[j].split('+')[2]
            }
        }
        else if(getCookie('history_R18')==0){//隐藏R-18
            for(j=0;j<GMvalue_split.length;j++){
                if(GMvalue_split[j].split('+')[3]==0){
                    R18type[history_count]=GMvalue_split[j].split('+')[3]
                    if(GMvalue_split[j].split('+')[0].match('@')!=null){//通过@标定custom
                        src[history_count]='https://i.pximg.net/c/250x250_80_a2/custom-thumb/img/'+GMvalue_split[j].split('+')[0].replace('@','')+'_custom1200.jpg'
                    }
                    else{//square情况
                        src[history_count]='https://i.pximg.net/c/250x250_80_a2/img-master/img/'+GMvalue_split[j].split('+')[0]+'_square1200.jpg'
                    }
                    title[history_count]=GMvalue_split[j].split('+')[1]
                    date[history_count]=GMvalue_split[j].split('+')[2]
                    history_count++
                }
            }
        }
        var date_check=''
        all_historyList=src.length
        var element_id=0
        if(addType==0){
            var endNum=startNum+15
            }
        else if(addType==1){
            endNum=startNum+1
        }
        for(var i=startNum;i<endNum;i++){
            if(src[i]==null){//防止最后一页i溢出
                break
            }
            if(addType==0){
                if(date_check!=date[i]){
                    var date_type='add'
                    date_check=date[i]
                }
                else{
                    date_type='none'
                }
            }
            else if(addType==1){
                if(document.getElementById('history_back')!=null&&document.getElementById('history_back').getElementsByClassName('history_date')!=null){
                    var length=document.getElementById('history_back').getElementsByClassName('history_date').length
                    var last_date_text=document.getElementById('history_back').getElementsByClassName('history_date')[length-1].innerText
                    var last_date_num=last_date_text.replace(/[年|月|日]/g,'').substr(2)
                    if(date[i]!=last_date_num){
                        date_type='add'
                    }
                    else{
                        date_type='none'
                    }
                }
            }
            innerHistory(src[i],title[i],date[i],date_type,R18type[i],element_id)
            element_id++
        }
    }

    //原图url请求
    function getPageNum(event,element){//判断链接图片数量
        if(element==0&&event!=null){
            if(event.target.closest("a").innerText!=""&&event.target.closest("a").innerText.match(/((^R-18$)|(^R-18G$))/)==null){
                var pageNum=event.target.closest("a").innerText.match(/(?<=((R\-18\n)|(R\-18G\n)|^))\d{1,2}/)[0]
                return pageNum
            }
            else if(event.target.closest('li')!=null&&event.target.closest('li').getElementsByClassName('sc-1b6b47cc-0 ctUcdq').length!=0){
                pageNum=event.target.closest('li').getElementsByClassName('sc-1b6b47cc-0 ctUcdq')[0].innerText.match(/(?<=((R\-18\n)|(R\-18G\n)|^))\d{1,2}/)[0]
                return pageNum
            }
            else{
                pageNum=1
                return pageNum
            }
        }
        else if(event==0&&element!=null){
            var pageCheck=element.outerHTML.match(/(?<=<span>)\d{1,3}(?=<\/span>)/)//判断有没有图片
            if(pageCheck!=null){
                pageNum=element.outerHTML.match(/(?<=<span>)\d{1,3}(?=<\/span>)/)[0]
                return pageNum
            }
            else{
                pageNum=1
                return pageNum
            }
        }
    }

    function userAllPic(k,id){
        if(k==0){//主作者
            var userImg_id=document.getElementsByTagName("aside")[0].innerHTML.match(/(?<=\/users\/)\d+/)[0]
            }
        else if(k==1){//推荐图片部分
            userImg_id=id
        }
        if(document.getElementById('userImgBack')==null){
            var userImgBack=document.createElement('div')//整体背景div
            userImgBack.id='userImgBack'
            document.body.appendChild(userImgBack)

            var userImgUl=document.createElement('ul')//整体框架
            userImgUl.id='userImgUl'
            userImgUl.className='userImgUl'
            userImgBack.appendChild(userImgUl)

            var userImgTitleBackground=document.createElement('background')//标题背景
            userImgTitleBackground.id='userImgTitleBackground'
            userImgBack.appendChild(userImgTitleBackground)

            var userImgTitle=document.createElement('a')//标题
            userImgTitle.id='userImgTitle'
            userImgTitle.innerText='作者作品'
            userImgBack.appendChild(userImgTitle)

            var userImgCross = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            var path_userImg = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            userImgCross.setAttribute("aria-hidden","true");
            userImgCross.setAttribute('viewbox', '0 0 24 24');
            userImgCross.setAttribute('width', '24px');
            userImgCross.setAttribute('height', '24px');
            path_userImg.setAttribute('d','M14.8284 12L19.4142 16.5858C20.1953 17.3668 20.1953 18.6332 19.4142 19.4142 C18.6332 20.1953 17.3668 20.1953 16.5858 19.4142L12 14.8284L7.41421 19.4142 C6.63317 20.1953 5.36684 20.1953 4.58579 19.4142C3.80474 18.6332 3.80474 17.3668 4.58579 16.5858L9.17157 12 L4.58579 7.41421C3.80474 6.63317 3.80474 5.36684 4.58579 4.58579 C5.36684 3.80474 6.63317 3.80474 7.41421 4.58579L12 9.17157L16.5858 4.58579 C17.3668 3.80474 18.6332 3.80474 19.4142 4.58579C20.1953 5.36684 20.1953 6.63317 19.4142 7.41421L14.8284 12Z')
            path_userImg.setAttribute('fill', '#fff');
            path_userImg.id='path_userImg'
            userImgCross.appendChild(path_userImg);
            userImgCross.id = 'userImgCross';
            // userImgCross.setAttribute('class', 'No');
            userImgBack.appendChild(userImgCross);

            var userImg_underImg=document.createElement('a')
            userImg_underImg.id='userImg_underImg'
            userImg_underImg.style.width='100%'
            userImg_underImg.style.height='40%'
            userImg_underImg.style.position='fixed'
            userImg_underImg.style.top='0px'
            document.body.appendChild(userImg_underImg)

            GM_xmlhttpRequest({
                method: "GET",
                url: "https://www.pixiv.net/ajax/user/"+userImg_id+"/profile/all?lang=zh",
                headers:{
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36 Edg/93.0.961.52",
                },
                onload: function(res) {
                    if(res.status === 200){
                        //console.log('成功')
                        var p=res.responseText
                        var user_illust=p.match(/(?<=\")\d+(?=\":null)/g)
                        if(user_illust.length>=35){
                            var userImg_length=35
                            }
                        else{
                            userImg_length=user_illust.length
                        }
                        var userImg_allUrl
                        userImg_allUrl='https://www.pixiv.net/ajax/user/'+userImg_id+'/profile/illusts?'
                        for(var i=0;i<userImg_length;i++){
                            userImg_allUrl=userImg_allUrl+'ids%5B%5D='+user_illust[i]+'&'

                        }
                        userImg_allUrl=userImg_allUrl+'work_category=illustManga&is_first_page=0&lang=zh'


                        var src=[]//图片src
                        var id=[]//图片id
                        var title=[]//图片名称
                        var pageCount=[]//作品图片数
                        var R18=[]//作品是否为R-18，1为是，0为不是
                        var gif=[]//作品是否为动图，1为是，0为不是
                        var count=0
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: userImg_allUrl,
                            headers:{
                                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36 Edg/93.0.961.52",
                            },
                            onload: function(res) {
                                if(res.status === 200){
                                    // console.log('成功')
                                    var p=res.responseText
                                    var b=JSON.parse(p.replace(/\\(?!(\/|u))/g,'\\'))
                                    b=b.body.works
                                    // var b=p.match(/(?<=\d+":{).*?(?=,"\d+":{)/g)
                                    for(var i=0;i<Object.keys(b).length;i++){
                                        id[i]=b[user_illust[i]].id
                                        title[i]=b[user_illust[i]].title
                                        src[i]=b[user_illust[i]].url
                                        pageCount[i]=b[user_illust[i]].pageCount
                                        gif[i]='0'
                                        if(b[user_illust[i]].illustType==2){
                                            gif[i]='1'
                                        }
                                        R18[i]='0'
                                        if(b[user_illust[i]].tags.toString().match('R\-18')!=null){
                                            R18[i]='1'
                                        }
                                    }
                                    for(var j=0;j<30;j++){
                                        var userSrc=src[j].replace(/\\/g,'')
                                        var uni=title[j]
                                        var href='https://www.pixiv.net/artworks/'+id[j]

                                        var userImgAll=document.createElement('div')//单个添加元素（图片和文字）
                                        userImgAll.className='userImgAll'
                                        userImgUl.appendChild(userImgAll)

                                        if(pageCount[j]!=1){
                                            var userPageAll=document.createElement('div')
                                            userPageAll.className='userPageAll'
                                            var k=pageCount[j].toString().split('').length
                                            if(k>=3){
                                                userPageAll.style.width='43px'
                                                userPageAll.style.left='132px'
                                            }
                                            else if(k==2){
                                                userPageAll.style.width='36px'
                                                userPageAll.style.left='140px'
                                            }
                                            else if(k==1){
                                                userPageAll.style.width='30px'
                                                userPageAll.style.left='146px'
                                            }
                                            userImgAll.appendChild(userPageAll)

                                            var userImgPageSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                                            var path_Img = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                                            userImgPageSvg.setAttribute("aria-hidden","true");
                                            userImgPageSvg.setAttribute('viewbox', '0 0 9 10');
                                            userImgPageSvg.setAttribute('width', '24px');
                                            userImgPageSvg.setAttribute('height', '24px');
                                            path_Img.setAttribute('d','M8,3 C8.55228475,3 9,3.44771525 9,4 L9,9 C9,9.55228475 8.55228475,10 8,10 L3,10 C2.44771525,10 2,9.55228475 2,9 L6,9 C7.1045695,9 8,8.1045695 8,7 L8,3 Z M1,1 L6,1 C6.55228475,1 7,1.44771525 7,2 L7,7 C7,7.55228475 6.55228475,8 6,8 L1,8 C0.44771525,8 0,7.55228475 0,7 L0,2 C0,1.44771525 0.44771525,1 1,1 Z')
                                            path_Img.setAttribute('fill', '#fff');
                                            userImgPageSvg.appendChild(path_Img);
                                            userImgPageSvg.id='userImgPageSvg'
                                            userPageAll.appendChild(userImgPageSvg);

                                            var userPageText=document.createElement('text')
                                            userPageText.className='userPageText'
                                            userPageText.innerText=pageCount[j]
                                            userPageAll.appendChild(userPageText)
                                        }

                                        if(R18[j]=='1'){
                                            var userImgR18=document.createElement('text')
                                            userImgR18.className='userImgR18'
                                            userImgR18.innerText='R-18'
                                            if(pageCount[j]!=1){
                                                userImgR18.style.left='-27px'
                                            }
                                            userImgAll.appendChild(userImgR18)
                                        }

                                        var userImgPic=document.createElement('img')//单个图片
                                        userImgPic.className='userImgPic'
                                        userImgPic.src=userSrc
                                        userImgPic.href=href
                                        if(gif[j]=='1'){
                                            userImgPic.style.top='18px'
                                        }
                                        userImgAll.appendChild(userImgPic)

                                        if(gif[j]=='1'){
                                            var userImgGif = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                                            var path_Gif = '<circle cx="12" cy="12" r="10" class="sc-192k5ld-1 lajlxF"></circle><path d="M9,8.74841664 L9,15.2515834 C9,15.8038681 9.44771525,16.2515834 10,16.2515834C10.1782928,16.2515834 10.3533435,16.2039156 10.5070201,16.1135176 L16.0347118,12.8619342C16.510745,12.5819147 16.6696454,11.969013 16.3896259,11.4929799C16.3034179,11.3464262 16.1812655,11.2242738 16.0347118,11.1380658 L10.5070201,7.88648243C10.030987,7.60646294 9.41808527,7.76536339 9.13806578,8.24139652C9.04766776,8.39507316 9,8.57012386 9,8.74841664 Z" class="sc-192k5ld-2 jwyUTl"></path>'
                                            userImgGif.setAttribute("aria-hidden","true");
                                            userImgGif.setAttribute('width', '24px');
                                            userImgGif.setAttribute('height', '24px');
                                            userImgGif.setAttribute('viewbox', '0 0 24 24');
                                            userImgGif.innerHTML=path_Gif
                                            userImgGif.id='userImgGif'
                                            userImgAll.appendChild(userImgGif);
                                        }

                                        var userImgText=document.createElement('a')
                                        userImgText.className='userImgText'
                                        userImgText.innerText=eval("'"+uni+"'")
                                        userImgText.href=href
                                        if(gif[j]=='1'){
                                            userImgText.style.top='29px'
                                        }
                                        userImgAll.appendChild(userImgText)
                                    }
                                }
                            }
                        })
                    }
                    else{console.log("失败")}
                }
            })
        }
    }
    //相似作者推荐
    function add_recommend(url_1,user_href_1,url_2,user_href_2,url_3,user_href_3,user_pic,user_title_view,user_id,user_url,left){
        var recom=document.createElement("li")
        var recommend_out=document.getElementById("recommend_inner_real")//id通过创建时添加，为可以放置li文件的上一个元素
        recommend_out.appendChild(recom)
        var outerHtml=`<li class="li_all" id="li_all"  style="position:absolute;top:0px;left:*leftpx;transform: translateY(0px) scale(1) rotateZ(0deg); opacity: 1; z-index: 1;">
	<div class="li_all_2" style="width: 392px;background-color: rgb(255, 255, 255);-webkit-mask-image: -webkit-radial-gradient(center,white,black);border-radius: 8px;overflow: hidden;">
		<div class="li_all_3" style="display: flex;">
			<div class="li_pic" style="width: 33.333%;height: 130px;overflow: hidden;">
				<div class="li_all_5" style="width: 136px;">
					<div type="illust" size="136" class="li_all_6" style="position: relative;">
						<div width="136" height="136" class="li_all_7" style="position: relative;z-index: 0;width: 136px;height: 136px;">
							<a class="li_a_1" id="li_a_1" data-gtm-value="*user_id" href="*user_href_1" style="text-decoration: none;">
								<div class="li_a_1_nom" style="position: absolute;top: 0px;left: 0px;right: 0px;box-sizing: border-box;display: flex;align-items: flex-start;padding: 4px 4px 0px;z-index: 1;"></div>
								<div class="li_img_out_1" id="li_img_out_1" style="position: relative;display: flex;-webkit-box-align: center;align-items: center;-webkit-box-pack: center;justify-content: center;width: 100%;height: 100%;">
									<img src="*url_1" alt="*name" class="li_img_1" id="li_img_1" style="width: 100%;height: 100%;border-radius: 0px;background-color: rgb(255, 255, 255);transition: opacity 0.2s ease 0s;object-fit: cover; object-position: center center;">
								</div>
							</a>
						</div>
					</div>
				</div>
			</div>
			<div class="li_pic" style="width: 33.333%;height: 130px;overflow: hidden;">
				<div class="li_all_5" style="width: 136px;">
					<div type="illust" size="136" class="li_all_6" style="position: relative;">
						<div width="136" height="136" class="li_all_7" style="position: relative;z-index: 0;width: 136px;height: 136px;">
							<a class="li_a_2" id="li_a_2" data-gtm-value="*user_id" href="*user_href_2" style="text-decoration: none;">
								<div class="li_a_2_nom" style="position: absolute;top: 0px;left: 0px;right: 0px;box-sizing: border-box;display: flex;align-items: flex-start;padding: 4px 4px 0px;z-index: 1;"></div>
								<div class="li_img_out_2" id="li_img_out_2" style="position: relative;display: flex;-webkit-box-align: center;align-items: center;-webkit-box-pack: center;justify-content: center;width: 100%;height: 100%;">
									<img src="*url_2" alt="*name" class="li_img_2" id="li_img_2" style="width: 100%;height: 100%;border-radius: 0px;background-color: rgb(255, 255, 255);transition: opacity 0.2s ease 0s;object-fit: cover; object-position: center center;">
								</div>
							</a>
						</div>
					</div>
				</div>
			</div>
			<div class="li_pic" style="width: 33.333%;height: 130px;overflow: hidden;">
				<div class="li_all_5" style="width: 136px;">
					<div type="illust" size="136" class="li_all_6" style="position: relative;">
						<div width="136" height="136" class="li_all_7" style="position: relative;z-index: 0;width: 136px;height: 136px;">
							<a class="li_a_3" id="li_a_3" data-gtm-value="*user_id" href="*user_href_3" style="text-decoration: none;">
								<div class="li_a_3_nom" style="position: absolute;top: 0px;left: 0px;right: 0px;box-sizing: border-box;display: flex;align-items: flex-start;padding: 4px 4px 0px;z-index: 1;"></div>
								<div class="li_img_out_3" id="li_img_out_3" style="position: relative;display: flex;-webkit-box-align: center;align-items: center;-webkit-box-pack: center;justify-content: center;width: 100%;height: 100%;">
									<img src="*url_3" alt="*name" class="li_img_3" id="li_img_3" style="width: 100%;height: 100%;border-radius: 0px;background-color: rgb(255, 255, 255);transition: opacity 0.2s ease 0s;object-fit: cover; object-position: center center;">
								</div>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="li_all_3" style="display: flex;-webkit-box-align: center;align-items: center;padding: 0px 16px;height: 64px;">
			<a class="li_a_3" id="li_a_3" data-gtm-value="*recommend_id" href="*recommend_user_url" style="color: inherit;text-decoration: none;">
				<div class="li_name" size="40" title="*user_user_name" role="img" class="sc-1asno00-0 jIsznR">
					<img class="li_img_4" id="li_img_4" src="*user_pic" width="40" height="40" alt="*user_name" style="border-radius:20px;object-fit: cover; object-position: center top;">
				</div>
			</a>
			<div class="li_a_out"style="display: grid;color: rgba(0, 0, 0, 0.88);font-weight: bold;font-size: 14px;line-height: 22px;padding: 0px 8px;margin: auto 0px;flex: 1 1 0%;overflow: hidden;">
				<a class="li_a_4" id="li_a_4" data-gtm-value="*user_id" href="*user_url">*user_title_view</a>
			</div>
		</div>
	</div>
</li>`
        outerHtml=outerHtml.replace("*url_1",url_1)
        outerHtml=outerHtml.replace("*url_2",url_2)
        outerHtml=outerHtml.replace("*url_3",url_3)
        outerHtml=outerHtml.replace("*user_href_1",user_href_1)
        outerHtml=outerHtml.replace("*user_href_2",user_href_2)
        outerHtml=outerHtml.replace("*user_href_3",user_href_3)
        outerHtml=outerHtml.replace("*user_pic",user_pic)
        outerHtml=outerHtml.replace("*user_title_view",user_title_view)
        outerHtml=outerHtml.replace("*user_id",user_id)
        outerHtml=outerHtml.replace("*user_url",user_url)
        outerHtml=outerHtml.replace("*recommend_user_url",user_url)
        outerHtml=outerHtml.replace("*left",left)
        recom.outerHTML=outerHtml
    }

    function aside(type){
        if(document.getElementsByTagName("aside").length!=0&&window.location.href.match('#preview')==null&&window.location.href.match('bookmarks')==null){
            var user_id=document.getElementsByTagName("aside")[0].innerHTML.match(/(?<=\/users\/)\d+/)
            //------
            if(user_id!=null){
                user_id=user_id[0]
            }
            //------
            if(type=="recommend"){
                var getURL='https://www.pixiv.net/rpc/index.php?mode=following_user_detail&user_id='+user_id+'&lang=zh'
                }
            GM_xmlhttpRequest({
                method: "GET",
                url: getURL,
                headers:{
                    "x-user-id":10000000
                },
                onload: function(res) {
                    if(res.status === 200){
                        //console.log('成功')
                        var p=res.responseText
                        if(type=="recommend"){
                            var replace=p.match(/(?<="restrict":")\d+/)[0]
                            if(replace!=null){
                                setCookie("aside",getCookie("aside").replace(/\d+(?=\,)/,replace),90)//0为关注，1为隐私关注
                            }
                            else{
                                setCookie("aside",getCookie("aside").replace(/\d+(?=\,)/,2),90)//2为未关注
                            }
                        }
                    }
                    else{// if(res.status == 400){
                        setCookie("aside",getCookie("aside").replace(/\d+(?=\,)/,2),90)//2为未关注
                        // console.log("关注获取失败，锚点“function aside(type)”")
                    }
                }
            })
        }
    }

    function getFinalUrl(k,e,num){//k=0为ctrl事件，k=1为alt事件,k=2为核爆，e为event即事件，num为图片数量
        cookie_size()
        if(getCookie('Size')==2){
            if(k!=0){
                return
            }
        }
        var block=""//防止cat和re在“图片数量限制”的影响下出现多张图片不加“-1”的情况
        var num_alt=num
        var lastUrl=""//最终需要设置为cookie的元素
        var set_moe
        if(k==2&&document.getElementsByClassName("sc-9y4be5-1 jtUPOE")[0].children.length!=0){//核爆事件；"document"部分用来判定页面上是否有可以核爆的元素，防止报错
            var ULpicture=document.getElementsByClassName("sc-9y4be5-1 jtUPOE")[0].children
            for(var w=0;w<ULpicture.length;w++){
                var num_explode=getPageNum(0,ULpicture[w])
                if(ULpicture[w].outerHTML.match(/(?<=\d{1,3}\/)\d{6,10}(?=_p)/)!=null){
                    lastUrl=lastUrl+ULpicture[w].outerHTML.match(/(?<=\d{1,3}\/)\d{6,10}(?=_p)/)[0]+"*"+num_explode+","
                }
            }
            setCookie("user_url",lastUrl,-1)
        }

        if(parseInt(num)>getCookie("slider")){//alt和ctrl时判断是否大于“最大打开次数”
            num=1
            block="-1"
        }

        if(e!=-1){
            if(getCookie("outUrl")==0){//0为cat
                var cat_id=e.target.src.match(/\d{6,10}/)[0]//window.location.href.match(/\d{6,10}/)
                if(num>1){
                    if(k==0){
                        for(var i=1;i<parseInt(num)+1;i++){
                            window.open("https://pixiv.cat/"+cat_id+"-"+i+".png")
                        }
                    }
                    else if(k==1){
                        setCookie("pixivid"+lastcookie(),cat_id+"*"+num_alt,-1)
                    }
                }
                else{
                    if(k==0){
                        window.open("https://pixiv.cat/"+cat_id+block+".png")
                    }
                    else if(k==1){
                        setCookie("pixivid"+lastcookie(),cat_id+"*"+num_alt,-1)
                    }
                }
            }

            else if(getCookie("outUrl")==1){//1为re
                var re_id=e.target.src.match(/\d{6,10}/)[0]//window.location.href.match(/\d{6,10}/)
                if(num>1){
                    if(k==0){
                        for(var j=1;j<parseInt(num)+1;j++){
                            window.open("https://pixiv.re/"+re_id+"-"+j+".png")
                        }
                    }
                    else if(k==1){
                        setCookie("pixivid"+lastcookie(),re_id+"*"+num_alt,-1)
                    }
                }
                else{
                    if(k==0){
                        window.open("https://pixiv.re/"+re_id+block+".png")
                    }
                    else if(k==1){
                        setCookie("pixivid"+lastcookie(),re_id+"*"+num_alt,-1)
                    }
                }
            }

            else if(getCookie("outUrl")==2){//2代表使用moe
                var moe_pid=e.target.src.match(/\d{6,10}/)[0]
                if(moe_pid!=null){
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: "https://www.pixiv.net/artworks/"+moe_pid,
                        headers:{
                            "User-Agent": navigator.userAgent,
                        },
                        onload: function(res) {
                            if(res.status === 200){
                                //console.log('成功')
                                var p=res.responseText
                                var moe_url1=p.split('"original":"')[1]
                                var moe_url2=moe_url1.split('"},"tags":{"')[0]//moe_url1和2根据原始url的前后端框住真实url
                                var moe_url_model="https://i.pixiv.re/"+moe_url2.split("i.pximg.net/")[1]//+"@progressive.webp"//https://api.pixiv.moe/image/i.pximg.net/img-original/img/2021/10/14/00/49/28/93428795_p0.png@progressive.webp
                                for(var i=0;i<num;i++){
                                    if(k==0){
                                        window.open(moe_url_model.replace(/p\d{1,2}/,"p"+i),"_blank")
                                    }
                                }
                                setCookie("pixivid"+lastcookie(),moe_url2.split("https://")[1].split("/img/")[1]+"*"+num_alt,-1)
                            }
                        }
                    })
                }
            }
        }
    }

    //——————————————————————————————————————————————R-18模糊函数开始
    function r18_block(blur){
        var match_1=/([_=:;&\-\/\.\?\d\w]+?illust_id=(\d+)(?:&|$|))/
        var match_2=/(http(?:s|):\/\/[_\-\/\.\d\w]+?\/(\d{4,})_p\d{1,4}[_\-\/\.\d\w]*)/
        var match_3=/(http(?:s|):\/\/[_\-\/\.\d\w]+?\/(\d{4,})_square\d{0,4})/
        var pp=0
        var qq=0
        new MutationObserver(mutations => {//动图预览相关
            if(window.location.href.match('#preview')!=null){
                var root=document.getElementById('root')
                if(root!=null){
                    root.style.display='none'
                }
                // console.log('------------------')
                for(var k=0;k<mutations.length;k++){
                    if(qq==0&&mutations[k].addedNodes[0]!=null&&mutations[k].addedNodes[0].className=='sc-tu09d3-1 inGOuX'){
                        var canvas_div=mutations[k].addedNodes[0]
                        document.body.insertBefore(canvas_div,root)
                        document.body.style.overflow='hidden'
                        for(var q=0;q<canvas_div.childNodes.length;q++){
                            if(canvas_div.childNodes[q].tagName=='CANVAS'){
                                canvas_div.childNodes[q].id='iframe_canvas'
                                canvas_div.style.width=canvas_div.childNodes[q].width+'px'
                                canvas_div.style.height=canvas_div.childNodes[q].height+'px'
                                break
                            }
                        }
                        qq=1
                    }
                }
            }
            /*             for(var o=0;o<mutations.length;o++){
                //console.log(mutations[o].addedNodes)
                if(mutations[o].addedNodes[0]!=null&&mutations[o].addedNodes[0].closest('.sc-8dwwmi-0 eHTuWt')!=null){
                    document.getElementsByClassName('sc-8dwwmi-0 eHTuWt')[0].remove()
                }
            } */
            for(var i=0;i<mutations.length;i++){
                if(mutations[i].addedNodes.length!=0){
                    if(mutations[i].addedNodes[0].src!=null){
                        if(mutations[i].addedNodes[0].src.match(match_1)!=null||mutations[i].addedNodes[0].src.match(match_2)!=null||mutations[i].addedNodes[0].src.match(match_3)!=null){
                            if(mutations[i].addedNodes[0].src.match("master1200")==null){
                                switch(mutations[i].type) {
                                    case 'childList':
                                        var mutate=mutations[i].addedNodes[0]
                                        var count=0
                                        for(var j=0;j<10;j++){
                                            if(mutate==null){
                                                break
                                            }
                                            else if(mutate.className=="sc-k3uf3r-0 jTkWOR"){//悬停作者头像显示的弹框的class
                                                count=1
                                                break
                                            }
                                            else{
                                                mutate=mutate.parentNode
                                            }
                                        }
                                        if(count==0&&mutations[i].addedNodes[0].id!='bigImg_1'&&mutations[i].addedNodes[0].parentNode.parentNode.nextSibling!=null&&mutations[i].addedNodes[0].parentNode.parentNode.nextSibling.innerText.match("R-18")!=null){
                                            mutations[i].addedNodes[0].style.filter="blur("+blur+"px)"
                                        }
                                        break;
                                }
                            }
                        }
                    }
                    else if(mutations[i].addedNodes[0].childNodes[0]!=null&&mutations[i].addedNodes[0].childNodes[0].childNodes.length!=0&&mutations[i].addedNodes[0].childNodes[0].getElementsByClassName('sc-162tykz-1 bmXCSR')!='null'){//预览图部分预览作者
                        //向“sc-162tykz-1 bmXCSR”中添加按钮，移出时会自动删除，不用管
                        var user_out=document.getElementsByClassName('sc-k3uf3r-3 hZKJGk')[0]//用户悬停弹窗中“已关注”部分的父节点
                        if(user_out!=null){
                            if(document.getElementById('user_svg')==null){
                                var user_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                                var user_svg_path= document.createElementNS("http://www.w3.org/2000/svg", 'path');
                                user_svg.setAttribute("aria-hidden","true");
                                user_svg.setAttribute('viewbox', '0 0 20 20');
                                user_svg.setAttribute('width', '20px');
                                user_svg.setAttribute('height', '20px');
                                user_svg_path.setAttribute('d','M678.409391 581.630361l345.795505 345.727206-96.642434 96.642433L581.903555 678.204495z M394.765557 789.531115a394.765557 394.765557 0 1 1 394.765558-394.765558 394.765557 394.765557 0 0 1-394.765558 394.765558z m0-652.934036a258.168479 258.168479 0 1 0 258.168479 258.168478A258.851464 258.851464 0 0 0 394.765557 136.597079z')
                                user_svg_path.id="user_svg_path"
                                user_svg_path.style.transform='scale(0.018)'
                                user_svg_path.setAttribute('fill', '#000');
                                user_svg.appendChild(user_svg_path);
                                user_svg.id = 'user_svg';
                                user_out.appendChild(user_svg)
                                var user_svg_background=document.createElement('a')
                                user_svg_background.id='user_svg_background'
                                user_out.appendChild(user_svg_background)
                            }
                        }
                    }
                }
            }
            if(getCookie('unfold')==1){
                for(var e=0;e<mutations.length;e++){
                    if(mutations[e].addedNodes.length!=0){
                        for(var r=0;r<mutations[e].addedNodes.length;r++){
                            //console.log(mutations[i].addedNodes[r])
                            if(mutations[e].addedNodes.legnth!=0&&mutations[e].addedNodes[r].getElementsByClassName('sc-emr523-2 wEKy').length!=0){//作品页展开按钮
                                //console.log(mutations[e].addedNodes[r])
                                console.log('click')
                                mutations[e].addedNodes[r].getElementsByClassName('sc-emr523-2 wEKy')[0].click()
                            }
                        }
                    }
                }
            }
        }).observe(document.body, {childList: true, subtree: true})
    }

    function search_sort(){
        if(document.getElementById('sort_ul')==null&&document.getElementById('load_count_div')==null){
            allBookmark=[]
            if(window.location.href.match(/\/tags\//)!=null){

                var href=window.location.href
                var search_order='date_d',search_mode='all',search_type='all',search_s_mode='s_tag'

                if(href.match(/(?<=\/tags\/).*?(?=\/)/)!=null){
                    var search_name=href.match(/(?<=\/tags\/).*?(?=\/)/)[0]
                    }

                if(href.match(/(?<=order\=).*?(?=(\&|$))/)!=null){
                    search_order=href.match(/(?<=order\=).*?(?=(\&|$))/)[0]
                }

                if(href.match(/(?<=[^s\_]mode\=).*?(?=(\&|$))/)!=null){
                    search_mode=href.match(/(?<=[^s\_]mode\=).*?(?=(\&|$))/)[0]
                }

                if(href.match(/(?<=type\=).*?(?=(\&|$))/)!=null){
                    search_type=href.match(/(?<=type\=).*?(?=(\&|$))/)[0]
                }

                if(href.match(/(?<=s_mode\=).*?(?=(\&|$))/)!=null){
                    search_s_mode=href.match(/(?<=s_mode\=).*?(?=(\&|$))/)[0]
                }

                var finalURL='https://www.pixiv.net/ajax/search/artworks/'+search_name+'?word='+search_name+'&order='+search_order+'&mode='+search_mode+'&type='+search_type+'&s_mode='+search_s_mode+'&lang=zh'
                /*                 var sortPage=prompt('请输入排序页数')
                if(sortPage.match(',')!=null){
                    var sort_start=parseInt(sortPage.split(',')[0])
                    var sort_end=parseInt(sortPage.split(',')[1])
                    }
                else{
                    sort_start=1
                    sort_end=parseInt(sortPage)
                } */
                var sort_start=document.getElementById('sort_input_start').value
                var sort_end=document.getElementById('sort_input_end').value
                if(sort_start!=null&&sort_end!=null){
                    // details([58132914,58390527,58466452,58631790])
                    /*                     if(sort_end-sort_start>=22){
                        sort_end=sort_start+21
                    } */
                    var search_count=0
                    var idArr=[]
                    for(var i=sort_start-1;i<sort_end;i++){
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: finalURL+'&p='+(i+1),
                            cookie: "",
                            headers:{
                                "User-Agent": navigator.userAgent,
                                "x-user-id": Math.floor(Math.random()*10000000),
                            },
                            onload: function(res) {
                                if(res.status === 200){
                                    //console.log('成功')
                                    var p=res.responseText
                                    // console.log(p)
                                    var json=JSON.parse(p.replace(/\\(?!(\/|u))/g,'\\'))
                                    // idArr=idArr.concat(p.match(/(?<=[^bookmarkData\"\:]\{\"id\"\:\")\d+(?=\")/g))
                                    for(var n=0;n<json.body.illustManga.data.length;n++){
                                        idArr.push(json.body.illustManga.data[n].id)
                                    }
                                    if(search_count==sort_end-sort_start){
                                        details(idArr)
                                        console.log(idArr.toString())
                                    }
                                    search_count++
                                }
                            }
                        })
                    }
                }
            }
        }
    }


    // console.log(window.location.href.match(/\d{100}/)[0])
    function sortRequest(page,sortTag,stop,isR18,sum_count){
        allBookmark=[]
        var count=0
        var last_count=window.location.href.match(/(?<=\#sort\d+\.)\d+/)
        if(last_count!=null){
            last_count=last_count[0]
        }
        else{
            last_count=0
        }
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://api.moedog.org/pixiv/v2/?type=search&word="+sortTag+"&order=popular_desc&page="+page,
            headers:{
                "User-Agent": navigator.userAgent,
            },
            onload: function(res) {
                if(res.status === 200){
                    //console.log('成功')
                    var p=res.responseText
                    var json=JSON.parse(p.replace(/\\(?!(\/|u))/g,'\\'))
                    //console.log(json)
                    for(var e=0;e<30;e++){//数量锁定为30，有隐患！！！
                        count++
                        var R_18=false
                        if(JSON.stringify(json.illusts[e].tags).match(/(R18|R\-18)/)){
                            R_18=true
                        }
                        if((R_18==true&&isR18==1)||R_18==false&&isR18==2){//前者为作品为R18但不能看，后者为作品不是R18但需要看
                            continue
                        }
                        var bookmarkNum=json.illusts[e].total_bookmarks
                        var illustID=json.illusts[e].id
                        var illustName=json.illusts[e].title
                        var illustImg=json.illusts[e].image_urls.square_medium//.replace('https://i.pximg.net/c/128x128','https://i.pximg.net/c/250x250_80_a2')
                        var illustNumber=json.illusts[e].page_count
                        var illustType=json.illusts[e].type
                        if(illustType=='ugoira'){
                            illustType=2//动图
                        }
                        else{
                            illustType=0
                        }
                        var illustRestrict=2//暂时失效，因此固定为“未收藏”//json.body.illust_details.bookmark_restrict//0-普通收藏；1-隐私收藏；2-未收藏
                        if(illustRestrict==null){
                            illustRestrict=2
                        }
                        var authorID=json.illusts[e].user.id
                        var authorName=json.illusts[e].user.name
                        if(bookmarkNum.length!=0&&illustID.length!=0){
                            if(count>last_count){
                                allBookmark[e]=bookmarkNum+','+illustID+','+illustName+','+illustImg+','+illustNumber+','+illustType+','+R_18+','+illustRestrict+','+authorID+','+authorName
                                sum_count++
                            }
                        }
                        if(sum_count>=60){
                            break
                        }
                    }

                    //收藏数，作品id，作品名称，作品预览图，作品数量，作品类型，R_18，是否收藏，作者id，作者名称;
                    //var allBookmark_split=[]
                    for(var r=0;r<30;r++){
                        if(allBookmark[r]!=null){
                            var sort_info=allBookmark[r].split(',')
                            sort_addillust(sort_info[0],sort_info[1],sort_info[2],sort_info[3],sort_info[4],sort_info[5],sort_info[6],sort_info[7],sort_info[8],sort_info[9])
                        }
                    }

                    if(count!=30){
                        page--
                    }
                    if(window.location.href.match(/(?<=\#sort)\d+/)==null){
                        window.location.href=window.location.href+"#sort"+page
                    }
                    else{
                        window.location.href=window.location.href.replace(/(?<=\#sort)\d+/,page)
                    }
                    if(window.location.href.match(/(?<=\#sort\d+\.)\d+/)==null){
                        if(count==30){
                            window.location.href=window.location.href+"."+0
                        }
                        else{
                            window.location.href=window.location.href+"."+count
                        }
                    }
                    else{
                        if(count==30){
                            window.location.href=window.location.href.replace(/(?<=\#sort\d+\.)\d+/,0)
                        }
                        else{
                            window.location.href=window.location.href.replace(/(?<=\#sort\d+\.)\d+/,count)
                        }
                    }
                    if(sum_count<59){
                        sortRequest(page+1,sortTag,true,isR18,sum_count)
                    }
                }
            }
        })
    }
    function onlySort(keyword,page,stop){//stop:0为继续，1为停止
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://api.moedog.org/pixiv/v2/?type=search&word="+keyword+"&order=date_desc&page="+page,
            headers:{
                "User-Agent": navigator.userAgent,
            },
            onload: function(res) {
                if(res.status === 200){
                    //console.log('成功')
                    var p=res.responseText
                    var json=JSON.parse(p.replace(/\\(?!(\/|u))/g,'\\'))
                    console.log(res.finalUrl)
                    console.log(json)
                    for(var e=0;e<30;e++){
                        var R_18=false
                        if(JSON.stringify(json.illusts[e].tags).match(/(R18|R\-18)/)){
                            R_18=true
                        }
                        // if((R_18==true&&isR18==1)||R_18==false&&isR18==2){//前者为作品为R18但不能看，后者为作品不是R18但需要看
                        //     continue
                        // }
                        var bookmarkNum=json.illusts[e].total_bookmarks
                        var illustID=json.illusts[e].id
                        var illustName=json.illusts[e].title
                        var illustImg=json.illusts[e].image_urls.square_medium//.replace('https://i.pximg.net/c/128x128','https://i.pximg.net/c/250x250_80_a2')
                        var illustNumber=json.illusts[e].page_count
                        var illustType=json.illusts[e].type
                        if(illustType=='ugoira'){
                            illustType=2//动图
                        }
                        else{
                            illustType=0
                        }
                        var illustRestrict=2//暂时失效，因此固定为“未收藏”//json.body.illust_details.bookmark_restrict//0-普通收藏；1-隐私收藏；2-未收藏
                        if(illustRestrict==null){
                            illustRestrict=2
                        }
                        var authorID=json.illusts[e].user.id
                        var authorName=json.illusts[e].user.name
                        if(allBookmark[bookmarkNum]==null){
                            allBookmark[bookmarkNum]=bookmarkNum+','+illustID+','+illustName+','+illustImg+','+illustNumber+','+illustType+','+R_18+','+illustRestrict+','+authorID+','+authorName
                        }
                        else{
                            allBookmark[bookmarkNum]=allBookmark[bookmarkNum]+';'+bookmarkNum+','+illustID+','+illustName+','+illustImg+','+illustNumber+','+illustType+','+R_18+','+illustRestrict+','+authorID+','+authorName
                        }
                        //console.log(res.finalUrl)
                    }
                    if(stop==false){
                        onlySort(keyword,page+1,true)
                    }
                    else{
                        allBookmark = allBookmark.filter(function (s) {
                            if(s&&s.trim()){
                                return true
                            }
                            else{
                                return false
                            }
                        })
                        var allBookmarkSplit=[]
                        var allBookmarkSplit_count=0
                        for(var w=0;w<allBookmark.length;w++){
                            if(allBookmark[w].match(/;/)==null){
                                allBookmarkSplit[allBookmarkSplit_count]=allBookmark[w];
                                allBookmarkSplit_count++;
                            }
                            else{
                                for(var ew=0;ew<allBookmark[w].split(';').length;ew++){
                                    allBookmarkSplit[allBookmarkSplit_count]=allBookmark[w].split(';')[ew];
                                    allBookmarkSplit_count++;
                                }
                            }
                        }
                        //收藏数，作品id，作品名称，作品预览图，作品数量，作品类型，R_18，是否收藏，作者id，作者名称;
                        for(w=allBookmarkSplit.length-1;w>=0;w--){
                            var sort_info=allBookmarkSplit[w].split(',')
                            sort_addillust(sort_info[0],sort_info[1],sort_info[2],sort_info[3],sort_info[4],sort_info[5],sort_info[6],sort_info[7],sort_info[8],sort_info[9])
                        }
                    }
                    // else{
                    //console.log(allBookmarkSplit)
                    //console.log(allBookmark)
                    // }
                }
            }
        })
    }
    /*     window.addEventListener('keydown',function(e){
        if(e.keyCode==68){
            var sort_ul=document.createElement('ul')
            sort_ul.id='sort_ul'
            sort_ul.className='sort_ul'
            var sort_ul_out=document.getElementsByClassName('sc-l7cibp-0 juyBTC')[0]//搜索界面“预览图”框架的ul元素的父元素
            sort_ul_out.appendChild(sort_ul)
            if(document.getElementsByClassName('sc-l7cibp-3 gCRmsl')!=null){
                sort_ul_out.insertBefore(sort_ul,document.getElementsByClassName('sc-l7cibp-3 gCRmsl')[0])
            }
            document.getElementsByClassName('sc-l7cibp-1 krFoBL')[0].style.display='none'//原本搜索页ul元素
            document.getElementsByClassName('sc-l7cibp-3 gCRmsl')[0].style.display='none'//原本页面页码部分（换页）

            var sort_more_out=document.createElement('div')
            sort_more_out.id='sort_more_out'
            sort_ul_out.appendChild(sort_more_out)

            var keyword=window.location.href.match(/(?<=\/tags\/).*?(?=\/(artworks|illustrations|manga|novels))/)
            var page=window.location.href.match(/(?<=\&p=)\d+/)
            if(page==null){
                page=1
            }
            else{
                page=page[0]
            }
            if(keyword!=null&&page!=null){
                onlySort(keyword[0],page,false)
            }
            else{
                console.log("获取地址相关数据失败")
            }
        }
    }) */
    //——————————————————————————R-18模糊内容开始
    var original_url=window.location.href
    window.addEventListener('click',function(event){
        var new_url=window.location.href
        if(new_url!=original_url){
            if(getCookie("R-18_block")=="1"){
                r18_block(5)
            }
            else if(getCookie("R-18_block")=="0"||getCookie("R-18_block")==""){
                r18_block(0)
            }
            aside("recommend")
            original_url=window.location.href
        }
    })
    if(getCookie("R-18_block")=="1"){
        r18_block(5)
    }
    else if(getCookie("R-18_block")=="0"||getCookie("R-18_block")==""){
        r18_block(0)
    }
    //——————————————————————————————————————————R-18模糊结束


    window.addEventListener('load', function(){
        var style = document.createElement('style');
        style.innerHTML =
            '.fvHsDQ:after{'+
            'display:none;'+
            '}'+
            '.hYvGvO{'+
            'display:none;'+
            '}'
        ;
        document.body.appendChild(style);
    })
    window.addEventListener('contextmenu',function (event){
        if(getCookie('Size')!=2){
            //————————————————————————————————
            //————————————————————————————————
            var el=event.target
            if(el!=null){
                var url,pid,HTML,results
                if(event.ctrlKey==true){
                    HTML=el.outerHTML
                    for(var i in match_rules){
                        results=HTML.match(match_rules[i])
                        if(results!=null&&results.length>1){
                            url=results[1]
                            pid=results[2]
                            break
                        }
                    }
                    if(event.altKey!=true&&event.shiftKey!=true){
                        var pageNum=getPageNum(event,0)
                        getFinalUrl(0,event,pageNum)
                        event.preventDefault()
                    }
                }
                //——————————————————————————————————————————ctrl事件结束，alt事件开始
                //自动普通收藏↓↓↓
                if(event.altKey==true&&event.ctrlKey!=true){
                    // var del_element=event.target.closest('a').nextSibling.childNodes[0].childNodes[0].childNodes[0]//预览图中的svg元素（红心）
                    // if(del_element.childNodes.length==4||del_element.childNodes.length==5){
                    //     del_element.childNodes[del_element.childNodes.length-1].remove()
                    //     del_element.childNodes[del_element.childNodes.length-1].remove()
                    // }

                    isProhibit=0//0为未屏蔽，1为屏蔽
                    var cookie_tag_safe=[]
                    if(event.target.src==null){
                        var id=event.target.getElementsByTagName('img')[0].src.match(/\d{6,10}/)[0]
                        }
                    else{
                        id=event.target.src.match(/\d{6,10}/)[0]
                    }
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: "https://www.pixiv.net/artworks/"+id,
                        headers:{
                            "User-Agent": navigator.userAgent,
                        },
                        onload: function(res) {
                            if(res.status === 200){
                                //console.log('成功')
                                var p=res.responseText
                                var final=p.match(/(?<="tag":").*?(?=")/g).toString().split(',')
                                if(GM_getValue('tagSaveSafe')==''){
                                    var tag_cookie=tagSaveSafe.split('*')
                                    }
                                else{
                                    tag_cookie=GM_getValue('tagSaveSafe').split('*')
                                }
                                if(GM_getValue('tagProhibit')==null)
                                {
                                    var tag_Prohibit=''
                                    }
                                else
                                {
                                    tag_Prohibit=GM_getValue('tagProhibit')
                                }
                                cookie_tag_safe[0]='全部'
                                var count=1
                                var LoopFlag=1//记录在循环中执行了几次，排查死循环的问题
                                if(getCookie('tagCookieSetting')==1){
                                    for(var i=0;i<final.length;i++){
                                        for(var j=0;j<tag_cookie.length;j++){
                                            LoopFlag++;
                                            if(LoopFlag==500){alert(LoopFlag);console.log(LoopFlag);break;}
                                            if(tag_Prohibit.match(final[i])!=null){
                                                isProhibit=final[i];
                                                break;
                                            }
                                            if(tag_cookie[j].match(final[i])!=null){
                                                cookie_tag_safe[count]=tag_cookie[j].split(',')[0]
                                                count++
                                            }
                                        }
                                        if(isProhibit==1){
                                            break;
                                        }
                                    }
                                }
                                console.log(LoopFlag);
                                if(isProhibit==0){
                                    fetch("https://www.pixiv.net/ajax/illusts/bookmarks/add",{
                                        headers: {
                                            "accept": "application/json",
                                            "content-type": "application/json; charset=utf-8",
                                            "x-csrf-token": getCookie('token')
                                        },
                                        "referrer": "https://www.pixiv.net",
                                        'method':'POST',
                                        'body':JSON.stringify({illust_id: id, restrict: 0, comment: "", tags: cookie_tag_safe})//不确定restrict全年龄时的数值
                                    }).then(res=>{
                                        loveTagView(cookie_tag_safe)
                                        // event.target.closest('a').nextSibling.outerHTML=`<div class="sc-iasfms-2 eDNlMk"><div class=""><button type="button" class="sc-kgq5hw-0 fgVkZi"><svg viewBox="0 0 32 32" width="32" height="32" class="sc-j89e3c-1 bXjFLc"><path d="M21,5.5 C24.8659932,5.5 28,8.63400675 28,12.5 C28,18.2694439 24.2975093,23.1517313 17.2206059,27.1100183C16.4622493,27.5342993 15.5379984,27.5343235 14.779626,27.110148 C7.70250208,23.1517462 4,18.2694529 4,12.5C4,8.63400691 7.13400681,5.5 11,5.5 C12.829814,5.5 14.6210123,6.4144028 16,7.8282366C17.3789877,6.4144028 19.170186,5.5 21,5.5 Z" style="    fill: rgb(255, 64, 96);"></path><path d="M16,11.3317089 C15.0857201,9.28334665 13.0491506,7.5 11,7.5C8.23857625,7.5 6,9.73857647 6,12.5 C6,17.4386065 9.2519779,21.7268174 15.7559337,25.3646328C15.9076021,25.4494645 16.092439,25.4494644 16.2441073,25.3646326 C22.7480325,21.7268037 26,17.4385986 26,12.5C26,9.73857625 23.7614237,7.5 21,7.5 C18.9508494,7.5 16.9142799,9.28334665 16,11.3317089 Z" class="sc-j89e3c-0 dUurgf" style="    fill: rgb(255, 64, 96);"></path></svg></button></div></div>`
                                        var button=event.target.closest('a').nextSibling.getElementsByTagName('button')
                                        if(button.length==0){
                                            button=event.target.closest('a').nextSibling.nextSibling.getElementsByTagName('button')[0]
                                        }
                                        else{
                                            button=button[0]
                                        }
                                        if(button!=null){
                                            button.childNodes[0].childNodes[0].style.fill='red'
                                            button.childNodes[0].childNodes[1].style.fill='red'
                                        }
                                    })
                                }
                                else{
                                    alert('包含屏蔽标签'+isProhibit)
                                }
                            }
                        }
                    })
                    event.preventDefault()
                }
                if(event.altKey==true&&event.ctrlKey==true){
                    // del_element=event.target.closest('a').nextSibling.childNodes[0].childNodes[0].childNodes[0]//预览图中的svg元素（红心）
                    // if(del_element.childNodes.length!=4&&del_element.childNodes.length!=5){//判定是否为已经隐私收藏了

                    isProhibit=0//0为未屏蔽，1为屏蔽
                    var cookie_tag=[]
                    id=event.target.src.match(/\d{6,10}/)[0]
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: "https://www.pixiv.net/artworks/"+id,
                        headers:{
                            "User-Agent": navigator.userAgent,
                        },
                        onload: function(res) {
                            if(res.status === 200){
                                //console.log('成功')
                                var p=res.responseText
                                var final=p.match(/(?<="tag":").*?(?=")/g).toString().split(',')
                                // console.log(final)
                                if(GM_getValue('tagSave')==''){
                                    var tag_cookie=tagSave.split('*')
                                    }
                                else{
                                    tag_cookie=GM_getValue('tagSave').split('*')
                                }
                                if(GM_getValue('tagProhibit')==''){
                                    var tag_Prohibit=''
                                    }
                                else{
                                    tag_Prohibit=GM_getValue('tagProhibit')
                                }
                                cookie_tag[0]='全部'
                                var count=1
                                if(getCookie('tagCookieSetting')==1){
                                    for(var i=0;i<final.length;i++){
                                        for(var j=0;j<tag_cookie.length;j++){
                                            if(tag_Prohibit.match(final[i])!=null){
                                                isProhibit=final[i];
                                                break;
                                            }
                                            if(tag_cookie[j].match(final[i])!=null){
                                                cookie_tag[count]=tag_cookie[j].split(',')[0]
                                                count++
                                            }
                                        }
                                        if(isProhibit==1){
                                            break;
                                        }
                                    }
                                }
                                // if(isProhibit==0){
                                fetch("https://www.pixiv.net/ajax/illusts/bookmarks/add",{
                                    headers: {
                                        "accept": "application/json",
                                        "content-type": "application/json; charset=utf-8",
                                        "x-csrf-token": getCookie('token')
                                    },
                                    "referrer": "https://www.pixiv.net",
                                    'method':'POST',
                                    'body':JSON.stringify({illust_id: id, restrict: 1, comment: "", tags: cookie_tag})
                                }).then(res=>{
                                    loveTagView(cookie_tag)
                                    var button=event.target.closest('a').nextSibling.getElementsByTagName('button')
                                    if(button.length==0){
                                        button=event.target.closest('a').nextSibling.nextSibling.getElementsByTagName('button')[0]
                                    }
                                    else{
                                        button=button[0]
                                    }
                                    if(button!=null){
                                        button.childNodes[0].childNodes[0].style.fill='red'
                                        button.childNodes[0].childNodes[1].style.fill='red'
                                        var path_3 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                                        var path_4 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                                        path_3.setAttribute('d','M29.9796 20.5234C31.1865 21.2121 32 22.511 32 24V28 C32 30.2091 30.2091 32 28 32H21C18.7909 32 17 30.2091 17 28V24C17 22.511 17.8135 21.2121 19.0204 20.5234 C19.2619 17.709 21.623 15.5 24.5 15.5C27.377 15.5 29.7381 17.709 29.9796 20.5234Z')
                                        path_4.setAttribute('d','M28 22C29.1046 22 30 22.8954 30 24V28C30 29.1046 29.1046 30 28 30H21 C19.8954 30 19 29.1046 19 28V24C19 22.8954 19.8954 22 21 22V21C21 19.067 22.567 17.5 24.5 17.5 C26.433 17.5 28 19.067 28 21V22ZM23 21C23 20.1716 23.6716 19.5 24.5 19.5C25.3284 19.5 26 20.1716 26 21V22H23 V21Z')
                                        path_3.setAttribute('fill','white')
                                        path_4.setAttribute('fill','black')
                                        button.childNodes[0].appendChild(path_3)
                                        button.childNodes[0].appendChild(path_4)
                                    }
                                })
                                // }
                                // else{
                                if(isProhibit!=0){
                                    alert('包含屏蔽标签'+isProhibit)
                                }
                                // }
                            }
                        }
                    })
                    getFinalUrl(1,event,getPageNum(event,0))
                    event.preventDefault()
                    // }
                }
                if(event.altKey!=true&&event.ctrlKey!=true&&event.target.closest('svg')!=null&&event.target.closest('button')!=null){
                    isProhibit=0//0为未屏蔽，1为屏蔽
                    cookie_tag=[]
                    id=event.target.closest('button').parentNode.parentNode.previousSibling.href.match(/\d{6,10}/)[0]
                    event.preventDefault()
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: "https://www.pixiv.net/artworks/"+id,
                        headers:{
                            "User-Agent": navigator.userAgent,
                        },
                        onload: function(res) {
                            if(res.status === 200){
                                //console.log('成功')
                                var p=res.responseText
                                var final=p.match(/(?<="tag":").*?(?=")/g).toString().split(',')
                                // console.log(final)
                                if(GM_getValue('tagSave')==''){
                                    var tag_cookie=tagSave.split('*')
                                    }
                                else{
                                    tag_cookie=GM_getValue('tagSave').split('*')
                                }
                                if(GM_getValue('tagProhibit')==''){
                                    var tag_Prohibit=''
                                    }
                                else{
                                    tag_Prohibit=GM_getValue('tagProhibit')
                                }
                                cookie_tag[0]='全部'
                                var count=1
                                if(getCookie('tagCookieSetting')==1){
                                    for(var i=0;i<final.length;i++){
                                        for(var j=0;j<tag_cookie.length;j++){
                                            if(tag_Prohibit.match(final[i])!=null){
                                                isProhibit=final[i];
                                                break;
                                            }
                                            if(tag_cookie[j].match(final[i])!=null){
                                                cookie_tag[count]=tag_cookie[j].split(',')[0]
                                                count++
                                            }
                                        }
                                        if(isProhibit==1){
                                            break;
                                        }
                                    }
                                }
                                // if(isProhibit==0){
                                fetch("https://www.pixiv.net/ajax/illusts/bookmarks/add",{
                                    headers: {
                                        "accept": "application/json",
                                        "content-type": "application/json; charset=utf-8",
                                        "x-csrf-token": getCookie('token')
                                    },
                                    "referrer": "https://www.pixiv.net",
                                    'method':'POST',
                                    'body':JSON.stringify({illust_id: id, restrict: 1, comment: "", tags: cookie_tag})
                                }).then(res=>{
                                    loveTagView(cookie_tag)
                                    var button=event.target.closest('button')
                                    if(button!=null){
                                        button.childNodes[0].childNodes[0].style.fill='red'
                                        button.childNodes[0].childNodes[1].style.fill='red'
                                        var path_5 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                                        var path_6 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                                        path_5.setAttribute('d','M29.9796 20.5234C31.1865 21.2121 32 22.511 32 24V28 C32 30.2091 30.2091 32 28 32H21C18.7909 32 17 30.2091 17 28V24C17 22.511 17.8135 21.2121 19.0204 20.5234 C19.2619 17.709 21.623 15.5 24.5 15.5C27.377 15.5 29.7381 17.709 29.9796 20.5234Z')
                                        path_6.setAttribute('d','M28 22C29.1046 22 30 22.8954 30 24V28C30 29.1046 29.1046 30 28 30H21 C19.8954 30 19 29.1046 19 28V24C19 22.8954 19.8954 22 21 22V21C21 19.067 22.567 17.5 24.5 17.5 C26.433 17.5 28 19.067 28 21V22ZM23 21C23 20.1716 23.6716 19.5 24.5 19.5C25.3284 19.5 26 20.1716 26 21V22H23 V21Z')
                                        path_5.setAttribute('fill','white')
                                        path_6.setAttribute('fill','black')
                                        button.childNodes[0].appendChild(path_5)
                                        button.childNodes[0].appendChild(path_6)
                                    }
                                })
                                // }
                                // else{
                                if(isProhibit!=0){
                                    alert('包含屏蔽标签'+isProhibit)
                                }
                                // }
                            }
                        }
                    })
                    getFinalUrl(1,event,getPageNum(event,0))
                    // }
                }
                if(event.ctrlKey==true&&event.shiftKey==true){//直接下载图片
                    var html_pid=event.target.src.split("/")[event.target.src.split("/").length-1].split("_")[0]

                    GM_xmlhttpRequest({
                        method: "GET",
                        url: "https://www.pixiv.net/ajax/illust/"+html_pid,
                        headers:{
                            "User-Agent": navigator.userAgent,
                        },
                        onload: function(res) {
                            if(res.status === 200){
                                //console.log('成功')
                                var p=res.responseText
                                console.log(p)
                                var p_json=JSON.parse(p)
                                console.log(p_json)
                                if(p_json.body.pageCount>1){
                                    var moe_url2=p_json.body.urls.original
                                    var moe_url_model="https://i.pixiv.re/"+moe_url2.split("i.pximg.net/")[1]//+"@progressive.webp"//https://api.pixiv.moe/image/i.pximg.net/img-original/img/2021/10/14/00/49/28/93428795_p0.png@progressive.webp
                                    for(var i=0;i<p_json.body.pageCount;i++){
                                        //window.open(moe_url_model.replace(/p\d{1,2}/,"p"+i),"_blank")
                                        downloadIamge(moe_url_model.replace(/p\d{1,2}/,"p"+i),html_pid+'_p'+i+moe_url_model.match(/\.([^.]*)$/)[0])
                                    }
                                }
                                else{
                                    moe_url2=p_json.body.urls.original
                                    moe_url_model="https://i.pixiv.re/"+moe_url2.split("i.pximg.net/")[1]//+"@progressive.webp"//https://api.pixiv.moe/image/i.pximg.net/img-original/img/2021/10/14/00/49/28/93428795_p0.png@progressive.webp
                                    downloadIamge(moe_url_model.replace(/p\d{1,2}/,"p0"),html_pid+'_p0'+moe_url_model.match(/\.([^.]*)$/)[0])
                                }
                            }
                        }
                    })
                    event.preventDefault()
                    /*
                    if(down_1!=undefined){
                        var down_2=down_1.childNodes[0].innerText
                        var html_pid=event.target.src.split("/")[event.target.src.split("/").length-1].split("_")[0]
                        for(var img_num=1;img_num<=down_2;img_num++){
                            //downlad_img("https://pixiv.re/"+html_pid+"-"+img_num+".png")
                            downloadIamge("https://pixiv.re/"+html_pid+"-"+img_num+".png",html_pid+"_"+(img_num-1))
                        }
                    }
                    else{
                        html_pid=event.target.src.split("/")[event.target.src.split("/").length-1].split("_")[0]
                        downloadIamge("https://pixiv.re/"+html_pid+".png",html_pid+"_0")
                    }
                    */
                }
                // if(event.ctrlKey!=true&&event.altKey!=true&&event.shiftKey!=true&&event.target.closest('button')!=null&&event.target.closest('button').className=='sc-kgq5hw-0 fgVkZi'){//原页面收藏按钮的button祖先节点

                // }
            }
        }
    });


    //————————————————————————————————————————————————————————————

    var num=0
    //————————————————————————————————创建cookie
    function setCookie(cname,cvalue,exdays){
        var cookie_all=cname
        if(exdays!=-1){
            var d = new Date();
            d.setTime(d.getTime()+(exdays*24*60*60*1000));
            var expires = "expires="+d.toGMTString();
            cookie_all=cname+"="+cvalue+"; "+expires+";path=/"
        }
        else if(exdays){
            cookie_all=cname+"="+cvalue+"; ;path=/"
        }
        else{
            cookie_all=cname+"="+cvalue+"; "+exdays+";path=/"
        }
        document.cookie = cookie_all;
        num=num+1
    }
    //————————————————————————————————调取cookie
    function getCookie(cname){
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name)==0){
                return c.substring(name.length,c.length);
            }
        }
        return "";
    }
    //————————————————————————————————使用cookie
    function checkCookie(){
        window.addEventListener('contextmenu',function (event){
            var el=event.target
            ////////////////////////////////////////////////////////
            for(var i in match_rules){
                var result=el.outerHTML.match(match_rules[i])
                if(result!=null&&result.length>1){
                    var url_result=result[1]
                    var pid=result[2]
                    break
                }
            }
            ///////////////////////////////////////////////////////
            if(event.altKey==true&&event.ctrlKey!=true){
                if(event.target.src!=null){
                    getFinalUrl(1,event,getPageNum(event,0))
                }
                num=lastcookie()
                event.preventDefault()
            }

            var user=getCookie("pixivid");
            var x = document.cookie
            })
        //————————————————————————————————

        //获取token
        if(getCookie('token')==""||getCookie('token')=="err"){//对应未抓取token(即当天第一次打开pixiv)和抓取token出现错误
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://www.pixiv.net/",
                headers:{
                    "User-Agent": navigator.userAgent,
                },
                onload: function(res) {
                    if(res.status === 200){
                        //console.log('成功')
                        var p=res.responseText
                        var token=p.match(/(?<=\\"token\\":\\").*?(?=\\",\\")/)
                        if(token!=null){
                            setCookie('token',token[0],-1)//不是err则为成功
                            console.log('token:'+token[0])
                        }
                        else{
                            setCookie('token','err',-1)//err代表失败
                            console.log('token获取失败')
                        }
                    }
                }
            })
        }


        window.addEventListener('load',function(event){
            // console.log('a')
            aside("recommend")
        })


        rightButton.addEventListener('mouseenter',()=>{
            elem=getelemt("rightButton")
            elem.style.transform="translateX(20px)"
        })
        rightButton.addEventListener('mouseleave',()=>{
            elem=getelemt("rightButton")
            elem.style.transform="translateX(0px)"
        })
        deleteCookie.addEventListener('mouseenter',()=>{
            elem=getelemt("deleteCookie")
            elem.style.transform="translateX(20px)"
        })
        deleteCookie.addEventListener('mouseleave',()=>{
            elem=getelemt("deleteCookie")
            elem.style.transform="translateX(0px)"
        })

        //——————————————————————————————————————————————————————

        morefunction.addEventListener('mouseenter',()=>{
            var elem=getelemt("morefunction")
            elem.style.transform="translateX(20px)"
        })
        morefunction.addEventListener('mouseleave',()=>{
            var elem=getelemt("morefunction")
            elem.style.transform="translateX(0px)"
        })
        No2.addEventListener('click',()=>{
            //————————————————————————————————————————————————————————————————————————————————————————
            user_savepicture()
        })
        var click_num=0
        var w=1
        morefunction.addEventListener('click',()=>{
            if(document.getElementById("slider").style.display=="block"){
                slider.style.opacity="0"
                slider_box.style.opacity="0"
                setTimeout(function () {
                    slider.style.display="none"
                }, 250);
                setTimeout(function () {
                    slider_box.style.display="none"
                }, 250);
            }
            if(document.getElementById("check").style.display=='block'){
                var check=document.getElementById('check')
                var checkInput=document.getElementById('checkInput')
                check.style.opacity=0
                checkInput.style.opacity=0
                setTimeout(function () {
                    check.style.display='none'
                    checkInput.style.display='none'
                }, 210)
            }
            w=Math.pow(-1, click_num)
            var elem_1=getelemt("No1")
            var elem_2=getelemt("No2")
            var elem_3=getelemt("No3")
            var elem_4=getelemt("No4")
            var elem_5=getelemt("No5")
            var elem_6=getelemt("No6")
            var elem_7=getelemt("No7")
            var elem_8=getelemt("No8")
            var elem_9=getelemt("No9")
            var elem_10=getelemt("No10")
            var elem_11=getelemt("No11")
            var elem_12=getelemt("No12")
            var elem_13=getelemt("No13")
            var elem=getelemt("morefunction")
            elem.style.transform="translateX(20px)"
            if(w>0){
                elem_1.style.opacity="0.25"
                elem_2.style.opacity="0.20"
                elem_3.style.opacity="0.20"
                elem_4.style.opacity="0.20"
                elem_5.style.opacity="0.20"
                elem_6.style.opacity="0.20"
                elem_7.style.opacity="0.20"
                elem_8.style.opacity="0.20"
                elem_9.style.opacity="0.20"
                elem_10.style.opacity="0.20"
                elem_11.style.opacity="0.20"
                elem_12.style.opacity="0.20"
                elem_13.style.opacity="0.20"

                elem_1.style.transform="rotate(67deg) translateX(98px)"
                elem_2.style.transform="rotate(-16deg) translateX(91px)"
                elem_3.style.transform="rotate(41deg) translateX(86px)"
                elem_4.style.transform="rotate(47deg) translateX(132px)"
                elem_5.style.transform="rotate(-46deg) translateX(143px)"
                elem_6.style.transform="rotate(68deg) translateX(141px)"
                elem_7.style.transform="rotate(10deg) translateX(83px)"
                elem_8.style.transform="rotate(1deg) translateX(130px)"
                elem_9.style.transform="rotate(-68deg) translateX(146px)"
                elem_10.style.transform="rotate(-23deg) translateX(135px)"
                elem_11.style.transform="rotate(-42deg) translateX(96px)"
                elem_12.style.transform="rotate(25deg) translateX(128px)"
                elem_13.style.transform="rotate(-65deg) translateX(105px)"
                click_num++
            }
            else if(w<0){
                elem_1.style.opacity="0"
                elem_2.style.opacity="0"
                elem_3.style.opacity="0"
                elem_4.style.opacity="0"
                elem_5.style.opacity="0"
                elem_6.style.opacity="0"
                elem_7.style.opacity="0"
                elem_8.style.opacity="0"
                elem_9.style.opacity="0"
                elem_10.style.opacity="0"
                elem_11.style.opacity="0"
                elem_12.style.opacity="0"
                elem_13.style.opacity="0"
                elem_1.style.transform="rotate(0deg) translateX(0px)"
                elem_2.style.transform="rotate(0deg) translateX(0px)"
                elem_3.style.transform="rotate(0deg) translateX(0px)"
                elem_4.style.transform="rotate(0deg) translateX(0px)"
                elem_5.style.transform="rotate(0deg) translateX(0px)"
                elem_6.style.transform="rotate(0deg) translateX(0px)"
                elem_7.style.transform="rotate(0deg) translateX(0px)"
                elem_8.style.transform="rotate(0deg) translateX(0px)"
                elem_9.style.transform="rotate(0deg) translateX(0px)"
                elem_10.style.transform="rotate(0deg) translateX(0px)"
                elem_11.style.transform="rotate(0deg) translateX(0px)"
                elem_12.style.transform="rotate(0deg) translateX(0px)"
                elem_13.style.transform="rotate(0deg) translateX(0px)"
                click_num++
            }
        })
        var click_num_1=0
        var v=1
        No3.addEventListener('click',()=>{
            if(document.getElementById("slider").style.display=="block"){
                slider.style.opacity="0"
                slider_box.style.opacity="0"
                setTimeout(function () {
                    slider.style.display="none"
                }, 250);
                setTimeout(function () {
                    slider_box.style.display="none"
                }, 250);
            }
            if(document.getElementById("check").style.display=='block'){
                var check=document.getElementById('check')
                var checkInput=document.getElementById('checkInput')
                check.style.opacity=0
                checkInput.style.opacity=0
                setTimeout(function () {
                    check.style.display='none'
                    checkInput.style.display='none'
                }, 210)
            }
            v=Math.pow(-1, click_num_1)
            click_num_1++
            var elem_1=document.getElementsByTagName("cookie_text")[0]
            var elem_2=document.getElementsByTagName("text_background")[0]
            var elem_3=document.getElementsByTagName("black_cover")[0]
            var elem_7=document.getElementsByTagName("cover_title")[0]
            var elem_12=document.getElementsByTagName("page_number")[0]
            var elem_8=getelemt("bigeye")
            var elem_10=getelemt("whitecover")
            var elem_11=getelemt("pages")
            //——————————————————————————————————————————————————————————可以设为函数
            var cookie_split=document.cookie.split(";")
            var cookie_txt=""
            var p=0
            for(var k=0;k<cookie_split.length;k++){
                var cookie_match=cookie_split[k].match("pixivid")
                if(cookie_match!=null){
                    var cookie_url=cookie_match.input.split("=")[1]
                    var cookie_url_split=cookie_url.split(",")
                    var cookie_url_recombine=cookie_url_split[0]
                    var new_occup=1
                    if(cookie_url.substr(cookie_url.length-1,1)!=","){
                        new_occup=0
                    }
                    for(y=1;y<cookie_url_split.length-new_occup;y++){
                        cookie_url_recombine=cookie_url_recombine+"\n"+cookie_url_split[y]
                    }
                    if(cookie_txt!=null){
                        cookie_txt=cookie_txt+cookie_url_recombine+"\n"
                        p++
                    }
                    else{
                        cookie_txt=cookie_url_recombine+"\n"
                    }
                    event.preventDefault()
                }
            }
            for(var f=0;k<cookie_split.length;k++){
                cookie_match=cookie_split[k].match("pixivid")
                if(cookie_match!=null){
                    cookie_url=cookie_match.input.split("=")[1]
                    cookie_url_split=cookie_url.split(",")
                    cookie_url_recombine=cookie_url_split[0]
                    for(var y=1;y<cookie_url_split.length;y++){
                        cookie_url_recombine=cookie_url_recombine+"\n"+cookie_url_split[y]
                    }
                    if(cookie_txt!=null){
                        cookie_txt=cookie_txt+cookie_url_recombine+"\n"
                        p++
                    }
                    else{
                        cookie_txt=cookie_url_recombine+"\n"
                    }
                    event.preventDefault()
                }
            }
            var userurl_cookie=getCookie("user_url").split(",")[0]
            for(var m=1;m<getCookie("user_url").split(",").length-1;m++){
                userurl_cookie=userurl_cookie+"\n"+getCookie("user_url").split(",")[m]
            }
            if(cookie_txt!="undefined"){
                cookie_txt=cookie_txt+userurl_cookie
            }
            var cookie_txt_num=0
            for(var nn=0;nn<cookie_txt.split("\n").length;nn++){
                if(cookie_txt.split("\n")[nn]!=""){
                    cookie_txt_num=cookie_txt_num+1
                }
            }
            if(cookie_txt==""){
                elem_1=document.getElementsByTagName("cookie_text")[0]
                elem_1.style.fontSize="30px"
                cookie_txt="\n\n\\アッカリ～ン/"
            }
            //————————————————————————————————————————————————
            if(cookie_txt!="\n\n\\アッカリ～ン/"){
                var visual_id=cookie_txt.split("\n")
                var visual_id_new=[]//把visual_id中的多张图片链接分开，方便后面使用
                var count=0
                for(var o=0;o<visual_id.length;o++){
                    for(var q=0;q<parseInt(visual_id[o].split("*")[1]);q++){
                        if(visual_id[o].split("*")[1]!=1){
                            visual_id_new[count]=visual_id[o].split("*")[0].match(/\d{6,10}/)+"-"+(q+1)//后面要跟完全分开的visual_id
                            count++
                        }
                        else{
                            visual_id_new[count]=visual_id[o].split("*")[0].match(/\d{6,10}/)//后面要跟完全分开的visual_id
                            count++
                        }
                    }
                }
                for(var i=0;i<visual_id_new.length;i++){
                    var insideText=document.createElement("text"+[i])
                    insideText.style.fontSize="15px"
                    insideText.className="insideText"
                    insideText.style.opacity="1"
                    insideText.style.transform="translateX(350px)"
                    insideText.innerText=visual_id_new[i]+"\n"
                    insideText.id="insideText"
                    elem_1.appendChild(insideText)
                }
                if(document.getElementById("text").innerText.match("\アッカリ～ン/")==null){
                    for(var j=i;j<i+2;j++){
                        insideText=document.createElement("text"+[j])
                        insideText.style.fontSize="15px"
                        insideText.className="insideText"
                        insideText.style.opacity="1"
                        insideText.style.transform="translateX(350px)"
                        insideText.innerText="\n"
                        insideText.id="insideText"
                        elem_1.appendChild(insideText)
                    }
                }
            }
            else{
                elem_1.innerText=cookie_txt
            }
            //————————————————————————————————————————————————
            if(document.getElementById("text").innerText.match("\アッカリ～ン/")==null){
                elem_12.innerText=parseInt(document.getElementsByClassName("insideText").length)-2
            }
            else{
                elem_12.innerText=parseInt(document.getElementsByClassName("insideText").length)
            }
            if(v>0){
                elem_1.style.opacity="1"
                elem_1.style.transform="translateX(350px)"
                elem_10.style.opacity="1"
                elem_10.style.transform="translateX(300px)"
                elem_2.style.transform="translateX(160px)"
                elem_3.style.display="block"
                setTimeout(function () {
                    elem_3.style.opacity="0.3"
                }, 0.1);
                elem_7.style.left="6%"
                elem_7.style.opacity="1"
                elem_8.style.transform="translateX(191px)"
                elem_8.style.opacity="1"
                elem_11.style.transform="translateX(443px)"
                elem_11.style.opacity="1"
                elem_12.style.transform="translateX(462px)"
                elem_12.style.opacity="1"
                var elem_4=getelemt("No1")
                var elem_5=getelemt("No2")
                var elem_6=getelemt("No3")
                var elem_13=getelemt("No4")
                var elem_14=getelemt("No5")
                var elem_15=getelemt("No6")
                var elem_16=getelemt("No7")
                var elem_17=getelemt("No8")
                var elem_18=getelemt("No9")
                var elem_19=getelemt("No10")
                var elem_20=getelemt("No11")
                var elem_21=getelemt("No12")
                var elem_22=getelemt("No13")
                var elem=getelemt("morefunction")

                elem_4.style.opacity="0"
                elem_5.style.opacity="0"
                elem_6.style.opacity="0"
                elem_13.style.opacity="0"
                elem_14.style.opacity="0"
                elem_15.style.opacity="0"
                elem_16.style.opacity="0"
                elem_17.style.opacity="0"
                elem_18.style.opacity="0"
                elem_19.style.opacity="0"
                elem_20.style.opacity="0"
                elem_21.style.opacity="0"
                elem_22.style.opacity="0"
                elem_4.style.transform="rotate(0deg) translateX(-10px)"
                elem_5.style.transform="rotate(0deg) translateX(-10px)"
                elem_6.style.transform="rotate(0deg) translateX(-10px)"
                elem_13.style.transform="rotate(0deg) translateX(-10px)"
                elem_14.style.transform="rotate(0deg) translateX(-10px)"
                elem_15.style.transform="rotate(0deg) translateX(-10px)"
                elem_16.style.transform="rotate(0deg) translateX(-10px)"
                elem_17.style.transform="rotate(0deg) translateX(-10px)"
                elem_18.style.transform="rotate(0deg) translateX(-10px)"
                elem_19.style.transform="rotate(0deg) translateX(-10px)"
                elem_20.style.transform="rotate(0deg) translateX(-10px)"
                elem_21.style.transform="rotate(0deg) translateX(-10px)"
                elem_22.style.transform="rotate(0deg) translateX(-10px)"

                click_num++
            }
            else{
                elem_1.style.opacity=".0"
                elem_1.style.transform="translateX(0px)"
                elem_1.style.fontSize="15px"
                elem_10.style.opacity=".0"
                elem_10.style.transform="translateX(0px)"
                elem_2.style.opacity=".0"
                elem_2.style.transform="translateX(0px)"
                elem_3.style.opacity=".0"
                setTimeout(function () {
                    elem_3.style.display="none"
                }, 300);
                elem_7.style.left="-360px"
                elem_7.style.opacity="0"
                elem_8.style.transform="translateX(0px)"
                elem_8.style.opacity="0"
                elem_11.style.transform="translateX(0px)"
                elem_11.style.opacity="0"
                elem_12.style.transform="translateX(0px)"
                elem_12.style.opacity="0"
                elem_1.innerText=""
            }
        })
        var textPart=document.getElementById("text")
        textPart.addEventListener('click',function(event){
            if(event.target.localName.match(/text\d{1,3}/)!=null){
                var textLink="https://www.pixiv.net/artworks/"+event.target.innerText.match(/\d{6,10}/)[0]
                window.open(textLink)
            }
        })
        No4.addEventListener('contextmenu',()=>{
            retract()
            event.preventDefault()
        })
        document.getElementsByTagName("black_cover")[0].addEventListener('click',()=>{
            var elem_1=document.getElementsByTagName("cookie_text")[0]
            var elem_2=document.getElementsByTagName("text_background")[0]
            var elem_3=document.getElementsByTagName("black_cover")[0]
            var elem_7=document.getElementsByTagName("cover_title")[0]
            var elem_8=getelemt("bigeye")
            var elem_10=getelemt("whitecover")
            var elem_11=getelemt("pages")
            var elem_12=document.getElementsByTagName("page_number")[0]
            elem_1.style.opacity=".0"
            elem_1.style.transform="translateX(0px)"
            elem_1.style.fontSize="15px"
            elem_10.style.opacity=".0"
            elem_10.style.transform="translateX(0px)"
            elem_2.style.opacity=".0"
            elem_2.style.transform="translateX(0px)"
            elem_3.style.opacity=".0"
            setTimeout(function () {
                elem_3.style.display="none"
            }, 300);
            elem_7.style.left="-360px"
            elem_7.style.opacity="0"
            elem_8.style.transform="translateX(0px)"
            elem_8.style.opacity="0"
            elem_11.style.transform="translateX(0px)"
            elem_11.style.opacity="0"
            elem_12.style.transform="translateX(0px)"
            elem_12.style.opacity="0"
            click_num_1++
            elem_1.innerText=""
        })


        // 搜索页快捷键翻页
        window.addEventListener('keydown',function(event){
            if(window.location.href.match(/\/tags\//)!=null){
                var clickNum=document.querySelectorAll(".fuSMYC")//获取除已选页数以外的页数按钮
                if(event.keyCode=="37"&&clickNum[0].hidden==false){//判断左翻页按钮是否隐藏
                    clickNum[0].click()
                }
                else if(event.keyCode=="39"&&clickNum[1].hidden==false){//判断右翻页按钮是否隐藏
                    clickNum[1].click()
                }
            }
        })


        rightButton.addEventListener('click',()=>{
            var cookie_split=document.cookie.split(";")
            var cookie_txt
            var p=0
            //————————————————————————————————从cookie中匹配pixivid相关cookie
            for(var k=0;k<cookie_split.length;k++){
                var cookie_match=cookie_split[k].match("pixivid")
                if(cookie_match!=null){
                    var cookie_url=cookie_match.input.split("=")[1]
                    var cookie_url_split=cookie_url.split(",")
                    var cookie_url_recombine=cookie_url_split[0]
                    var new_occup=1
                    if(cookie_url.substr(cookie_url.length-1,1)!=","){
                        new_occup=0
                    }
                    for(var y=1;y<cookie_url_split.length-new_occup;y++){
                        cookie_url_recombine=cookie_url_recombine+"\n"+cookie_url_split[y]
                    }
                    if(cookie_txt!=null){
                        cookie_txt=cookie_txt+cookie_url_recombine+"\n"
                        p++
                    }
                    else{
                        cookie_txt=cookie_url_recombine+"\n"
                    }
                    event.preventDefault()
                }
            }
            var userurl_cookie=""
            if(getCookie("user_url")!=""){
                userurl_cookie=getCookie("user_url").split(",")[0]
                for(var m=1;m<getCookie("user_url").split(",").length-1;m++){
                    userurl_cookie=userurl_cookie+"\n"+getCookie("user_url").split(",")[m]
                }
            }
            cookie_txt=cookie_txt+userurl_cookie
            var intercept=cookie_txt
            if(cookie_txt=="undefined"){
                intercept="\\アッカリ～ン/"
            }
            else if(cookie_txt.match("undefined")!=null){
                intercept=cookie_txt.substr(9)
            }
            var intercept_final=""
            if(intercept.split("\n")[intercept.split("\n").length-1]==""){
                var bb=1
                }
            else{
                bb=0
            }
            for(var ic=0;ic<intercept.split("\n").length-bb;ic++){
                if(intercept.split("\n")!=""){
                    for(var ie=0;ie<parseInt(intercept.split("\n")[ic].split("*")[1]);ie++){
                        if(intercept.split("\n")[ic].split("*")[1]==1){
                            if(intercept.split("\n")[ic].match(/\d{4}\/\d{2}/)==null){
                                intercept_final=intercept_final+"https://pixiv.re/"+intercept.split("\n")[ic].match(/\d{6,10}/)+".png\n"//注意！不包括moe的情况
                            }
                            else{//moe形式
                                intercept_final=intercept_final+"https://api.pixiv.moe/image/i.pximg.net/img-original/img/"+intercept.split("\n")[ic].split("*")[0]+"\n"//+"@progressive.webp\n"
                            }
                        }
                        else{
                            if(intercept.split("\n")[ic].match(/\d{4}\/\d{2}/)==null){
                                intercept_final=intercept_final+"https://pixiv.re/"+intercept.split("\n")[ic].match(/\d{6,10}/)+"-"+(ie+1)+".png\n"
                            }
                            else{
                                intercept_final=intercept_final+"https://api.pixiv.moe/image/i.pximg.net/img-original/img/"+intercept.split("\n")[ic].split("*")[0].replace(/(?<=_p)\d{1}/,ie)+"\n"//+"@progressive.webp\n"
                            }
                        }
                    }
                }
            }
            //——————————————————————————————————————————————————————————————————————————11111111111111111
            download("Pixiv Url.txt",intercept_final);
            var count=lastcookie()
            for(var o=0;o<count;o++){
                var pixiv_preurl
                if(pixiv_preurl==null){
                    pixiv_preurl=getCookie("pixivid"+o)
                }
                else{
                    var occup=""
                    if(pixiv_preurl.substr(pixiv_preurl.length-1,1)!=","){
                        occup=","
                    }
                    pixiv_preurl=pixiv_preurl+occup+getCookie("pixivid"+o)
                }
                delCookie("pixivid"+o)
            }
            delCookie("user_url")
            setCookie("pixiv_preurl",pixiv_preurl,-1)
        })

        No5.addEventListener('click',()=>{
            var preCheck=getCookie("preImg")
            var path_color=document.getElementById("path12")
            var pretext="0"
            if(preCheck==""||preCheck=="0"){
                pretext="1"
                path_color.style.fill="#0f0"
            }
            else if(preCheck=="1"){
                pretext="2"
                path_color.style.fill="#00a4ff"
            }
            else if(preCheck=="2"){
                pretext="3"
                path_color.style.fill="#f00"
            }
            else if(preCheck=="3"){
                pretext="0"
                path_color.style.fill="#fff"
            }
            setCookie("preImg",pretext,90)
        })

        No5.addEventListener('contextmenu',function(event){
            if(getCookie('bigGif')!=1){
                setCookie('bigGif',1,90)
                document.getElementById('No5').style.backgroundColor='#f00'
            }
            else{
                setCookie('bigGif',0,90)
                document.getElementById('No5').style.backgroundColor='#000'
            }
            event.preventDefault()
        })

        var No6=document.getElementById("No6")
        var slider_box=document.getElementById("slider_box")
        var slider=document.getElementById("slider")
        No6.addEventListener('click',function(event){
            if(slider.style.display=="block"){
                slider.style.opacity="0"
                slider_box.style.opacity="0"
                setTimeout(function () {
                    slider.style.display="none"
                }, 250);
                setTimeout(function () {
                    slider_box.style.display="none"
                }, 250);
            }
            else{
                slider.style.display="block"
                slider_box.style.display="block"
                setTimeout(function () {
                    slider.style.opacity="1"
                }, 0.1);
                setTimeout(function () {
                    slider_box.style.opacity="1"
                }, 0.1);
            }
            if(slider.value!=10){
                slider_box.innerText=slider.value
                slider_box.style.backgroundColor="#cbcbcb"
            }
            else{
                slider_box.innerText="∞"
                slider_box.style.backgroundColor="#f7cbcb"
            }
            slider.oninput=function(){
                if(slider.value!=10){
                    slider_box.innerText=slider.value
                    slider_box.style.backgroundColor="#cbcbcb"
                }
                else{
                    slider_box.innerText="∞"
                    slider_box.style.backgroundColor="#f7cbcb"
                }
                setCookie("slider",slider.value,90)
            }

        })
        var No7=document.getElementById("No7")
        No7.addEventListener('click',function(event){
            var path14=document.getElementById("path14")
            if(getCookie("R-18_block")==""||getCookie("R-18_block")=="0"){
                setCookie("R-18_block",1,90)
                path14.style.fill="#f00"
            }
            else if(getCookie("R-18_block")=="1"){
                setCookie("R-18_block",0,90)
                path14.style.fill="#fff"
            }
        })

        /*
        document.getElementById("No8").addEventListener('click',function(e){
            if(getCookie("outUrl")==0){
                setCookie("outUrl",1,90)
                document.getElementById("path15").setAttribute('d',svg_re)
                document.getElementById("path15").style.transform="scale(0.017) translate(-424px, -120px)"
            }
            else if(getCookie("outUrl")==1){
                setCookie("outUrl",2,90)
                document.getElementById("path15").setAttribute('d',svg_moe)
                document.getElementById("path15").style.transform="scale(0.016) translate(-204px, -130px)"
            }
            else if(getCookie("outUrl")==2){
                setCookie("outUrl",0,90)
                document.getElementById("path15").setAttribute('d',svg_cat)
                document.getElementById("path15").style.transform="scale(0.017) translate(-391px, -130px)"
            }
        })
        */

        No4.addEventListener('click',()=>{
            var pid_num=lastcookie()
            delCookie("pixivid"+(pid_num-1))
        })

        No1.addEventListener('click',()=>{
            var pid_num=lastcookie()
            var reply=confirm("是否要清除所有已储存的pixiv图片链接？")
            if(reply==true){
                for(var v=pid_num-1;v>=0;v--){
                    var pixiv_preurl
                    if(pixiv_preurl==null){
                        pixiv_preurl=getCookie("pixivid"+v)
                    }
                    else{
                        var occup=""
                        if(pixiv_preurl.substr(pixiv_preurl.length-1,1)!=","){
                            occup=","
                        }
                        pixiv_preurl=pixiv_preurl+occup+getCookie("pixivid"+v)
                    }
                    delCookie("pixivid"+(v))
                }
                delCookie("user_url")
                setCookie("pixiv_preurl",pixiv_preurl,-1)
                alert_count=0
            }
        })
    }

    var No9=document.getElementById("No9")
    No9.addEventListener('click',function(event){
        var check=document.getElementById("check")
        var checkInput=document.getElementById("checkInput")
        if(check.style.display=='none'||check.style.display==''){
            check.style.display='block'
            checkInput.style.display='block'
            setTimeout(function () {
                check.style.opacity=0.3
                checkInput.style.opacity=1
            }, 210);
        }
        else{
            check.style.opacity=0
            checkInput.style.opacity=0
            setTimeout(function () {
                check.style.display='none'
                checkInput.style.display='none'
            }, 210)
        }
    })
    window.addEventListener('keydown',function(event){//判断是否按下回车，与手动查看标签相关
        var text=document.getElementById("checkInput")
        var textValue=text.value
        if(textValue.match('_')!=null){
            textValue=textValue.split('_')[0]
        }
        if(event.keyCode==13&&window.getSelection()!=null&&(window.getSelection().focusNode.id=='checkInput'||window.getSelection().focusNode.id=='check')&&text.value!=""){//点击是否为回车，分别为判断光标位置是否为空，光标指向的id是否为输入框或输入框外围，输入框内部是否为""
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://www.pixiv.net/artworks/"+textValue,
                headers:{
                    "User-Agent": navigator.userAgent,
                },
                onload: function(res) {
                    if(res.status === 200){
                        //console.log('成功')
                        var p=res.responseText
                        var b=p.match(/(?<=\"tags\"\:\[)\{.*?(?=\],\"wri)/)[0].split('},{')
                        var a=[]
                        for(var i=0;i<b.length;i++){
                            if(b[i].match(/(?<={\"en\":\").*?(?=\"})/)!=null){
                                a[i]=b[i].match(/(?<="tag":").*?(?=","locked)/)[0]+' ('+b[i].match(/(?<={\"en\":\").*?(?=\"})/)[0]+')'
                            }
                            else{
                                a[i]=b[i].match(/(?<="tag":").*?(?=","locked)/)[0]
                            }
                        }
                        var c=''
                        for(var j=0;j<a.length;j++){
                            if(j!=a.length-1){
                                c=c+a[j]+',   '
                            }
                            else{
                                c=c+a[j]
                            }
                        }
                        alert(c)
                    }
                }
            })
        }
    })

    var No10=document.getElementById('No10')
    No10.addEventListener('click',function(event){
        if(getCookie('tagCookieSetting')==0){
            setCookie('tagCookieSetting',1,90)
            document.getElementById('path18').style.fill='#f00'
        }
        else if(getCookie('tagCookieSetting')==1){
            setCookie('tagCookieSetting',0,90)
            document.getElementById('path18').style.fill='#fff'
        }
    })

    window.addEventListener('contextmenu',function(event){//右键No10触发编辑tagCookie功能
        if(event.target.id=='No10'||event.target.id=='path18'){
            if(document.getElementById('tag_view_out')==null){
                var tag_view_out=document.createElement('a')
                var tag_view_text=document.createElement('textarea')
                tag_view_out.id='tag_view_out'
                tag_view_out.style.backgroundColor='#e5e5e5'
                tag_view_text.id='tag_view_text'
                tag_view_text.style.backgroundColor='#e5e5e5'
                if(getCookie('tagCookieType')==1){//如果代码中已经设置，则设置文本输入框为只读
                    tag_view_text.setAttribute("readonly","readonly")
                }
                document.body.appendChild(tag_view_out)
                document.getElementById('tag_view_out').appendChild(tag_view_text)
                if(GM_getValue('tagSaveSafe')!=''){
                    tag_view_text.value=GM_getValue('tagSaveSafe')
                }
                else{
                    tag_view_text.value='未设置匹配标签'
                }
                if(getCookie('tagCookieType')==1){//如果代码中已经设置，则直接使用代码中的tag匹配正则
                    tag_view_text.value=tagSaveSafe
                }

                var help = document.createElementNS("http://www.w3.org/2000/svg", "svg");//正则帮助
                var path_help = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                help.setAttribute("aria-hidden","true");
                help.setAttribute('viewbox', '0 0 24 24');
                help.setAttribute('width', '16px');
                help.setAttribute('height', '16px');
                //叹号
                path_help.setAttribute('d','M512 938.666667c235.648 0 426.666667-191.018667 426.666667-426.666667S747.648 85.333333 512 85.333333 85.333333 276.352 85.333333 512s191.018667 426.666667 426.666667 426.666667z m0 85.333333C229.248 1024 0 794.752 0 512S229.248 0 512 0s512 229.248 512 512-229.248 512-512 512z M520.96 232.106667c-62.293333 0-111.786667 17.92-147.626667 54.613333-36.693333 35.84-54.613333 84.48-54.613333 146.773333h90.453333c0-37.546667 7.68-67.413333 23.04-87.893333 17.066667-23.893333 45.226667-35.84 83.626667-35.84 30.72 0 54.613333 8.533333 71.68 25.6 16.213333 17.066667 24.746667 40.106667 24.746667 69.973333 0 22.186667-7.68 42.666667-23.04 62.293334l-14.506667 16.213333c-52.906667 46.933333-85.333333 81.92-97.28 105.813333-11.093333 22.186667-16.213333 49.493333-16.213333 81.066667v14.506667h91.306666v-14.506667c0-21.333333 4.266667-40.106667 13.653334-57.173333 7.68-15.36 19.626667-29.866667 34.986666-43.52 40.96-34.986667 64.853333-57.173333 72.533334-66.56 20.48-27.306667 31.573333-62.293333 31.573333-104.106667 0-51.2-17.066667-92.16-50.346667-122.026667-34.133333-30.72-78.506667-45.226667-133.973333-45.226666z m-14.506667 499.2c-17.92 0-32.426667 5.12-43.52 17.066666-12.8 11.093333-18.773333 25.6-18.773333 43.52 0 17.066667 5.973333 31.573333 18.773333 43.52 11.093333 11.946667 25.6 17.92 43.52 17.92 17.066667 0 32.426667-5.973333 45.226667-17.066666 11.946667-11.946667 17.92-26.453333 17.92-44.373334 0-17.92-5.973333-32.426667-17.92-43.52-11.946667-11.946667-27.306667-17.066667-45.226667-17.066666z')
                //问号
                path_help.style.transform="scale(0.015)"
                path_help.id='path_help';
                help.appendChild(path_help);
                help.id = 'help';
                document.getElementById("tag_view_out").appendChild(help);


                var spin = document.createElementNS("http://www.w3.org/2000/svg", "svg");//切换按钮
                var path_spin = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                spin.setAttribute("aria-hidden","true");
                spin.setAttribute('viewbox', '0 0 24 24');
                spin.setAttribute('width', '16px');
                spin.setAttribute('height', '16px');
                path_spin.setAttribute('d','M421.12 590.506667L362.666667 648.533333a329.386667 329.386667 0 0 1 23.466666-409.173333 8.533333 8.533333 0 0 0-9.813333-13.226667 310.186667 310.186667 0 0 0-83.2 492.373334L241.92 768a17.066667 17.066667 0 0 0 11.946667 29.013333h179.2a17.066667 17.066667 0 0 0 17.066666-17.066666v-179.2a17.066667 17.066667 0 0 0-29.013333-10.24zM602.88 433.493333L661.333333 375.466667a329.386667 329.386667 0 0 1-21.333333 409.173333 8.533333 8.533333 0 0 0 9.813333 13.226667 310.186667 310.186667 0 0 0 81.066667-492.373334L782.08 256a17.066667 17.066667 0 0 0-11.946667-29.013333h-179.2a17.066667 17.066667 0 0 0-17.066666 17.066666v179.2a17.066667 17.066667 0 0 0 29.013333 10.24z')
                path_spin.style.transform="scale(0.021) rotateZ(-90deg) translate(-880px, -140px)"
                path_spin.id='path_spin';
                spin.appendChild(path_spin);
                spin.id = 'spin';
                document.getElementById("tag_view_out").appendChild(spin);


                var lock = document.createElementNS("http://www.w3.org/2000/svg", "svg");//切换按钮
                var path_lock = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                var div_lock = document.createElement('div')
                div_lock.id='div_lock'
                lock.setAttribute("aria-hidden","true");
                lock.setAttribute('viewbox', '0 0 24 24');
                lock.setAttribute('width', '16px');
                lock.setAttribute('height', '16px');
                if(getCookie('tagCookieType')==0){
                    path_lock.setAttribute('d','M11,14.7324356 C11.5978014,14.3866262 12,13.7402824 12,13 C12,11.8954305 11.1045695,11 10,11 C8.8954305,11 8,11.8954305 8,13 C8,13.7402824 8.40219863,14.3866262 9,14.7324356 L9,17 L11,17 L11,14.7324356 Z M13,6 C13,4.34314575 11.6568542,3 10,3 C8.34314575,3 7,4.34314575 7,6 L7,8 L13,8 L13,6 Z M4,8 L4,6 C4,2.6862915 6.6862915,0 10,0 C13.3137085,0 16,2.6862915 16,6 L13,6 L13,8 L17.0049107,8 C18.1067681,8 19,8.90195036 19,10.0085302 L19,17.9914698 C19,19.1007504 18.1073772,20 17.0049107,20 L2.99508929,20 C1.8932319,20 1,19.0980496 1,17.9914698 L1,10.0085302 C1,8.8992496 1.8926228,8 2.99508929,8 L4,8 Z')
                    path_lock.id='path_unlock';
                    lock.id = 'unlock';
                    div_lock.title='正在使用cookie中正则'
                }
                else if(getCookie('tagCookieType')==1){
                    path_lock.setAttribute('d','M11,14.7324356 C11.5978014,14.3866262 12,13.7402824 12,13 C12,11.8954305 11.1045695,11 10,11 C8.8954305,11 8,11.8954305 8,13 C8,13.7402824 8.40219863,14.3866262 9,14.7324356 L9,17 L11,17 L11,14.7324356 Z M13,6 C13,4.34314575 11.6568542,3 10,3 C8.34314575,3 7,4.34314575 7,6 L7,8 L13,8 L13,6 Z M4,8 L4,6 C4,2.6862915 6.6862915,0 10,0 C13.3137085,0 16,2.6862915 16,6 L16,8 L17.0049107,8 C18.1067681,8 19,8.90195036 19,10.0085302 L19,17.9914698 C19,19.1007504 18.1073772,20 17.0049107,20 L2.99508929,20 C1.8932319,20 1,19.0980496 1,17.9914698 L1,10.0085302 C1,8.8992496 1.8926228,8 2.99508929,8 L4,8 Z')
                    path_lock.id='path_lock';
                    lock.id = 'lock';
                    div_lock.title='正在使用代码中正则'
                }
                lock.setAttribute('class', 'lock_svg');
                path_lock.setAttribute('class', 'lock_path');
                path_lock.style.transform="scale(0.65)"
                lock.appendChild(path_lock);
                document.getElementById("tag_view_out").appendChild(div_lock);
                div_lock.appendChild(lock)

                var trash = document.createElementNS("http://www.w3.org/2000/svg", "svg");//切换按钮
                var path_trash = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                trash.setAttribute("aria-hidden","true");
                trash.setAttribute('viewbox', '0 0 24 24');
                trash.setAttribute('width', '16px');
                trash.setAttribute('height', '16px');
                path_trash.setAttribute('d','M2,2 L18,2 L18,4 L2,4 L2,2 Z M8,0 L12,0 L14,2 L6,2 L8,0 Z M3,6 L17,6 L16,20 L4,20 L3,6 Z M8,8 L9,8 L9,18 L8,18 L8,8 Z M11,8 L12,8 L12,18 L11,18 L11,8 Z')
                path_trash.style.transform="scale(0.66)"
                path_trash.id='path_trash';
                trash.appendChild(path_trash);
                trash.id = 'trash';
                document.getElementById("tag_view_out").appendChild(trash);



                setTimeout(function () {
                    tag_view_out.style.opacity='0.8'
                }, 50);
            }
            else{
                document.getElementById('tag_view_out').style.opacity='0'
                setTimeout(function () {
                    document.getElementById('tag_view_out').remove()
                }, 250);
            }
            event.preventDefault()
        }
    })
    window.addEventListener('click',function(event){//若点击了不是编辑tagCookie相关位置则设置cookie，并关闭编辑框
        if(getCookie('tagCookieSetting')==1){
            if(getCookie('tagCookieType')==0){
                if(event.target.id!='tag_view_out'&&event.target.id!='tag_view_text'&&event.target.id!='help'&&event.target.id!='path_help'&&event.target.className.baseVal!='lock_svg'&&event.target.className.baseVal!='lock_path'&&event.target.id!='trash'&&event.target.id!='path_trash'&&document.getElementById('tag_view_text')!=null&&document.getElementById('tag_view_text').value!='未设置匹配标签'){//存cookie
                    if(document.getElementById('tag_view_out').style.backgroundColor=='rgb(229, 229, 229)'){//为灰色，即公开收藏标签
                        GM_setValue('tagSaveSafe',document.getElementById('tag_view_text').value,90)
                    }
                    else if(document.getElementById('tag_view_out').style.backgroundColor=='rgb(240, 215, 215)'){
                        GM_setValue('tagSave',document.getElementById('tag_view_text').value)
                    }
                }
            }
            if(event.target.id!='tag_view_out'&&event.target.id!='tag_view_text'&&event.target.id!='help'&&event.target.id!='path_help'&&event.target.id!='spin'&&event.target.id!='path_spin'&&event.target.className.baseVal!='lock_svg'&&event.target.className.baseVal!='lock_path'&&event.target.id!='trash'&&event.target.id!='path_trash'&&document.getElementById('tag_view_text')!=null&&document.getElementById('tag_view_text').value!='未设置匹配标签'){//关闭输入栏
                document.getElementById('tag_view_out').style.opacity='0'
                setTimeout(function () {
                    document.getElementById('tag_view_out').remove()
                }, 250);
            }
            if(event.target.id=='help'||event.target.id=='path_help'){//点击问号，触发tagCookie格式
                alert('tagCookie格式\n用"*"分割两个主标签，","分割主标签和其副标签，"|"分割副标签和副标签\n如：“风景,景色|场景*自然,森林|草地|野外”，当遇到作品标签中包含“风景、景色、场景”时，将设置标签为“风景”，包含“自然、森林、草地、野外”时将设置标签为“自然”')
            }
            if(event.target.id=='spin'||event.target.id=='path_spin'){//
                var spin=document.getElementById('spin')
                if(document.getElementById('tag_view_out').style.backgroundColor=='rgb(229, 229, 229)'){
                    spin.style.transform='rotate(360deg)'
                    document.getElementById('tag_view_out').style.backgroundColor='#f0d7d7'
                    document.getElementById('tag_view_text').style.backgroundColor='#f0d7d7'
                    if(getCookie('tagCookieType')==0){
                        if(GM_getValue('tagSave')!=''){
                            document.getElementById('tag_view_text').value=GM_getValue('tagSave')
                        }
                        else if(GM_getValue('tagSave')==''){
                            document.getElementById('tag_view_text').value='未设置匹配标签'
                        }
                    }
                    else{
                        if(getCookie('tagCookieType')==1){
                            document.getElementById('tag_view_text').value=tagSave
                        }
                        else if(getCookie('tagCookieType')==0){
                            if(GM_getValue('tagSave')!=''){
                                document.getElementById('tag_view_text').value=GM_getValue('tagSave')
                            }
                            else{
                                document.getElementById('tag_view_text').value='未设置匹配标签'
                            }
                        }
                    }
                }
                else if(document.getElementById('tag_view_out').style.backgroundColor=='rgb(240, 215, 215)'){
                    spin.style.transform='rotate(0deg)'
                    document.getElementById('tag_view_out').style.backgroundColor='#cee0d2'
                    document.getElementById('tag_view_text').style.backgroundColor='#cee0d2'
                    if(getCookie('tagCookieType')==0){
                        if(GM_getValue('tagProhibit')!=''){
                            document.getElementById('tag_view_text').value=GM_getValue('tagProhibit')
                        }
                        else if(GM_getValue('tagProhibit')==''){
                            document.getElementById('tag_view_text').value='未设置匹配标签'
                        }
                    }
                    else{
                        if(getCookie('tagCookieType')==1){
                            document.getElementById('tag_view_text').value=tagProhibit
                        }
                        else if(getCookie('tagCookieType')==0){
                            document.getElementById('tag_view_text').value='未设置匹配标签'
                        }
                    }
                }
                else if(document.getElementById('tag_view_out').style.backgroundColor=='rgb(206, 224, 210)'){
                    spin.style.transform='rotate(0deg)'
                    document.getElementById('tag_view_out').style.backgroundColor='#e5e5e5'
                    document.getElementById('tag_view_text').style.backgroundColor='#e5e5e5'
                    if(getCookie('tagCookieType')==0){
                        if(GM_getValue('tagSaveSafe')!=''){
                            document.getElementById('tag_view_text').value=GM_getValue('tagSaveSafe')
                        }
                        else if(GM_getValue('tagSaveSafe')==''){
                            document.getElementById('tag_view_text').value='未设置屏蔽词'
                        }
                    }
                    else{
                        if(getCookie('tagCookieType')==1){
                            document.getElementById('tag_view_text').value=tagSaveSafe
                        }
                        else if(getCookie('tagCookieType')==0){
                            document.getElementById('tag_view_text').value='未设置屏蔽词'
                        }
                    }
                }
            }
            if(event.target.className.baseVal=='lock_svg'||event.target.className.baseVal=='lock_path'){
                if(event.target.id=='lock'||event.target.id=='path_lock'){
                    document.getElementById('path_lock').setAttribute('d','M11,14.7324356 C11.5978014,14.3866262 12,13.7402824 12,13 C12,11.8954305 11.1045695,11 10,11 C8.8954305,11 8,11.8954305 8,13 C8,13.7402824 8.40219863,14.3866262 9,14.7324356 L9,17 L11,17 L11,14.7324356 Z M13,6 C13,4.34314575 11.6568542,3 10,3 C8.34314575,3 7,4.34314575 7,6 L7,8 L13,8 L13,6 Z M4,8 L4,6 C4,2.6862915 6.6862915,0 10,0 C13.3137085,0 16,2.6862915 16,6 L13,6 L13,8 L17.0049107,8 C18.1067681,8 19,8.90195036 19,10.0085302 L19,17.9914698 C19,19.1007504 18.1073772,20 17.0049107,20 L2.99508929,20 C1.8932319,20 1,19.0980496 1,17.9914698 L1,10.0085302 C1,8.8992496 1.8926228,8 2.99508929,8 L4,8 Z')
                    setCookie('tagCookieType',0,90)
                    document.getElementById('path_lock').id='path_unlock'
                    document.getElementById('lock').id='unlock'
                    document.getElementById('div_lock').title='正在使用cookie中正则'
                }
                else if(event.target.id=='unlock'||event.target.id=='path_unlock'){
                    document.getElementById('path_unlock').setAttribute('d','M11,14.7324356 C11.5978014,14.3866262 12,13.7402824 12,13 C12,11.8954305 11.1045695,11 10,11 C8.8954305,11 8,11.8954305 8,13 C8,13.7402824 8.40219863,14.3866262 9,14.7324356 L9,17 L11,17 L11,14.7324356 Z M13,6 C13,4.34314575 11.6568542,3 10,3 C8.34314575,3 7,4.34314575 7,6 L7,8 L13,8 L13,6 Z M4,8 L4,6 C4,2.6862915 6.6862915,0 10,0 C13.3137085,0 16,2.6862915 16,6 L16,8 L17.0049107,8 C18.1067681,8 19,8.90195036 19,10.0085302 L19,17.9914698 C19,19.1007504 18.1073772,20 17.0049107,20 L2.99508929,20 C1.8932319,20 1,19.0980496 1,17.9914698 L1,10.0085302 C1,8.8992496 1.8926228,8 2.99508929,8 L4,8 Z')
                    setCookie('tagCookieType',1,90)
                    document.getElementById('path_unlock').id='path_lock'
                    document.getElementById('unlock').id='lock'
                    document.getElementById('div_lock').title='正在使用代码中正则'
                }
            }
            if(event.target.id=='trash'||event.target.id=='path_trash'){
                var trash_confirm=confirm('是否删除cookie中储存的正则？')
                if(trash_confirm==true){
                    GM_setValue('tagSaveSafe','')
                    GM_setValue('tagSave','')
                }
            }
        }
    })


    var No11=document.getElementById('No11')
    No11.addEventListener('click',function(event){
        // alert('No11')
        var new_url=[]
        if(window.location.href.match('users')!=null){
            var user_id=window.location.href.match(/\d+/)[0]
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://www.pixiv.net/ajax/user/"+user_id+"/profile/all?lang=zh",
                headers:{
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36 Edg/93.0.961.52",
                },
                onload: function(res) {
                    if(res.status === 200){
                        //console.log('成功')
                        var p=res.responseText
                        var user_illust=p.match(/(?<=\")\d+(?=\":null)/g)
                        var urlNum_split=Math.ceil(user_illust.length/100)//判断需要分成多少个100
                        for(var i=0;i<urlNum_split;i++){
                            new_url[i]='https://www.pixiv.net/ajax/user/'+user_id+'/profile/illusts?'
                            if(i!=urlNum_split-1){
                                var max=i*100+100
                                }
                            else{
                                max=i*100+user_illust.length-Math.floor(user_illust.length/100)*100
                            }
                            for(var j=i*100;j<max;j++){
                                new_url[i]=new_url[i]+'ids%5B%5D='+user_illust[j]+'&'
                            }
                            new_url[i]=new_url[i]+'work_category=illustManga&is_first_page=0&lang=zh'
                        }
                        // console.log(new_url)
                        GM_setClipboard(new_url)


                        var textFinal=''
                        var ppp=0
                        for(var o=0;o<new_url.length;o++){
                            GM_xmlhttpRequest({
                                method: "GET",
                                url: new_url[o],
                                headers:{
                                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36 Edg/93.0.961.52",
                                },
                                onload: function(res) {
                                    if(res.status === 200){
                                        ppp++
                                        // console.log('成功')
                                        var p=res.responseText
                                        var illust_IdPage=p.replace(/","title":".*?"pageCount":/g,'**').match(/\d+\*\*\d+/g)//获取作品id和图片数
                                        for(var k=0;k<illust_IdPage.length;k++){
                                            if(illust_IdPage[k].split("**")[1]==1){
                                                textFinal=textFinal+'https://pixiv.re/'+illust_IdPage[k].split("**")[0]+'.png\n'
                                            }
                                            else{
                                                for(var h=0;h<parseInt(illust_IdPage[k].split("**")[1]);h++){
                                                    textFinal=textFinal+'https://pixiv.re/'+illust_IdPage[k].split("**")[0]+'-'+(h+1)+'.png\n'
                                                }
                                            }
                                        }
                                        if(ppp==new_url.length){
                                            // console.log(textFinal)
                                            download('User Illust.txt',textFinal)
                                        }
                                    }
                                }
                            })
                        }
                    }
                }
            })
        }
        else{
            alert('请在画师界面使用此功能')
        }
    })
    checkCookie()

    var No12=document.getElementById('No12')
    No12.addEventListener('click',function(e){
        var isR18=0

        var sort_ul=document.createElement('ul')
        sort_ul.id='sort_ul'
        sort_ul.className='sort_ul'
        var sort_ul_out=document.getElementsByClassName('sc-l7cibp-0 juyBTC')[0]//搜索界面“预览图”框架的ul元素的父元素
        sort_ul_out.appendChild(sort_ul)
        if(document.getElementsByClassName('sc-l7cibp-3 gCRmsl')!=null){
            sort_ul_out.insertBefore(sort_ul,document.getElementsByClassName('sc-l7cibp-3 gCRmsl')[0])
        }
        document.getElementsByClassName('sc-l7cibp-1 krFoBL')[0].style.display='none'//原本搜索页ul元素
        document.getElementsByClassName('sc-l7cibp-3 gCRmsl')[0].style.display='none'//原本页面页码部分（换页）

        var sort_more_out=document.createElement('div')
        sort_more_out.id='sort_more_out'
        sort_ul_out.appendChild(sort_more_out)

        var sort_more_background=document.createElement('div')
        sort_more_background.id='sort_more_background'
        sort_more_out.appendChild(sort_more_background)

        var sort_more_text=document.createElement('div')
        sort_more_text.id='sort_more_text'
        sort_more_text.innerText='查看更多'
        sort_more_background.appendChild(sort_more_text)

        if(window.location.href.match(/mode=safe/)!=null){
            isR18=1//全年龄
        }
        else if(window.location.href.match(/mode=r18/)!=null){
            isR18=2//r18
        }
        else{
            isR18=0//无要求
        }
        var sortTag=window.location.href.match(/(?<=\/tags\/).*?(?=\/)/)
        if(sortTag!=null){
            sortRequest(1,sortTag,false,isR18,0)
        }

        sort_more_background.onclick=function(){
            /*
            var sort_less_length=document.getElementsByClassName('sort_li').length
            var allBookmark_length=allBookmark_split.length
            console.log(allBookmark_split)
            if(sort_less_length<allBookmark_length){
                var length=60
                if(allBookmark_length-sort_less_length<60){
                    length=allBookmark_length-sort_less_length
                }
                for(var h=length-1;h>0;h--){
                    var sort_info=allBookmark_split[allBookmark_length-sort_less_length-1-(length-1-h)].split(',')
                    sort_addillust(sort_info[0],sort_info[1],ssort_search_pageort_info[2],sort_info[3],sort_info[4],sort_info[5],sort_info[6],sort_info[7],sort_info[8],sort_info[9])
                }
            }
            */
            if(window.location.href.match(/mode=safe/)!=null){
                isR18=1//全年龄
            }
            else if(window.location.href.match(/mode=r18/)!=null){
                isR18=2//r18
            }
            else{
                isR18=0//无要求
            }
            sortTag=window.location.href.match(/(?<=\/tags\/).*?(?=\/)/)
            var sort_search_page=parseInt(window.location.href.match(/(?<=\#sort)\d+/)[0])
            sortRequest(sort_search_page+1,sortTag,false,isR18,0)
        }
    })
    No12.addEventListener('contextmenu',function(e){
        console.log('a')
        if(getCookie('singleSort')==0){
            setCookie('singleSort',1,90)
            No12.childNodes[0].setAttribute('fill','red')
        }
        else{
            setCookie('singleSort',0,90)
            No12.childNodes[0].setAttribute('fill','white')
        }
        event.preventDefault()
    })

    var No13=document.getElementById('No13')
    No13.addEventListener('click',function(e){
        if(getCookie("unfold")==0){
            setCookie('unfold',1,90)
            document.getElementById('path21').style.fill='red'
        }
        else{
            setCookie("unfold",0,90)
            document.getElementById('path21').style.fill='white'
        }
    })
    //————————————————————————————————————————————————————————————

    var left_1,top_1
    document.body.addEventListener('mousemove',function(event){
        var pre_check=getCookie("preImg")
        if((pre_check=="1"||pre_check=="2"||pre_check=="3")&&event.ctrlKey!=true){
            var left_1=event.pageX+"px"
            var top_1=event.pageY+"px"

            // event.target.addEventListener('mousemove',(event)=>{
            //     left_1=event.pageX+"px"
            //     top_1=event.pageY+"px"
            // })

            var kid=event.target.innerHTML//
            if(kid==""){
                kid=event.target.parentNode.innerHTML
            }
            var eventt=event.target
            // for(var ab=0;ab<10;ab++){
            //     if(eventt==null){
            //         break
            //     }
            //     else if(eventt.className=="sc-1nhgff6-4 boBnlf"||eventt.className=="sc-l7cibp-1 krFoBL"||eventt.className=="sc-1olyam9-0 sc-yxl4jc-0 hjtPnz bpXOJR"||eventt.className=="sc-9y4be5-1 jtUPOE"||eventt.className=="sc-1kr69jw-0 hkzusx"||eventt.className=="sc-l7cibp-1 hdRpMN"||eventt.className=="userImgUl"||eventt.className=="sort_ul"){//分别对应“大图页面画师下方滚动图”，“大图页面图片推荐、主页‘推荐作品’”，“主页‘按标签推荐作品’”，“主页除‘推荐作品’与‘按标签推荐作品’以外大部分位置”，搜索页面单个图片，更多作者图片ul元素，收藏数排序图片ul元素
            //         var className=true
            //         break
            //     }
            //     else{
            //         eventt=eventt.parentNode
            //     }
            // }
            // if(document.getElementById('bigImg_1')!=null){
            if(eventt.closest(".sc-1nhgff6-4.boBnlf")!=null||eventt.closest(".sc-l7cibp-1.krFoBL")!=null||eventt.closest(".sc-1olyam9-0.sc-yxl4jc-0.hjtPnz.bpXOJR")!=null||eventt.closest(".sc-9y4be5-1.jtUPOE")!=null||eventt.closest(".sc-1kr69jw-0.hkzusx")!=null||eventt.closest(".sc-l7cibp-1.hdRpMN")!=null||eventt.closest(".userImgUl")!=null||eventt.closest(".sort_ul")!=null||eventt.closest(".sc-e6de33c8-0.sc-96f10c4f-0.fhUcsb.cCkJMN")!=null||eventt.closest('.relative.group')!=null||(eventt.closest('ul')!=null)){
                var className=true
                }
            if(kid.match("square1200")!=null&&className!=""||kid.match("custom1200")!=null&&className!=""){
                var url=window.location.href
                if(className==true){
                    if(url.match("artwork")!="null"){
                        if(event.target.childNodes.length!=0){
                            var innerHTML=event.target.childNodes[0].currentSrc
                            }
                        else{
                            innerHTML=event.target.currentSrc
                        }
                        if(innerHTML!=undefined){
                            if(event.target.src!=null){
                                if(document.getElementById("bigImg_1")!=null){
                                    if(event.target.src==same_img){
                                        var inside=''
                                        isChangingSrc=0
                                    }
                                    else{
                                        same_img=event.target.src// || event.target.getElementsByTagName('img')[0].src
                                        inside=event.target.src.match(/\d{4}\/\d{2}\/\d{2}\/\d{2}\/\d{2}\/\d{2}\/\d{6,10}(_p0){0,1}/)[0]
                                        isChangingSrc=1
                                    }
                                }
                                else{
                                    same_img=event.target.src// || event.target.getElementsByTagName('img')[0].src
                                    inside=event.target.src.match(/\d{4}\/\d{2}\/\d{2}\/\d{2}\/\d{2}\/\d{2}\/\d{6,10}(_p0){0,1}/)[0]
                                    isChangingSrc=1
                                }

                                if(document.getElementById('aaaa')==null&&event.target.nextSibling!=null&&(event.target.nextSibling.tagName=="svg"||event.target.innerHTML.match('sc-192k5ld-0 etaMpt sc-rp5asc-8 kSDUsv')!=null)){//gif暂停按钮的className
                                    //innerHTML="https://api.moedog.org/pixiv/interface/PixivProxy.php?url=https://i.pximg.net/c/540x540_70/img-master/img/"+inside+"_master1200.jpg"
                                    innerHTML="https://i.pximg.net/c/540x540_70/img-master/img/"+inside+"_master1200.jpg"
                                    var type='img'
                                    if(getCookie('bigGif')==1){//动图预览开启
                                        type='gif'
                                    }
                                    if(document.getElementById('bigImg_1')==null){
                                        addImg(top_1,left_1,innerHTML,event,type,isChangingSrc)
                                    }
                                    else{
                                        addImg(top_1,left_1,innerHTML,event,type,isChangingSrc)
                                    }
                                }
                                //——————
                                else{
                                    if(getCookie("preImg")=="2"){
                                        //innerHTML="https://api.moedog.org/pixiv/interface/PixivProxy.php?url=https://i.pximg.net/c/540x540_70/img-master/img/"+inside+"_master1200.jpg"
                                        innerHTML="https://i.pximg.net/c/540x540_70/img-master/img/"+inside+"_master1200.jpg"
                                    }
                                    else if(getCookie("preImg")=="3"){
                                        //innerHTML="https://api.moedog.org/pixiv/interface/PixivProxy.php?url=https://i.pximg.net/img-master/img/"+inside+"_master1200.jpg"
                                        innerHTML="https://i.pximg.net/img-master/img/"+inside+"_master1200.jpg"
                                    }
                                    addImg(top_1,left_1,innerHTML,event,'img',isChangingSrc)
                                    if(getCookie("preImg")=="3"){
                                        pictureSize(document.getElementById("bigImg_1"))
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        else if(getCookie("preImg")=="0"&&document.getElementById('occupy')==null&&event.target.tagName=='IMG'&&(event.target.src.match("square1200")||event.target.src.match("custom1200"))){
            var occupy=document.createElement('occupy')
            occupy.id='occupy'
            occupy.innerText=event.target.src
            occupy.style.display='none'
            document.body.appendChild(occupy)
        }
    })
    document.body.addEventListener('mousemove',function(event){
        var eventT=event.target
        if(eventT.tagName!='UL'&&eventT.tagName!='SECTION'){
            var eventT_ul=eventT.closest('ul')
            }
        else{
            ab=false
        }
        if(eventT_ul!=null){
            if(ab!=false&&eventT_ul!=null&&(eventT_ul.className=="sc-iasfms-1 hYfnPb"||eventT_ul.className=="sc-iasfms-3 jDiPOg"||eventT_ul.className=="sc-l7cibp-1 krFoBL"||eventT_ul.className=="sc-1kr69jw-0 hkzusx"||eventT_ul.className=="sc-9y4be5-1 jtUPOE"||eventT_ul.className=="sc-1olyam9-0 sc-yxl4jc-0 hjtPnz bpXOJR"||eventT_ul.className=='sc-l7cibp-1 hdRpMN'||eventT_ul.className=='userImgUl'||eventT_ul.className=='sort_ul'||eventT_ul.className=='sc-e6de33c8-0 sc-96f10c4f-0 fhUcsb cCkJMN'||event.target.closest('.relative.group')!=null)){//分别对应“大图片页面下推荐图片部分单个图片”和“主页面部分图片单个图片”、“大图片页面画师信息下滚动部分单个图片”、搜索页面单个图片、更多作者图片部分ul元素、首页“推荐作品”部分ul元素（关注作者的作品的部分下面的部分）、首页“精选新作”部分上层的div元素（关注作者的作品的部分）
                var ab=true
                }
            else{
                ab=false
            }
        }
        else{
            eventT_ul=eventT.closest('NAV')
            if(eventT_ul!=null&&eventT_ul.className=="sc-1nhgff6-3 cAicGw"){//最近的nav元素的className
                ab=true
            }
            else{
                ab=false
            }
        }
        if(ab==false){
            var search=document.getElementById("bigImg")
            if(search==null){
                search=document.getElementById("bigImg_1")
            }
            if(search!=null){
                search.remove()
            }
            if(document.getElementById("occupy")!=null){
                document.getElementById("occupy").remove()
            }
            bigImg_scale=1
        }
    })
    //————————————————————————————————————————————————————
    var bigImg_scale=1
    window.addEventListener('keydown',function(event){
        if((document.getElementById("bigImg_1")!=null||document.getElementById("bigImg")!=null)&&(event.keyCode==187||event.keyCode===188||event.keyCode===189||event.keyCode===190||event.keyCode===87||event.keyCode===65||event.keyCode===83||event.keyCode===68)){
            var preview=document.getElementById("bigImg")
            if(preview==null){
                preview=document.getElementById("bigImg_1")
            }
            var preSrc=preview.src.split(/_p\d{1,3}_/)
            if(preview.src.match(/_p\d{1,3}_/)!=null){
                var preNum=parseInt(preview.src.match(/_p\d{1,3}_/)[0].match(/\d{1,3}/))
                }
            else{
                preNum=-1
            }
            if(event.keyCode==188&&preNum!=-1){
                if(preNum!=0){
                    preview.src=preSrc[0]+"_p"+(preNum-1)+"_"+preSrc[1]
                }
            }
            else if(event.keyCode==190&&preNum!=-1){
                preview.src=preSrc[0]+"_p"+(preNum+1)+"_"+preSrc[1]
            }
            else if(event.keyCode==189){//减号键
                if(bigImg_scale!=0.25){
                    bigImg_scale=bigImg_scale-0.25
                }
                document.getElementById('bigImg_1').style.transform='scale('+bigImg_scale+')'
            }
            else if(event.keyCode==187){//加号键
                bigImg_scale=bigImg_scale+0.25
                document.getElementById('bigImg_1').style.transform='scale('+bigImg_scale+')'
            }
            else if(event.keyCode==87){//w
                document.getElementById('bigImg_1').style.top=parseInt(document.getElementById('bigImg_1').style.top.match(/\d+/)[0])-20+'px'
            }
            else if(event.keyCode==65){//a
                document.getElementById('bigImg_1').style.left=parseInt(document.getElementById('bigImg_1').style.left.match(/\d+/)[0])-20+'px'
            }
            else if(event.keyCode==83){//s
                document.getElementById('bigImg_1').style.top=parseInt(document.getElementById('bigImg_1').style.top.match(/\d+/)[0])+20+'px'
            }
            else if(event.keyCode==68){//d
                document.getElementById('bigImg_1').style.left=parseInt(document.getElementById('bigImg_1').style.left.match(/\d+/)[0])+20+'px'
            }
        }

        //锚点
        if((document.getElementById('bigImg_1')!=null||document.getElementById('bigImg')!=null||document.getElementById('occupy')!=null)&&event.keyCode==191){
            if(document.getElementById('bigImg_1')!=null){
                var id=document.getElementById('bigImg_1').src.match(/(?<=\/)\d+(?=_)/)//——————————————————————————————————————
                }
            else if(document.getElementById('occupy')!=null){
                id=document.getElementById('occupy').innerText.match(/(?<=\/)\d+(?=_)/)
            }
            if(event.ctrlKey!=true){
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://www.pixiv.net/artworks/"+id,
                    headers:{
                        "User-Agent": navigator.userAgent,
                    },
                    onload: function(res) {
                        if(res.status === 200){
                            //console.log('成功')
                            var p=res.responseText

                            var ai=''
                            if(p.match(/(?<=\"aiType\"\:)\d+/)!=null&&p.match(/(?<=\"aiType\"\:)\d+/)==2){
                                ai='AI生成，'
                            }

                            var b=p.match(/(?<=\"tags\"\:\[)\{.*?(?=\],\"wri)/)[0].split('},{')
                            var a=[]
                            for(var i=0;i<b.length;i++){
                                if(b[i].match(/(?<={\"en\":\").*?(?=\"})/)!=null){
                                    a[i]=b[i].match(/(?<="tag":").*?(?=","locked)/)[0]+' ('+b[i].match(/(?<={\"en\":\").*?(?=\"})/)[0]+')'
                                }
                                else{
                                    a[i]=b[i].match(/(?<="tag":").*?(?=","locked)/)[0]
                                }
                            }
                            var c=''
                            for(var j=0;j<a.length;j++){
                                if(j!=a.length-1){
                                    c=c+a[j]+',   '
                                }
                                else{
                                    c=c+a[j]
                                }
                            }
                            alert("作品标签：\n\n"+ai+c)
                            event.preventDefault()
                        }
                    }
                })
            }
            else{
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://www.pixiv.net/bookmark_add.php?type=illust&illust_id="+id,
                    headers:{
                        "User-Agent": navigator.userAgent,
                    },
                    onload: function(res) {
                        if(res.status === 200){
                            //console.log('成功')
                            var p=res.responseText
                            var tags=p.match(/(?<=收藏的标签.*?value=\").*?(?=\")/)
                            if(tags!=null){
                                tags=tags[0]
                            }
                            if(tags!=''){
                                alert("您收藏的标签：\n\n"+tags.replace(/ /g,"，").replace(/，$/,''))
                            }
                            else{
                                alert("您尚未收藏此作品")
                            }
                            event.preventDefault()
                        }
                    }
                })
            }
        }

    })
    document.getElementById('text').addEventListener('mouseover',function(event){//储存链接栏显示预览图
        visualPic(event)
    })
    window.addEventListener('mousedown',function(event){
        if(document.getElementById("bigImg_1")!=null||document.getElementById("bigImg")!=null){
            var preview=document.getElementById("bigImg")
            if(preview==null){
                preview=document.getElementById("bigImg_1")
            }
            var preSrc=preview.src.split(/_p\d{1,3}_/)
            if(preview.src.match(/_p\d{1,3}_/)!=null){
                var preNum=parseInt(preview.src.match(/_p\d{1,3}_/)[0].match(/\d{1,3}/))
                }
            else{
                preNum=-1
            }
            if(event.button==3&&preNum!=-1){
                if(preNum!=0){
                    preview.src=preSrc[0]+"_p"+(preNum-1)+"_"+preSrc[1]
                }
                event.preventDefault()
            }
            else if(event.button==4&&preNum!=-1){
                preview.src=preSrc[0]+"_p"+(preNum+1)+"_"+preSrc[1]
                event.preventDefault()
            }
        }
    })

    window.addEventListener('contextmenu',function(event){//储存链接栏右键删除链接
        if(event.target.className=="insideText"){
            var id=event.target.innerText.match(/\d+/)[0]
            if(getCookie("user_url").match(id)!=null){
                var newCookie=getCookie("user_url").split(id)[0]+getCookie("user_url").split(id)[1].replace(/\*\d+,/,"")
                event.target.remove()
                setCookie("user_url",newCookie,-1)
            }
            else{
                var allCookie=document.cookie
                var cookie_num=allCookie.substr(allCookie.match(id).index-2,1)//获取是第几个pixivid
                event.target.remove()
                delCookie("pixivid"+cookie_num)
            }
            event.preventDefault()
        }
    })

    function json_delete(json,type,userID,webName){
        if(type==0){//要删除整个用户的内容
            delete json[userID]
        }
        else if(type==1){
            var flag=0
            for(var i=0;i<json[userID].length;i++){
                if(flag==0){
                    if(json[userID][i][0]==webName){
                        if(json[userID][i+1]==null){
                            json[userID].splice(i,1)
                            break;
                        }
                        else{
                            json[userID][i]=json[userID][i+1]
                        }
                        flag=1
                    }
                }
                else if(flag==1){
                    if(json[userID][i+1]==null){
                        json[userID].splice(i,1)
                        break;
                    }
                    json[userID][i]=json[userID][i+1]
                }
            }
            if(json[userID].length==0){
                json_delete(json,0,userID)
            }
        }
    }

    var add_count=0//用于判断展开user_add还是收回
    var link_count=0;
    if(window.location.href.match('users')==null){
        document.getElementById("add_cover").addEventListener('click',function(event){
            if(add_count==0){
                var text1=document.createElement("text")
                if(document.getElementsByClassName("sc-mhypg7-1 dmRrjk")[0].innerText=="已关注"&&getCookie("aside").split(",")[0]=="1"){
                    text1.innerText="已关注"
                }
                else{
                    text1.innerText="隐私关注"
                }

                var add_text_all=document.createElement('div')
                add_text_all.id='add_text_all'
                document.getElementById("div_add").appendChild(add_text_all)

                text1.id="add_text1"
                text1.className="add_text"
                var text2=document.createElement("text")
                text2.id="add_text2"
                text2.className="add_text"
                text2.innerText="相似作者"
                var text3=document.createElement("text")
                text3.id="add_text3"
                text3.className="add_text"
                text3.innerText="黑名单"
                var text4=document.createElement('text')
                text4.id="add_text4"
                text4.className="add_text"
                text4.innerText="作者作品"

                add_text_all.appendChild(text1)
                add_text_all.appendChild(text2)
                add_text_all.appendChild(text3)
                add_text_all.appendChild(text4)
                $("#add").animate({height:"120px",width:"102px",borderRadius:"15px"},100);
                $("#add_cover").animate({height:"120px"},100)
                setTimeout(function () {
                    $(".add_text").animate({opacity:"1"},100)
                }, 250);

                document.getElementById("path16").style.transform="scale(0.03) translate(60px, 1320px)"
                add_count=1
            }
            else if(add_count==1){
                $(".add_text").animate({opacity:"0"},100)
                setTimeout(function () {
                    $("#add").animate({height:"32px",width:"32px",borderRadius:"16px"},100);
                    $("#add_cover").animate({height:"32px"},100)
                    document.getElementById("path16").style.transform="scale(0.02) translate(300px, 280px)"
                }, 100);
                setTimeout(function () {
                    document.getElementById("add_text1").remove()
                    document.getElementById("add_text2").remove()
                    document.getElementById("add_text3").remove()
                    document.getElementById("add_text4").remove()
                }, 600);
                add_count=0
            }
        })
    }
    else
    {
        var link_cover_top_interval_count=0
        var link_cover_top_interval=setInterval(function(){
            if(link_cover_top_interval_count==60){
                clearInterval(link_cover_top_interval)
            }
            else if(document.getElementsByClassName('sc-1bcui9t-4 dqLunY')[0]!=null){
                var link_cover_top=document.getElementsByClassName('sc-1bcui9t-4 dqLunY')[0].getBoundingClientRect().top//作者页面的作者名称
                document.getElementById("div_link").style.position='absolute'
                document.getElementById("div_link").style.top=link_cover_top+'px'
                document.getElementById("div_link").style.left='86.8%'
                clearInterval(link_cover_top_interval)
            }
            link_cover_top_interval_count++;
        },500)
        document.getElementById("link_cover").addEventListener('click',function(event){
            var user_id=window.location.href.match(/(?<=users\/)\d+/)[0]
            var jsonLink=GM_getValue("pixiv_user_outLink")
            if(jsonLink[user_id]==null){
                jsonLink[user_id]=[]
            }
            if(link_count==0){
                var link_text_all=document.createElement('div')
                link_text_all.id='link_text_all'
                document.getElementById("div_link").appendChild(link_text_all)
                var height=(jsonLink[user_id].length+1)*50;
                link_text_all.style.height=height+'px'

                for(var w=0;w<jsonLink[user_id].length;w++){
                    var link_text=document.createElement('a')
                    link_text.className='link_text'
                    link_text.innerText=jsonLink[user_id][w][0]
                    link_text.href=jsonLink[user_id][w][1]
                    link_text.setAttribute("target","_blank")

                    link_text.oncontextmenu=function(e){
                        var conf=confirm('是否要删除这个链接？')
                        if(conf==true){
                            //json_delete(json,type,userID,webName){
                            json_delete(jsonLink,1,user_id,e.target.innerText)
                            GM_setValue("pixiv_user_outLink",jsonLink)
                            e.target.remove()
                            //console.log(jsonLink)
                        }
                        e.preventDefault()
                    }

                    link_text_all.appendChild(link_text)
                }
                var user_link_add=document.createElement('a')
                user_link_add.id='user_link_add'
                user_link_add.innerText='+'
                link_text_all.appendChild(user_link_add)
                user_link_add.onclick=function(){
                    var user_id=window.location.href.match(/(?<=users\/)\d+/)[0]
                    var json=GM_getValue("pixiv_user_outLink")
                    var link_input=prompt('请按照“网站名称,网站地址”的格式输入（包含https），如“pixiv,https://www.pixiv.net”')
                    if(link_input!=null){
                        link_input=link_input.split(',')
                    }
                    if(link_input.length!=2){
                        alert("请按照正确格式输入")
                        return
                    }
                    if(json[user_id]==null){
                        json[user_id]=[[link_input[0],link_input[1]]]
                    }
                    else{
                        json[user_id][json[user_id].length]=[link_input[0],link_input[1]]
                    }
                    GM_setValue("pixiv_user_outLink",json)
                }

                $("#link").animate({height:height+'px',width:"111px",borderRadius:"15px"},100);
                $("#link_cover").animate({height:height+'px'},100)
                setTimeout(function () {
                    $(".link_text").animate({opacity:"1"},100)
                    $("#user_link_add").animate({opacity:"1"},100)
                }, 250);
                document.getElementById("user_link_num").innerText='···'
                document.getElementById("user_link_num").style.transform="translate(-36px, 0px) rotate(90deg)"
                //$("#path22").animate({}
                link_count=1
                /*
                else{
                    link_add.style.width='40px'
                    link_add.style.height='40px'
                    link_add.style.left='94.3%'
                    link_add.style.opacity=1
                    link_add.style.marginLeft='50px'
                    document.getElementById('link_add').style.left='94.4%'
                    link_count=1
                }
                */
            }
            else if(link_count==1){
                $(".link_text").animate({opacity:"0"},100)
                $("#user_link_add").animate({opacity:"0"},100)
                setTimeout(function () {
                    $("#link").animate({height:"32px",width:"32px",borderRadius:"16px"},100);
                    $("#link_cover").animate({height:"32px"},100)
                    document.getElementById('user_link_num').innerText=jsonLink[user_id].length
                    document.getElementById("user_link_num").style.transform="scale(1) translate(0px, 0px)"
                }, 100);
                setTimeout(function () {
                    if(document.getElementById("link_text_all")!=null){
                        document.getElementById("link_text_all").remove()
                    }
                }, 600);
                link_count=0
            }
        })
    }
    window.addEventListener('click',function(event){
        if(event.target.id=="add_text1"){
            var user_id=document.getElementsByTagName("aside")[0].innerHTML.match(/(?<=\/users\/)\d+/)[0]
            fetch("https://www.pixiv.net/bookmark_add.php",{
                headers: {
                    "accept": "application/json",
                    "content-type": "application/x-www-form-urlencoded; charset=utf-8",
                    "x-csrf-token": getCookie('token')
                },
                "referrer": window.location.href,
                'method':'POST',
                "mode": "cors",
                "credentials": "include",
                body:"mode=add&type=user&user_id="+user_id+"&restrict=1&format=json&tag=[]"
            })
            setCookie("aside","1,"+getCookie("aside").split(",")[1],90)
            event.target.innerText="已关注"
        }
        else if(event.target.id=="add_text2"){
            //var user_recommend_id=document.getElementsByClassName("sc-d98f2c-0 sc-fujyAs eEzOcr")[0].outerHTML.match(/(?<=\/users\/)\d+/)[0]//classname为大图页面上任意一个能够获取到作者id的元素，此处为右侧aside元素中的作者昵称部分
            var user_recommend_id=document.getElementsByTagName('h2')[0]
            if(user_recommend_id.getElementsByTagName('a')[0]!=null){
                user_recommend_id=user_recommend_id.getElementsByTagName('a')[0].href.match(/\d+/)[0]
            }
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://www.pixiv.net/ajax/user/"+user_recommend_id+"/recommends?userNum=20&workNum=3&isR18=true&lang=zh",
                headers:{
                    "x-user-id":10000000
                },
                onload: function(res) {
                    if(res.status === 200){
                        // console.log('成功')
                        var p=res.responseText
                        var img_url=[]
                        var img_href=[]
                        var user_id=[]
                        var user_img=[]
                        var user_name=[]
                        var user_href=[]
                        var img_url_count=0,img_href_count=0,user_id_count=0,user_img_count=0,user_name_count=0,user_href_count=0
                        var q=p.split(",")
                        for(var i=0;i<q.length;i++){
                            if(q[i].match(/^"urls":\{"250x250"/)!=null){
                                img_url[img_url_count]=q[i].substring(q[i].match(/https/).index,q[i].length-1).replace(/\\/g,"")
                                img_href[img_href_count]="https://www.pixiv.net/artworks/"+img_url[img_url_count].match(/\d+(?=_p0)/)
                                // alert(w[count])
                                img_href_count++
                                img_url_count++
                            }
                            else if(q[i].match('"userId":"')!=null){//或许可以只取前20个，但有风险
                                if(user_id[user_id_count-1]!=q[i].match(/\d+/)[0]){
                                    user_id[user_id_count]=q[i].match(/\d+/)[0]
                                    user_href[user_href_count]="https://www.pixiv.net/users/"+user_id[user_id_count]
                                    user_href_count++
                                    user_id_count++
                                }
                            }
                            else if(q[i].match('"userName":"')!=null){
                                if(user_name[user_name_count-1]!=eval("'"+q[i].substring(12,q[i].length-1)+"'")){
                                    user_name[user_name_count]=eval("'"+q[i].substring(12,q[i].length-1)+"'")
                                    user_name_count++
                                }
                            }
                            else if(q[i].match('"profileImageUrl":"')!=null){
                                if(user_img[user_img_count-1]!=q[i].substring(19,q[i].length-2).replace(/\\/g,"")){//数组的最后一位出现了链接最后有一个“\”，导致出现了和上一位一样的链接
                                    //或许可以直接删掉最后一项（判断user_img_count是否等于20），也可以不管
                                    user_img[user_img_count]=q[i].substring(19,q[i].length-2).replace(/\\/g,"")
                                    user_img_count++
                                }
                            }
                        }
                        for(var j=0;j<20;j++){
                            add_recommend(img_url[j*3],img_href[j*3],img_url[j*3+1],img_href[j*3+1],img_url[j*3+2],img_href[j*3+2],user_img[j],user_name[j],user_id[j],user_href[j],15+j*417)
                            //user_pic,user_title_view,user_id,user_url
                        }
                        document.getElementById("recommend").style.bottom="0px"
                    }
                }
            })
        }
        else if(event.target.id=="add_text3"){
            user_recommend_id=document.getElementsByClassName("sc-d98f2c-0 sc-fujyAs eEzOcr")[0].outerHTML.match(/(?<=\/users\/)\d+/)[0]//classname为大图页面上任意一个能够获取到作者id的元素，此处为右侧aside元素中的作者昵称部分
            window.open('https://www.pixiv.net/user_infomsg.php?id='+user_recommend_id,'_blank')
        }
        else if(event.target.id=="add_text4"){
            if(window.location.href.match(/artworks/)!=null){
                userAllPic(0,'')
            }
        }

        if(event.target.className=="js-click-trackable _2Of8xxg"){//未关注时（蓝色）作者关注按钮
            setCookie("aside","0,"+getCookie("aside").split(",")[1],90)
        }
        else if(event.target.className=="js-click-trackable _3LhShlo _2Of8xxg"){//关注时（白色）作者关注按钮
            setCookie("aside","2,"+getCookie("aside").split(",")[1],90)
        }

    })
    document.getElementById("recommend_svg").addEventListener('click',function(e){
        document.getElementById("recommend").style.bottom="-350px"
    })

    window.addEventListener('click',function(e){
        if((e.target.id=='userImg_underImg'||e.target.id=='path_userImg'||e.target.id=='userImgCross')&&document.getElementById('userImgBack')!=null){
            document.getElementById('userImgBack').remove()
            document.getElementById('userImg_underImg').remove()
        }
        if(e.target.className=='userImgPic'){
            window.open(e.target.href,'_blank')
        }
    })

    document.addEventListener('contextmenu',function(event){
        if(event.target.id=='user_svg_background'||event.target.id=='user_svg'){
            if(document.getElementById('user_svg')!=null&&document.getElementById('user_svg').closest('div')!=null){
                var id=document.getElementById('user_svg').closest('div').childNodes[0].href.match(/\d+/)[0]//获取作者id
                userAllPic(1,id)
                event.preventDefault()
            }
        }
    })


    var oldUrl=''
    oldUrl=urlChange(oldUrl)
    window.addEventListener('click',function(e){
        oldUrl=urlChange(oldUrl)
    })
    var all_historyList=0//总共有多少条历史记录
    document.getElementById('deleteCookie').addEventListener('click',function(e){
        if(document.getElementById('history_all')==null){
            var historyAll=document.createElement('div')
            historyAll.id='history_all'
            document.body.appendChild(historyAll)

            var historyBigTitle=document.createElement('a')
            historyBigTitle.id='history_bigTitle'
            historyAll.appendChild(historyBigTitle)

            var historyBigTitleText=document.createElement('text')
            historyBigTitleText.id='history_bigTitleText'
            historyBigTitleText.innerText='历史记录'
            historyBigTitle.appendChild(historyBigTitleText)

            //关闭按钮
            var historyClose = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            var pathHistoryClose = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            historyClose.setAttribute("aria-hidden","true");
            historyClose.setAttribute('viewbox', '0 0 30 30');
            historyClose.setAttribute('width', '30px');
            historyClose.setAttribute('height', '30px');
            pathHistoryClose.setAttribute('d','M604.16 512l110.08-110.08a64 64 0 0 0-90.24-90.88L512 421.76 403.2 311.04a64 64 0 0 0-90.24 90.88L423.04 512 312.96 622.08a64 64 0 1 0 90.24 90.88L512 602.24l110.08 110.08a64 64 0 0 0 90.24-90.24z')
            pathHistoryClose.style.transform="translate(-3px, -3px) scale(0.036)"
            pathHistoryClose.setAttribute('fill', '#000');
            pathHistoryClose.style.opacity='0.5'
            pathHistoryClose.id='pathHistoryClose'
            historyClose.appendChild(pathHistoryClose);
            historyClose.id = 'history_close';
            historyBigTitle.appendChild(historyClose);
            historyClose.onmouseenter=function(){
                historyClose.style.transform='rotate(180deg)'
            }
            historyClose.onmouseleave=function(){
                historyClose.style.transform='rotate(0deg)'
            }
            historyClose.onclick=function(){
                document.getElementById('history_all').remove()
            }

            //垃圾桶按钮
            var historyClear = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            var pathHistoryClearCap = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            var pathHistoryClearBox = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            historyClear.setAttribute("aria-hidden","true");
            historyClear.setAttribute('viewbox', '0 0 30 30');
            historyClear.setAttribute('width', '30px');
            historyClear.setAttribute('height', '30px');
            pathHistoryClearCap.setAttribute('d','M982.912 118.336H801.28V53.312c0-30.08-22.4-52.48-52.224-52.48h-477.44a51.136 51.136 0 0 0-52.288 52.48v62.528H37.888c-19.904 2.496-37.312 19.968-37.312 40a38.4 38.4 0 0 0 37.312 37.504h947.52a38.4 38.4 0 0 0 37.312-37.504c-2.56-20.032-19.904-37.504-39.808-37.504z')
            pathHistoryClearCap.style.transform="translate(6px, 6px) scale(0.018)"
            pathHistoryClearCap.setAttribute('fill', '#000');
            pathHistoryClearCap.style.opacity='0.5'
            pathHistoryClearCap.style.transition='0.25s'
            pathHistoryClearCap.id='pathHistoryClearCap'
            historyClear.appendChild(pathHistoryClearCap);
            pathHistoryClearBox.setAttribute('d','M838.656 273.28H182.08c-9.92 0-19.84 2.56-24.832 9.984a32.192 32.192 0 0 0-9.984 25.024v605.184c0 59.968 49.792 110.016 109.44 110.016h509.824a110.72 110.72 0 0 0 109.44-110.08V308.416c0-19.968-17.408-35.008-37.312-35.008z m-422.784 582.656a38.4 38.4 0 0 1-37.312 37.504 38.4 38.4 0 0 1-37.312-37.504V460.928a38.4 38.4 0 0 1 37.312-37.568 38.4 38.4 0 0 1 37.312 37.568v395.072z m263.68 0a38.4 38.4 0 0 1-37.376 37.504 38.4 38.4 0 0 1-37.312-37.504V460.928a38.4 38.4 0 0 1 37.312-37.568 38.4 38.4 0 0 1 37.312 37.568v395.072z')
            pathHistoryClearBox.style.transform="translate(6px, 6px) scale(0.018)"
            pathHistoryClearBox.setAttribute('fill', '#000');
            pathHistoryClearBox.style.opacity='0.5'
            pathHistoryClearBox.id='pathHistoryClearBox'
            historyClear.appendChild(pathHistoryClearBox);
            historyClear.id = 'history_clear';
            historyBigTitle.appendChild(historyClear);
            historyClear.onmouseenter=function(){
                pathHistoryClearCap.style.transform='translate(6px, 2px) scale(0.018)'
            }
            historyClear.onmouseleave=function(){
                pathHistoryClearCap.style.transform='translate(6px, 6px) scale(0.018)'
            }
            historyClear.onclick=function(){
                var clear=confirm('是否要清空全部历史记录')
                if(clear==true){
                    GM_setValue('pixiv_history','')
                    document.getElementById('history_back').innerHTML=''
                    addHistory(0,0)
                }
            }

            //隐藏按钮
            var historyVisible = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            var pathHistoryVisiblePupil = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            var pathHistoryVisibleBrow = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            var pathHistoryVisibleAbandon = document.createElementNS("http://www.w3.org/2000/svg", 'path');

            historyVisible.setAttribute("aria-hidden","true");
            historyVisible.setAttribute('viewbox', '0 0 30 30');
            historyVisible.setAttribute('width', '30px');
            historyVisible.setAttribute('height', '30px');
            pathHistoryVisiblePupil.setAttribute('d','M512 390.961296 c-66.772776 0-121.038704 54.265928-121.038704 121.038704s54.265928 121.038704 121.038704 121.038704 121.038704-54.265928 121.038704-121.038704S578.772776 390.961296 512 390.961296z')
            pathHistoryVisiblePupil.style.transform="translate(2px, 2px) scale(0.025)"
            pathHistoryVisiblePupil.setAttribute('fill', '#000');
            pathHistoryVisiblePupil.style.opacity='0.5'
            pathHistoryVisiblePupil.style.transition='0.15s'
            pathHistoryVisiblePupil.id='path_historyVisiblePupil'
            historyVisible.appendChild(pathHistoryVisiblePupil);

            pathHistoryVisibleBrow.setAttribute('d','M512 209.403241c-201.731514 0-374.009206 125.476783-443.808922 302.596759 69.798692 177.119977 242.077408 302.596759 443.808922 302.596759 201.933105 0 374.010229-125.476783 443.808922-302.596759C886.009206 334.880023 713.933105 209.403241 512 209.403241zM512 713.731514c-111.355157 0-201.731514-90.375334-201.731514-201.731514s90.375334-201.731514 201.731514-201.731514 201.731514 90.375334 201.731514 201.731514S623.355157 713.731514 512 713.731514z')
            pathHistoryVisibleBrow.style.transform="translate(2px, 2px) scale(0.025)"
            pathHistoryVisibleBrow.setAttribute('fill', '#000');
            pathHistoryVisibleBrow.style.opacity='0.5'
            pathHistoryVisibleBrow.id='path_historyVisibleBrow'
            historyVisible.appendChild(pathHistoryVisibleBrow);
            historyVisible.id = 'history_visible';
            historyBigTitle.appendChild(historyVisible);

            pathHistoryVisibleAbandon.setAttribute('d','M194.078118 43.489882a60.235294 60.235294 0 0 1 85.172706 0l851.847529 851.84753a60.235294 60.235294 0 0 1-85.172706 85.172706L194.078118 128.662588a60.235294 60.235294 0 0 1 0-85.172706z')
            pathHistoryVisibleAbandon.style.transform="rotate(90deg) translate(1px, -25px) scale(0.02)"
            pathHistoryVisibleAbandon.setAttribute('fill', '#000');
            pathHistoryVisibleAbandon.style.opacity='0.5'
            if(getCookie('history_R18')==0){
                pathHistoryVisibleAbandon.style.display='block'
            }
            if(getCookie('history_R18')==1){
                pathHistoryVisibleAbandon.style.display='none'
            }
            pathHistoryVisibleAbandon.id='path_historyVisibleBrow'
            historyVisible.appendChild(pathHistoryVisibleAbandon);

            historyVisible.onmouseenter=function(){
                pathHistoryVisiblePupil.style.transform='translate(4.5px, 4.5px) scale(0.02)'
                setTimeout(function () {
                    pathHistoryVisiblePupil.style.transform='translate(3px, 4.5px) scale(0.02)'
                }, 150);
                setTimeout(function () {
                    pathHistoryVisiblePupil.style.transform='translate(6px, 4.5px) scale(0.02)'
                }, 300);
                setTimeout(function () {
                    pathHistoryVisiblePupil.style.transform='translate(4.5px, 4.5px) scale(0.02)'
                }, 450);
            }
            historyVisible.onmouseleave=function(){
                pathHistoryVisiblePupil.style.transform='translate(2px, 2px) scale(0.025)'
            }
            historyVisible.onclick=function(){
                if(pathHistoryVisibleAbandon.style.display=='none'){
                    pathHistoryVisibleAbandon.style.display='block'
                    setCookie('history_R18',0)//隐藏R-18
                }
                else if(pathHistoryVisibleAbandon.style.display=='block'){
                    pathHistoryVisibleAbandon.style.display='none'
                    setCookie('history_R18',1)//显示R-18
                }
                if(document.getElementById('history_pageNum')!=null){
                    document.getElementById('history_pageNum').innerText=1
                    document.getElementById('history_back').innerHTML=''
                    addHistory(0,0)
                }
            }

            var historyPageBack=document.createElement('a')
            historyPageBack.id='history_pageBack'
            historyAll.appendChild(historyPageBack)


            var beforeBig = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            var pathBeforeBig = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            beforeBig.setAttribute("aria-hidden","true");
            beforeBig.setAttribute('viewbox', '0 0 24 24');
            beforeBig.setAttribute('width', '16px');
            beforeBig.setAttribute('height', '16px');
            pathBeforeBig.setAttribute('d','M602.496 512l338.752 338.752-90.496 90.496L421.504 512l429.248-429.248 90.496 90.496L602.496 512z m-320 0l338.752 338.752-90.496 90.496L101.504 512l429.248-429.248 90.496 90.496L282.496 512z')
            pathBeforeBig.style.transform="scale(0.018)"
            pathBeforeBig.setAttribute('fill', '#000');
            pathBeforeBig.style.opacity='0.5'
            pathBeforeBig.style.transition='0.15s'
            pathBeforeBig.id='pathBeforeBig'
            beforeBig.appendChild(pathBeforeBig);
            beforeBig.id = 'beforeBig';
            beforeBig.setAttribute('class', 'history_page');
            historyPageBack.appendChild(beforeBig);
            beforeBig.onmouseenter=function(){
                pathBeforeBig.style.opacity='0.8'
            }
            beforeBig.onmouseleave=function(){
                pathBeforeBig.style.opacity='0.5'
            }

            var beforeSmall = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            var pathBeforeSmall = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            beforeSmall.setAttribute("aria-hidden","true");
            beforeSmall.setAttribute('viewbox', '0 0 24 24');
            beforeSmall.setAttribute('width', '16px');
            beforeSmall.setAttribute('height', '16px');
            pathBeforeSmall.setAttribute('d','M602.496 512l338.752 338.752-90.496 90.496L421.504 512l429.248-429.248 90.496 90.496L602.496 512z m-320 0z')
            pathBeforeSmall.style.transform="scale(0.018)"
            pathBeforeSmall.setAttribute('fill', '#000');
            pathBeforeSmall.style.opacity='0.5'
            pathBeforeSmall.style.transition='0.15s'
            pathBeforeSmall.id='pathBeforeSmall'
            beforeSmall.appendChild(pathBeforeSmall);
            beforeSmall.id = 'beforeSmall';
            beforeSmall.setAttribute('class', 'history_page');
            beforeSmall.style.paddingRight='20px'
            historyPageBack.appendChild(beforeSmall);
            beforeSmall.onmouseenter=function(){
                pathBeforeSmall.style.opacity='0.8'
            }
            beforeSmall.onmouseleave=function(){
                pathBeforeSmall.style.opacity='0.5'
            }

            var pageNum=document.createElement('text')
            pageNum.id='history_pageNum'
            pageNum.innerText='1'
            historyPageBack.appendChild(pageNum)

            var afterSmall = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            var pathAfterSmall = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            afterSmall.setAttribute("aria-hidden","true");
            afterSmall.setAttribute('viewbox', '0 0 24 24');
            afterSmall.setAttribute('width', '16px');
            afterSmall.setAttribute('height', '16px');
            pathAfterSmall.setAttribute('d','M421.504 512l-338.752-338.752 90.496-90.496L602.496 512l-429.248 429.248-90.496-90.496L421.504 512z m320 0')
            pathAfterSmall.style.transform="scale(0.018)"
            pathAfterSmall.setAttribute('fill', '#000');
            pathAfterSmall.style.opacity='0.5'
            pathAfterSmall.style.transition='0.15s'
            pathAfterSmall.id='pathAfterSmall'
            afterSmall.appendChild(pathAfterSmall);
            afterSmall.id = 'afterSmall';
            afterSmall.setAttribute('class', 'history_page');
            afterSmall.style.paddingLeft='20px'
            historyPageBack.appendChild(afterSmall);
            afterSmall.onmouseenter=function(){
                pathAfterSmall.style.opacity='0.8'
            }
            afterSmall.onmouseleave=function(){
                pathAfterSmall.style.opacity='0.5'
            }

            var afterBig = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            var pathAfterBig = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            afterBig.setAttribute("aria-hidden","true");
            afterBig.setAttribute('viewbox', '0 0 24 24');
            afterBig.setAttribute('width', '16px');
            afterBig.setAttribute('height', '16px');
            pathAfterBig.setAttribute('d','M421.504 512l-338.752-338.752 90.496-90.496L602.496 512l-429.248 429.248-90.496-90.496L421.504 512z m320 0l-338.752-338.752 90.496-90.496L922.496 512l-429.248 429.248-90.496-90.496L741.504 512z')
            pathAfterBig.style.transform="scale(0.018)"
            pathAfterBig.setAttribute('fill', '#000');
            pathAfterBig.style.opacity='0.5'
            pathAfterBig.style.transition='0.15s'
            pathAfterBig.id='pathAfterBig'
            afterBig.appendChild(pathAfterBig);
            afterBig.id = 'afterBig';
            afterBig.setAttribute('class', 'history_page');
            historyPageBack.appendChild(afterBig);
            afterBig.onmouseenter=function(){
                pathAfterBig.style.opacity='0.8'
            }
            afterBig.onmouseleave=function(){
                pathAfterBig.style.opacity='0.5'
            }

            var historyBack=document.createElement('div')
            historyBack.id='history_back'
            historyAll.appendChild(historyBack)
            addHistory(0,0)
            setTimeout(function () {
                historyAll.style.transform='scale(1)'
            }, 200);
            //————————————————————————————————————————————————————————
        }
        else{
            document.getElementById('history_all').style.transform='scale(0.01)'
            setTimeout(function () {
                document.getElementById('history_all').remove()
            }, 300);
        }

    })

    //分别绑定翻页事件
    window.addEventListener('click',function(event){
        if(document.getElementById('history_pageNum')!=null){
            if(all_historyList%15!=0){
                var max_all_historyList=parseInt(all_historyList/15)+1
                }
            else{
                max_all_historyList=all_historyList/15
            }
            if(event.target.id=='beforeBig'||event.target.id=='pathBeforeBig'){
                document.getElementById('history_back').innerHTML=''
                document.getElementById('history_pageNum').innerText='1'
                addHistory(0,0)
                console.log('beforeBig')
            }
            else if((event.target.id=='beforeSmall'||event.target.id=='pathBeforeSmall')&&document.getElementById('history_pageNum').innerText>=2){
                document.getElementById('history_back').innerHTML=''
                document.getElementById('history_pageNum').innerText=parseInt(document.getElementById('history_pageNum').innerText)-1
                addHistory((parseInt(document.getElementById('history_pageNum').innerText)-1)*15,0)
                console.log('beforeSmall')
            }
            else if((event.target.id=='afterSmall'||event.target.id=='pathAfterSmall')&&document.getElementById('history_pageNum').innerText<max_all_historyList){
                document.getElementById('history_back').innerHTML=''
                document.getElementById('history_pageNum').innerText=parseInt(document.getElementById('history_pageNum').innerText)+1
                addHistory((parseInt(document.getElementById('history_pageNum').innerText)-1)*15,0)
                console.log('afterSmall')
            }
            else if(event.target.id=='afterBig'||event.target.id=='pathAfterBig'){
                document.getElementById('history_back').innerHTML=''
                document.getElementById('history_pageNum').innerText=max_all_historyList
                addHistory((parseInt(document.getElementById('history_pageNum').innerText)-1)*15,0)
                console.log('afterBig')
            }
        }
        if(event.target.id=='history_pageNum'){
            var number=document.getElementById('history_pageNum').innerText
            document.getElementById('history_pageNum').outerHTML='<input id="history_pageInput" style="top: 500px;z-index: 1;width: 22px;">'
            document.getElementById('history_pageInput').value=number
            document.getElementById('history_pageInput').focus()
            document.getElementById('history_pageInput').onblur=function(){
                document.getElementById('history_back').innerHTML=''
                document.getElementById('history_pageInput').outerHTML='<text id="history_pageNum">'+document.getElementById('history_pageInput').value+'</text>'
                if(parseInt(document.getElementById('history_pageNum').innerText)>max_all_historyList){
                    document.getElementById('history_pageNum').innerText=max_all_historyList
                }
                else if(parseInt(document.getElementById('history_pageNum').innerText)<1){
                    document.getElementById('history_pageNum').innerText=1
                }
                addHistory((parseInt(document.getElementById('history_pageNum').innerText)-1)*15,0)
            }
            document.getElementById('history_pageInput').onkeydown=function(e){
                if(e.keyCode==13){
                    document.getElementById('history_pageInput').blur()
                }
            }
        }
    })


    /*function details(arr){
        // var allBookmark=[]
        var count=0
        var load_count=0
        var load_count_div=document.createElement('div')
        load_count_div.id='load_count_div'
        document.body.appendChild(load_count_div)
        var load_count_text=document.createElement('div')
        load_count_text.id='load_count_text'
        load_count_div.appendChild(load_count_text)
        var details_interval_count=-1
        var details_interval=setInterval(function(){
            details_interval_count++
            if(details_interval_count>arr.length){
                clearInterval(details_interval)
            }

            GM_xmlhttpRequest({
                method: "GET",
                url: "https://www.pixiv.net/touch/ajax/illust/details?illust_id="+arr[details_interval_count],
                headers:{
                    "User-Agent": navigator.userAgent,
                    "x-user-id": 10000000,
                },
                onload: function(res) {
                    if(res.status === 200){
                        load_count++
                        load_count_text.innerText=load_count+'/'+arr.length
                        if(load_count==arr.length){
                            load_count_div.style.opacity=0
                            setTimeout(function(){
                                load_count_div.remove()
                            },500)
                        }
                        //console.log('成功')
                        var p=res.responseText
                        var json=JSON.parse(p.replace(/\\(?!(\/|u))/g,'\\'))
                        // console.log(json)
                        //收藏数，作品id，作品名称，作品预览图，作品数量，作品类型，R_18，是否收藏,作者id，作者名称;
                        //作品名称“title”
                        //作品预览图“url_s”
                        //作者id“user_id”
                        //作者名称“title”
                        var bookmarkNum=json.body.illust_details.bookmark_user_total
                        var illustID=json.body.illust_details.id
                        var illustName=json.body.illust_details.alt
                        var illustImg=json.body.illust_details.url_s.replace('https://i.pximg.net/c/128x128','https://i.pximg.net/c/250x250_80_a2')
                        var illustNumber=json.body.illust_details.page_count
                        var illustType=json.body.illust_details.type
                        var R_18=false
                        var illustRestrict=json.body.illust_details.bookmark_restrict//0-普通收藏；1-隐私收藏；2-未收藏
                        if(illustRestrict==null){
                            illustRestrict=2
                        }
                        if(JSON.stringify(json.body.illust_details.tags).match(/(R18|R\-18)/)){
                            R_18=true
                        }
                        var authorID=json.body.illust_details.author_details.user_id
                        var authorName=json.body.illust_details.author_details.user_name

                        // var bookmarkNum=p.match(/(?<=bookmark_user_total\"\:)\d+(?=\,)/)
                        // var bookmarkID=p.match(/(?<=\"id\"\:\")\d+(?=\")/)
                        if(bookmarkNum.length!=0&&illustID.length!=0){
                            if(allBookmark[bookmarkNum]==null){
                                allBookmark[bookmarkNum]=bookmarkNum+','+illustID+','+illustName+','+illustImg+','+illustNumber+','+illustType+','+R_18+','+illustRestrict+','+authorID+','+authorName
                            }
                            else if(allBookmark[bookmarkNum]!=null&&allBookmark[bookmarkNum].match(illustID)==null){
                                allBookmark[bookmarkNum]=allBookmark[bookmarkNum]+';'+illustID+','+illustName+','+illustImg+','+illustNumber+','+illustType+','+R_18+','+illustRestrict+','+authorID+','+authorName
                            }
                        }
                    }
                    count++
                    if(count==arr.length){
                        allBookmark=allBookmark.filter(function(){return true})
                        console.log(allBookmark)
                        // console.log(aaa)


                        var sort_ul=document.createElement('ul')
                        sort_ul.id='sort_ul'
                        sort_ul.className='sort_ul'
                        var sort_ul_out=document.getElementsByClassName('sc-l7cibp-0 juyBTC')[0]//搜索界面“预览图”框架的ul元素的父元素
                        sort_ul_out.appendChild(sort_ul)
                        if(document.getElementsByClassName('sc-l7cibp-3 gCRmsl')!=null){
                            sort_ul_out.insertBefore(sort_ul,document.getElementsByClassName('sc-l7cibp-3 gCRmsl')[0])
                        }
                        document.getElementsByClassName('sc-l7cibp-1 krFoBL')[0].style.display='none'//原本搜索页ul元素
                        document.getElementsByClassName('sc-l7cibp-3 gCRmsl')[0].style.display='none'//原本页面页码部分（换页）

                        var sort_more_out=document.createElement('div')
                        sort_more_out.id='sort_more_out'
                        sort_ul_out.appendChild(sort_more_out)

                        var sort_more_background=document.createElement('div')
                        sort_more_background.id='sort_more_background'
                        sort_more_out.appendChild(sort_more_background)

                        var sort_more_text=document.createElement('div')
                        sort_more_text.id='sort_more_text'
                        sort_more_text.innerText='查看更多'
                        sort_more_background.appendChild(sort_more_text)

                        //收藏数，作品id，作品名称，作品预览图，作品数量，作品类型，R_18，是否收藏，作者id，作者名称;
                        var allBookmark_split=[]
                        for(var j=0;j<allBookmark.length;j++){
                            for(var k=0;k<allBookmark[j].split(';').length;k++){
                                if(k==0){
                                    allBookmark_split.push(allBookmark[j].split(';')[0])
                                }
                                else{
                                    allBookmark_split.push(allBookmark[j].split(';')[0].split(',')[0]+','+allBookmark[j].split(';')[k])
                                }
                            }
                        }
                        console.log(allBookmark_split)
                        var sort_first_length=allBookmark_split.length-60
                        if(sort_first_length<0){
                            sort_first_length=0
                        }
                        for(var i=allBookmark_split.length-1;i>=sort_first_length;i--){
                            var sort_info=allBookmark_split[i].split(',')
                            sort_addillust(sort_info[0],sort_info[1],sort_info[2],sort_info[3],sort_info[4],sort_info[5],sort_info[6],sort_info[7],sort_info[8],sort_info[9])
                        }

                        sort_more_background.onclick=function(){
                            var sort_less_length=document.getElementsByClassName('sort_li').length
                            var allBookmark_length=allBookmark_split.length
                            console.log(allBookmark_split)
                            if(sort_less_length<allBookmark_length){
                                var length=60
                                if(allBookmark_length-sort_less_length<60){
                                    length=allBookmark_length-sort_less_length
                                }
                                for(var h=length-1;h>0;h--){
                                    var sort_info=allBookmark_split[allBookmark_length-sort_less_length-1-(length-1-h)].split(',')
                                    sort_addillust(sort_info[0],sort_info[1],sort_info[2],sort_info[3],sort_info[4],sort_info[5],sort_info[6],sort_info[7],sort_info[8],sort_info[9])
                                }
                            }
                        }
                    }
                    // if(p.match(/R-18/)!=null){
                    //     aaa++
                    // }
                }
            })
        },1)
        }*/



    function sort_addillust(bookmark,illustID,illustName,illustImg,illustNumber,illustType,R_18,illustRestrict,authorID,authorName){
        //收藏数,作品id,作品名称,作品预览图,作者id,作者名称;
        //收藏数，作品id，作品名称，作品预览图，作品数量，作品类型，R_18，是否收藏，作者id，作者名称;
        var sort_ul=document.getElementById('sort_ul')
        var sort_li=document.createElement('li')
        sort_li.className='sort_li'
        sort_ul.appendChild(sort_li)

        var sort_a=document.createElement('a')
        sort_a.className='sort_a'
        sort_a.href='https://www.pixiv.net/artworks/'+illustID
        sort_li.appendChild(sort_a)

        var sort_up=document.createElement('div')
        sort_up.className='sort_up'
        sort_a.appendChild(sort_up)

        var sort_page=document.createElement('div')
        sort_page.className='sort_page'
        sort_up.appendChild(sort_page)

        if(illustNumber>1){
            sort_page.style='width: 20px;height: 18px;display: flex;justify-content: center;flex: 0 0 auto;color: rgb(255, 255, 255);font-weight: bold;padding: 0px 6px;background: rgba(0, 0, 0, 0.32);border-radius: 10px;font-size: 10px;transform: translate(-5px, 5px);'
            var sort_page_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            var sort_page_path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            sort_page_svg.setAttribute('viewbox', '0 0 24 24');
            sort_page_svg.setAttribute('size', '9');
            sort_page_svg.setAttribute=('class', 'sort_page_svg');
            sort_page_path.setAttribute('d','M8,3 C8.55228475,3 9,3.44771525 9,4 L9,9 C9,9.55228475 8.55228475,10 8,10 L3,10 C2.44771525,10 2,9.55228475 2,9 L6,9 C7.1045695,9 8,8.1045695 8,7 L8,3 Z M1,1 L6,1 C6.55228475,1 7,1.44771525 7,2 L7,7 C7,7.55228475 6.55228475,8 6,8 L1,8 C0.44771525,8 0,7.55228475 0,7 L0,2 C0,1.44771525 0.44771525,1 1,1 Z')
            sort_page_path.setAttribute('fill','white')
            sort_page_path.id='sort_page_path'
            sort_page_svg.appendChild(sort_page_path)
            sort_page.appendChild(sort_page_svg)
            var sort_page_number=document.createElement('text')
            sort_page_number.className='sort_page_number'
            sort_page_number.innerText=illustNumber
            sort_page.style.width=20+(illustNumber.length-1)*7+'px'
            sort_page.appendChild(sort_page_number)
        }

        if(R_18=='true'){
            var sort_R18=document.createElement('div')
            sort_R18.className='sort_R18'
            sort_R18.innerText='R-18'
            sort_R18.style.transform='translate(5px, 5px)'
            sort_up.appendChild(sort_R18)
        }

        var sort_img=document.createElement('img')
        sort_img.className='sort_img'
        sort_img.src=illustImg
        sort_a.appendChild(sort_img)

        if(illustType=='2'){
            var sort_gif = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            sort_gif.setAttribute('viewbox', '0 0 24 24');
            sort_gif.setAttribute('class','sort_gif');
            sort_gif.innerHTML=`<circle cx="12" cy="12" r="10" class="sort_gif_circle"></circle><path class='sort_gif_path' d="M9,8.74841664 L9,15.2515834 C9,15.8038681 9.44771525,16.2515834 10,16.2515834C10.1782928,16.2515834 10.3533435,16.2039156 10.5070201,16.1135176 L16.0347118,12.8619342C16.510745,12.5819147 16.6696454,11.969013 16.3896259,11.4929799C16.3034179,11.3464262 16.1812655,11.2242738 16.0347118,11.1380658 L10.5070201,7.88648243C10.030987,7.60646294 9.41808527,7.76536339 9.13806578,8.24139652C9.04766776,8.39507316 9,8.57012386 9,8.74841664 Z" class="sc-192k5ld-2 jwyUTl"></path>`
            sort_a.appendChild(sort_gif)
        }

        var sort_text_div=document.createElement('div')
        sort_text_div.className='sort_text_div'
        sort_li.appendChild(sort_text_div)

        var sort_img_name=document.createElement('a')
        sort_img_name.className='sort_img_name'
        sort_img_name.innerText=illustName
        sort_img_name.href='https://www.pixiv.net/artworks/'+illustID
        sort_text_div.appendChild(sort_img_name)

        var br=document.createElement('br')
        sort_text_div.appendChild(br)

        var sort_author_name=document.createElement('a')
        sort_author_name.className='sort_author_name'
        sort_author_name.innerText=authorName
        sort_author_name.href='https://www.pixiv.net/users/'+authorID
        sort_text_div.appendChild(sort_author_name)

        var sort_down=document.createElement('div')
        sort_down.className='sort_down'
        sort_a.appendChild(sort_down)

        var sort_bookmark=document.createElement('div')
        sort_bookmark.className='sort_bookmark'
        sort_bookmark.innerText=bookmark
        sort_down.appendChild(sort_bookmark)

        var divdivdiv=document.createElement('div')
        divdivdiv.className='divdivdiv'
        divdivdiv.style.width='0px'
        divdivdiv.style.height='0px'
        sort_li.appendChild(divdivdiv)
        var sort_love_button=document.createElement('button')
        sort_love_button.className='sort_love_button'
        divdivdiv.appendChild(sort_love_button)
        var sort_love_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        var sort_love_path_1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        var sort_love_path_2 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        sort_love_svg.setAttribute('viewbox', '0 0 24 24');
        sort_love_svg.setAttribute('size', '9');
        sort_love_svg.setAttribute=('class', 'sort_love_svg');
        sort_love_svg.style.width='30px'
        sort_love_svg.style.height='30px'
        sort_love_path_1.setAttribute('d','M21,5.5 C24.8659932,5.5 28,8.63400675 28,12.5 C28,18.2694439 24.2975093,23.1517313 17.2206059,27.1100183 C16.4622493,27.5342993 15.5379984,27.5343235 14.779626,27.110148 C7.70250208,23.1517462 4,18.2694529 4,12.5 C4,8.63400691 7.13400681,5.5 11,5.5 C12.829814,5.5 14.6210123,6.4144028 16,7.8282366 C17.3789877,6.4144028 19.170186,5.5 21,5.5 Z')
        sort_love_path_2.setAttribute('d','M16,11.3317089 C15.0857201,9.28334665 13.0491506,7.5 11,7.5 C8.23857625,7.5 6,9.73857647 6,12.5 C6,17.4386065 9.2519779,21.7268174 15.7559337,25.3646328 C15.9076021,25.4494645 16.092439,25.4494644 16.2441073,25.3646326 C22.7480325,21.7268037 26,17.4385986 26,12.5 C26,9.73857625 23.7614237,7.5 21,7.5 C18.9508494,7.5 16.9142799,9.28334665 16,11.3317089 Z')
        sort_love_path_1.setAttribute('fill','black')
        sort_love_path_2.setAttribute('fill','white')
        sort_love_svg.appendChild(sort_love_path_1)
        sort_love_svg.appendChild(sort_love_path_2)
        if(illustRestrict==0){
            sort_love_path_1.setAttribute('fill','red')
            sort_love_path_2.setAttribute('fill','red')
        }
        else if(illustRestrict==1){
            sort_love_path_1.setAttribute('fill','red')
            sort_love_path_2.setAttribute('fill','red')

            var sort_love_path_3 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            var sort_love_path_4 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            sort_love_path_3.setAttribute('d','M29.9796 20.5234C31.1865 21.2121 32 22.511 32 24V28 C32 30.2091 30.2091 32 28 32H21C18.7909 32 17 30.2091 17 28V24C17 22.511 17.8135 21.2121 19.0204 20.5234 C19.2619 17.709 21.623 15.5 24.5 15.5C27.377 15.5 29.7381 17.709 29.9796 20.5234Z')
            sort_love_path_4.setAttribute('d','M28 22C29.1046 22 30 22.8954 30 24V28C30 29.1046 29.1046 30 28 30H21 C19.8954 30 19 29.1046 19 28V24C19 22.8954 19.8954 22 21 22V21C21 19.067 22.567 17.5 24.5 17.5 C26.433 17.5 28 19.067 28 21V22ZM23 21C23 20.1716 23.6716 19.5 24.5 19.5C25.3284 19.5 26 20.1716 26 21V22H23 V21Z')
            sort_love_path_3.setAttribute('fill','white')
            sort_love_path_4.setAttribute('fill','black')
            sort_love_svg.appendChild(sort_love_path_3)
            sort_love_svg.appendChild(sort_love_path_4)
        }
        sort_love_button.appendChild(sort_love_svg)
        sort_love_button.onclick=function(event){
            // console.log('a')
            isProhibit=0//0为未屏蔽，1为屏蔽
            var cookie_tag_safe=[]
            var id=event.target.closest('.divdivdiv').previousSibling.previousSibling.href.match(/(?<=artworks\/)\d+/)[0]
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://www.pixiv.net/artworks/"+id,
                headers:{
                    "User-Agent": navigator.userAgent,
                },
                onload: function(res) {
                    if(res.status === 200){
                        //console.log('成功')
                        var p=res.responseText
                        var final=p.match(/(?<="tag":").*?(?=")/g).toString().split(',')
                        if(GM_getValue('tagSaveSafe')==''){
                            var tag_cookie=tagSaveSafe.split('*')
                            }
                        else{
                            tag_cookie=GM_getValue('tagSaveSafe').split('*')
                        }
                        if(GM_getValue('tagProhibit')==''){
                            var tag_Prohibit=''
                            }
                        else{
                            tag_Prohibit=GM_getValue('tagProhibit')
                        }
                        cookie_tag_safe[0]='全部'
                        var count=1
                        if(getCookie('tagCookieSetting')==1){
                            for(var i=0;i<final.length;i++){
                                for(var j=0;j<tag_cookie.length;j++){
                                    if(tag_Prohibit.match(final[i])!=null){
                                        isProhibit=final[i];
                                        break;
                                    }
                                    if(tag_cookie[j].match(final[i])!=null){
                                        cookie_tag_safe[count]=tag_cookie[j].split(',')[0]
                                        count++
                                    }
                                }
                                if(isProhibit==1){
                                    break;
                                }
                            }
                        }
                        if(isProhibit==0){
                            fetch("https://www.pixiv.net/ajax/illusts/bookmarks/add",{
                                headers: {
                                    "accept": "application/json",
                                    "content-type": "application/json; charset=utf-8",
                                    "x-csrf-token": getCookie('token')
                                },
                                "referrer": "https://www.pixiv.net",
                                'method':'POST',
                                'body':JSON.stringify({illust_id: id, restrict: 0, comment: "", tags: cookie_tag_safe})//不确定restrict全年龄时的数值
                            }).then(res=>{
                                loveTagView(cookie_tag_safe)
                                var button=event.target.closest('button')
                                if(button!=null&&button.getElementsByClassName('sort_love_path_1')!=null&&button.getElementsByClassName('sort_love_path_2')!=null){
                                    // button.getElementsByClassName('sort_love_path_1')[0].style.fill='red'
                                    // button.getElementsByClassName('sort_love_path_2')[0].style.fill='red'
                                    button.childNodes[0].childNodes[0].style.fill='red'
                                    button.childNodes[0].childNodes[1].style.fill='red'
                                }
                            })
                        }
                    }
                }
            })
        }
        sort_love_button.oncontextmenu=function(event){
            // console.log('a')
            var cookie_tag=[]
            var id=event.target.closest('.divdivdiv').previousSibling.previousSibling.href.match(/(?<=artworks\/)\d+/)[0]
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://www.pixiv.net/artworks/"+id,
                headers:{
                    "User-Agent": navigator.userAgent,
                },
                onload: function(res) {
                    if(res.status === 200){
                        //console.log('成功')
                        isProhibit=0//0为未屏蔽，1为屏蔽
                        var p=res.responseText
                        var final=p.match(/(?<="tag":").*?(?=")/g).toString().split(',')
                        // console.log(final)
                        if(GM_getValue('tagSave')==''){
                            var tag_cookie=tagSave.split('*')
                            }
                        else{
                            tag_cookie=GM_getValue('tagSave').split('*')
                        }
                        if(GM_getValue('tagProhibit')==''){
                            var tag_Prohibit=''
                            }
                        else{
                            tag_Prohibit=GM_getValue('tagProhibit')
                        }
                        cookie_tag[0]='全部'
                        var count=1
                        if(getCookie('tagCookieSetting')==1){
                            for(var i=0;i<final.length;i++){
                                for(var j=0;j<tag_cookie.length;j++){
                                    if(tag_Prohibit.match(final[i])!=null){
                                        isProhibit=final[i];
                                        break;
                                    }
                                    if(tag_cookie[j].match(final[i])!=null){
                                        cookie_tag[count]=tag_cookie[j].split(',')[0]
                                        count++
                                    }
                                }
                                if(isProhibit==1){
                                    break;
                                }
                            }
                        }
                        if(isProhibit==0){
                            fetch("https://www.pixiv.net/ajax/illusts/bookmarks/add",{
                                headers: {
                                    "accept": "application/json",
                                    "content-type": "application/json; charset=utf-8",
                                    "x-csrf-token": getCookie('token')
                                },
                                "referrer": "https://www.pixiv.net",
                                'method':'POST',
                                'body':JSON.stringify({illust_id: id, restrict: 1, comment: "", tags: cookie_tag})
                            }).then(res=>{
                                loveTagView(cookie_tag)
                                var button=event.target.closest('button')
                                if(button!=null&&button.getElementsByClassName('sort_love_path_1')!=null&&button.getElementsByClassName('sort_love_path_2')!=null){
                                    // button.getElementsByClassName('sort_love_path_1')[0].style.fill='red'
                                    // button.getElementsByClassName('sort_love_path_2')[0].style.fill='red'
                                    button.childNodes[0].childNodes[0].style.fill='red'
                                    button.childNodes[0].childNodes[1].style.fill='red'
                                    var sort_love_path_3 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                                    var sort_love_path_4 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                                    sort_love_path_3.setAttribute('d','M29.9796 20.5234C31.1865 21.2121 32 22.511 32 24V28 C32 30.2091 30.2091 32 28 32H21C18.7909 32 17 30.2091 17 28V24C17 22.511 17.8135 21.2121 19.0204 20.5234 C19.2619 17.709 21.623 15.5 24.5 15.5C27.377 15.5 29.7381 17.709 29.9796 20.5234Z')
                                    sort_love_path_4.setAttribute('d','M28 22C29.1046 22 30 22.8954 30 24V28C30 29.1046 29.1046 30 28 30H21 C19.8954 30 19 29.1046 19 28V24C19 22.8954 19.8954 22 21 22V21C21 19.067 22.567 17.5 24.5 17.5 C26.433 17.5 28 19.067 28 21V22ZM23 21C23 20.1716 23.6716 19.5 24.5 19.5C25.3284 19.5 26 20.1716 26 21V22H23 V21Z')
                                    sort_love_path_3.setAttribute('fill','white')
                                    sort_love_path_4.setAttribute('fill','black')
                                    button.childNodes[0].appendChild(sort_love_path_3)
                                    button.childNodes[0].appendChild(sort_love_path_4)
                                }
                            })
                        }
                    }
                }
            })
            event.preventDefault()
        }

        //！！！var sort_love=document.createElement('svg')
    }




    function single_sort(){
        var sort_ul=document.createElement('ul')
        sort_ul.id='sort_ul'
        sort_ul.className='sort_ul'
        var sort_ul_out
        var sort_interval_count=0
        var sort_ul_out_interval=setInterval(function(){
            console.log('aaaaaa')
            sort_ul_out=document.getElementsByClassName('sc-l7cibp-0 juyBTC')[0]//搜索界面“预览图”框架的ul元素的父元素
            if(sort_ul_out!=null){
                if(document.getElementsByClassName('sc-l7cibp-3 gCRmsl')!=null){
                    sort_ul_out.insertBefore(sort_ul,document.getElementsByClassName('sc-l7cibp-3 gCRmsl')[0])
                }
                document.getElementsByClassName('sc-l7cibp-1 krFoBL')[0].style.display='none'

                document.getElementsByClassName('sc-xhhh7v-0 kYtoqc')[0].addEventListener('click',function(e){
                    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
                    if(document.getElementById('sort_ul')!=null){
                        document.getElementById('sort_ul').innerHTML=""
                        setTimeout(function(){
                            single_sort()
                        },2000)
                    }
                })

                var keyword=window.location.href.match(/(?<=tags\/).*?(?=\/)/)[0]
                //var mode='all'
                var order='date_desc'
                var page=1
                var s_mode='exact_match_for_tags'
                //if(window.location.href.match(/(?<=mode=)(safe|all|r18)/)!=null){
                //mode=window.location.href.match(/(?<=mode=)(safe|all|r18)/)[0]
                //}
                if(window.location.href.match(/(?<=order=)(date|date_d)/)!=null){
                    order=window.location.href.match(/(?<=order=)(date|date_d)/)[0]
                }
                if(window.location.href.match(/(?<=p=)\d+/)!=null){
                    page=parseInt(window.location.href.match(/(?<=p=)\d+/)[0])
                }
                if(window.location.href.match(/(?<=s_mode=)s_tag/)!=null){
                    s_mode='partial_match_for_tags'
                }
                var one_sort_url='https://api.moedog.org/pixiv/v2/?type=search&word='+keyword+'&order='+order+'&mode='+s_mode+'&page='
                //console.log(one_sort_url)
                //https://api.moedog.org/pixiv/v2/?type=search&word=%E9%A3%8E%E6%99%AF&order=date_desc&page=1
                GM_xmlhttpRequest({
                    method: "GET",
                    url: one_sort_url+(page*2-1).toString(),
                    headers:{
                        "User-Agent": navigator.userAgent,
                    },
                    onload: function(res) {
                        if(res.status === 200){
                            //console.log('成功')
                            var p1=res.responseText
                            p1=JSON.parse(p1.replace('\\/','/'))
                            console.log(p1)
                            var one_fetch_result=[]
                            var one_count=0
                            //var k=0;
                            for(var e=0;e<p1.illusts.length;e++){
                                var total_bookmarks=p1.illusts[e].total_bookmarks
                                var illust_id=p1.illusts[e].id
                                var title=p1.illusts[e].title
                                var illust_img=p1.illusts[e].image_urls.square_medium
                                var page_count=p1.illusts[e].page_count
                                var illust_type=0
                                if(p1.illusts[e].type=='ugoira'){
                                    illust_type=2
                                }
                                var illust_r18=false
                                if(JSON.stringify(p1.illusts[e].tags).match(/(R18|R\-18)/)){
                                    illust_r18=true
                                }
                                var illust_restrict=2
                                var author_id=p1.illusts[e].user.id
                                var author_name=p1.illusts[e].user.name
                                if(one_fetch_result[total_bookmarks]==null){
                                    one_fetch_result[total_bookmarks]=total_bookmarks+';'+illust_id+';'+title+';'+illust_img+';'+page_count+';'+illust_type+';'+illust_r18+';'+illust_restrict+';'+author_id+';'+author_name
                                }
                                else{
                                    one_fetch_result[total_bookmarks]=one_fetch_result[total_bookmarks]+'*'+total_bookmarks+';'+illust_id+';'+title+';'+illust_img+';'+page_count+';'+illust_type+';'+illust_r18+';'+illust_restrict+';'+author_id+';'+author_name
                                }
                            }

                            GM_xmlhttpRequest({
                                method: "GET",
                                url: one_sort_url+(page*2).toString(),
                                headers:{
                                    "User-Agent": navigator.userAgent,
                                },
                                onload: function(res) {
                                    if(res.status === 200){
                                        //console.log('成功')
                                        var p2=res.responseText
                                        p2=JSON.parse(p2.replace('\\/','/'))
                                        console.log(p2)
                                        for(var e=0;e<p2.illusts.length;e++){
                                            var total_bookmarks=p2.illusts[e].total_bookmarks
                                            var illust_id=p2.illusts[e].id
                                            var title=p2.illusts[e].title
                                            var illust_img=p2.illusts[e].image_urls.square_medium
                                            var page_count=p2.illusts[e].page_count
                                            var illust_type=0
                                            if(p2.illusts[e].type=='ugoira'){
                                                illust_type=2
                                            }
                                            var illust_r18=false
                                            if(JSON.stringify(p2.illusts[e].tags).match(/(R18|R\-18)/)){
                                                illust_r18=true
                                            }
                                            var illust_restrict=2
                                            var author_id=p2.illusts[e].user.id
                                            var author_name=p2.illusts[e].user.name
                                            if(one_fetch_result[total_bookmarks]==null){
                                                one_fetch_result[total_bookmarks]=total_bookmarks+';'+illust_id+';'+title+';'+illust_img+';'+page_count+';'+illust_type+';'+illust_r18+';'+illust_restrict+';'+author_id+';'+author_name
                                            }
                                            else{
                                                one_fetch_result[total_bookmarks]=one_fetch_result[total_bookmarks]+'*'+total_bookmarks+';'+illust_id+';'+title+';'+illust_img+';'+page_count+';'+illust_type+';'+illust_r18+';'+illust_restrict+';'+author_id+';'+author_name
                                            }
                                        }
                                        console.log(one_fetch_result)

                                        one_fetch_result = one_fetch_result.filter(function (s) {
                                            if(s&&s.trim()){
                                                return true
                                            }
                                            else{
                                                return false
                                            }
                                        })
                                        //console.log(one_fetch_result)
                                        var one_sort=[]
                                        var one_sort_count=0
                                        for(var u=one_fetch_result.length-1;u>=0;u--){
                                            if(one_fetch_result[u].match(/\*/)!=null){
                                                for(var v=0;v<=one_fetch_result[u].match(/\*/g).length;v++){
                                                    one_sort[one_sort_count]=one_fetch_result[u].split('*')[v]
                                                    one_sort_count++
                                                }
                                            }
                                            else{
                                                one_sort[one_sort_count]=one_fetch_result[u]
                                                one_sort_count++
                                            }
                                        }
                                        console.log(one_sort)

                                        document.getElementsByClassName('sc-l7cibp-1 krFoBL')[0].style.display='none'
                                        for(u=0;u<one_sort.length;u++){
                                            var one_split=one_sort[u].split(';')
                                            //sort_addillust(bookmark,illustID,illustName,illustImg,illustNumber,illustType,R_18,illustRestrict,authorID,authorName){
                                            sort_addillust(one_split[0],one_split[1],one_split[2],one_split[3],one_split[4],one_split[5],one_split[6],one_split[7],one_split[8],one_split[9])
                                        }
                                    }
                                }
                            })
                        }
                        else{
                            console.log("error1")
                        }
                    }
                })
                clearInterval(sort_ul_out_interval)
            }
            sort_interval_count++
            if(sort_interval_count==100){
                clearInterval(sort_ul_out_interval)
                return
            }
            sort_ul_out.appendChild(sort_ul)
        },100)
        }

    window.addEventListener('load',function(e){
        if(window.location.href.match(/https\:\/\/www\.pixiv\.net\/tags\/.*?\//)&&getCookie("singleSort")==1){
            single_sort()
        }
    })


    //收藏单个作品（未完成）
    function bookmarks_readd(target){
        isProhibit=0//0为未屏蔽，1为屏蔽
        var cookie_tag_safe=[]
        var id=target.src.match(/\d{6,10}/)[0]
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://www.pixiv.net/artworks/"+id,
            headers:{
                "User-Agent": navigator.userAgent,
            },
            onload: function(res) {
                if(res.status === 200){
                    //console.log('成功')
                    var p=res.responseText
                    var final=p.match(/(?<="tag":").*?(?=")/g).toString().split(',')
                    if(GM_getValue('tagSaveSafe')==''){
                        var tag_cookie=tagSaveSafe.split('*')
                        }
                    else{
                        tag_cookie=GM_getValue('tagSaveSafe').split('*')
                    }
                    if(GM_getValue('tagProhibit')==''){
                        var tag_Prohibit=''
                        }
                    else{
                        tag_Prohibit=GM_getValue('tagProhibit')
                    }
                    cookie_tag_safe[0]='全部'
                    var count=1
                    if(getCookie('tagCookieSetting')==1){
                        for(var i=0;i<final.length;i++){
                            for(var j=0;j<tag_cookie.length;j++){
                                if(tag_Prohibit.match(final[i])!=null){
                                    isProhibit=final[i];
                                    break;
                                }
                                if(tag_cookie[j].match(final[i])!=null){
                                    cookie_tag_safe[count]=tag_cookie[j].split(',')[0]
                                    count++
                                }
                            }
                            if(isProhibit==1){
                                break;
                            }
                        }
                    }
                    if(isProhibit==0){
                        fetch("https://www.pixiv.net/ajax/illusts/bookmarks/add",{
                            headers: {
                                "accept": "application/json",
                                "content-type": "application/json; charset=utf-8",
                                "x-csrf-token": getCookie('token')
                            },
                            "referrer": "https://www.pixiv.net",
                            'method':'POST',
                            'body':JSON.stringify({illust_id: id, restrict: 0, comment: "", tags: cookie_tag_safe})//不确定restrict全年龄时的数值
                        }).then(res=>{
                            loveTagView(cookie_tag_safe)
                            // event.target.closest('a').nextSibling.outerHTML=`<div class="sc-iasfms-2 eDNlMk"><div class=""><button type="button" class="sc-kgq5hw-0 fgVkZi"><svg viewBox="0 0 32 32" width="32" height="32" class="sc-j89e3c-1 bXjFLc"><path d="M21,5.5 C24.8659932,5.5 28,8.63400675 28,12.5 C28,18.2694439 24.2975093,23.1517313 17.2206059,27.1100183C16.4622493,27.5342993 15.5379984,27.5343235 14.779626,27.110148 C7.70250208,23.1517462 4,18.2694529 4,12.5C4,8.63400691 7.13400681,5.5 11,5.5 C12.829814,5.5 14.6210123,6.4144028 16,7.8282366C17.3789877,6.4144028 19.170186,5.5 21,5.5 Z" style="    fill: rgb(255, 64, 96);"></path><path d="M16,11.3317089 C15.0857201,9.28334665 13.0491506,7.5 11,7.5C8.23857625,7.5 6,9.73857647 6,12.5 C6,17.4386065 9.2519779,21.7268174 15.7559337,25.3646328C15.9076021,25.4494645 16.092439,25.4494644 16.2441073,25.3646326 C22.7480325,21.7268037 26,17.4385986 26,12.5C26,9.73857625 23.7614237,7.5 21,7.5 C18.9508494,7.5 16.9142799,9.28334665 16,11.3317089 Z" class="sc-j89e3c-0 dUurgf" style="    fill: rgb(255, 64, 96);"></path></svg></button></div></div>`
                            var button=event.target.closest('a').nextSibling.getElementsByTagName('button')
                            if(button.length==0){
                                button=event.target.closest('a').nextSibling.nextSibling.getElementsByTagName('button')[0]
                            }
                            else{
                                button=button[0]
                            }
                            if(button!=null){
                                button.childNodes[0].childNodes[0].style.fill='red'
                                button.childNodes[0].childNodes[1].style.fill='red'
                            }
                        })
                    }
                    else{
                        alert('包含屏蔽标签'+isProhibit)
                    }
                }
            }
        })
    }

    //一次收藏页面所有作品（未完成）
    function bookmarks_all_readd(){
        var img=document.getElementsByClassName('sc-rp5asc-10 erYaF')//页面预览图className
        var i=0;
        setInterval(function(){
            bookmarks_readd(img[i])
            i++;
        },200)
    }

    // window.addEventListener('keydown',function(e){
    //     if(e.keyCode==65&&e.altKey==true){
    //         bookmarks_all_readd()
    //     }
    // })


    //     window.addEventListener('keydown',function(e){
    //         if(e.keyCode==65){

    //             console.log(GM_getValue('pixiv_history'))

    //         }
    //     })

    /*
    window.addEventListener('keydown',function(e){
        if(e.keyCode==65){

            //原本搜索页ul元素
            //document.getElementsByClassName('sc-l7cibp-3 gCRmsl')[0].style.display='none'//原本页面页码部分（换页）

            single_sort()

        }
    })
    var one_fetch_finish=setInterval(function(){
        if(one_count==60){
            one_fetch_result = one_fetch_result.filter(function (s) {
                if(s&&s.trim()){
                    return true
                }
                else{
                    return false
                }
            })
            //console.log(one_fetch_result)
            var one_sort=[]
            var one_sort_count=0
            for(var u=one_fetch_result.length-1;u>=0;u++){
                if(one_fetch_result[u].match(/;/)!=null){
                    for(var v=0;v<one_fetch_result[u].match(/;/g).length;v++){
                        one_sort[one_sort_count]=one_fetch_result[u].split(';')[v]
                        one_sort_count++
                    }
                }
                else{
                    one_sort[one_sort_count]=one_fetch_result[u]
                    one_sort_count++
                }
            }
            console.log(one_sort)
            clearInterval(one_fetch_finish)
        }
    },100)
    */

    //     var outLink='{"44987750":[["kemono","https://kemono.party/fanbox/user/49494721"],["kemono","https://kemono.party/fanbox/user/49494721"],["fanbox","https://www.pixiv.net/"]]}'
    /*     window.addEventListener('keydown',function(e){
        if(e.shiftKey==true&&e.ctrlKey==true&&e.altKey==true&&e.key=='A')
        {
            if(confirm("是否要启用调试的修改内容")){
                GM_setValue("pixiv_user_outLink",JSON.parse(outLink1))
            }
        }
        else if(e.shiftKey==true&&e.ctrlKey==true&&e.altKey==true&&e.key=='S')
        {
            console.log(GM_getValue("pixiv_user_outLink"))
        }
        else if(e.shiftKey==true&&e.ctrlKey==true&&e.altKey==true&&e.key=='D')
        {
            GM_deleteValue("pixiv_user_outLink")
        }
    }) */

    // var GM_data=GM_getValue('pixiv_history')
    // console.log(GM_data)
    // console.log(GM_data.split(','))
    // console.log(GM_data.split(',')[0].split('+'))
})();