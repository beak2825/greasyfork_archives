// ==UserScript==
// @name         replace
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  haha
// @author       You
// @match        https://www.baidu.com/s?*wd=%E7%81%AB%E7%84%B0%E5%B0%8F%E5%AD%90*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.2.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467495/replace.user.js
// @updateURL https://update.greasyfork.org/scripts/467495/replace.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    console.log('start')
    $('#content_left').empty();
    console.log(1)
    let a = document.getElementById('content_left')
    let x = `
	
    
	
		

	

	
	
				
				
			
	

	
	
						        			
						
	            			
						

			
		
        
		

				

		
		                                                                                                            
                                                                                                                                                                                                                                                                    							<div class="result c-container new-pmd" id="31" srcid="1508" tpl="se_st_single_video_zhanzhang" data-click="{&quot;rsv_bdr&quot;:&quot;&quot;,&quot;p5&quot;:31}" ac_redirectstatus="0"><style>.wa-se-st-single-video-zhanzhang-play {
    position: absolute;
    height: 40px;
    width: 40px;
    top: 50%;
    left: 50%;
    margin: -20px 0 0 -20px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpmOWQ4YzVjMi1kMjNiLTQ5ZjEtOWIyNi0wOGY3MmY4MTc1NTMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDc0OTQ3OURGODgzMTFFNUFFQkZEMDZGREMzOTdFMTkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDc0OTQ3OUNGODgzMTFFNUFFQkZEMDZGREMzOTdFMTkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2Y2IwNzk4OC0yYjNiLTQ2MDItYTllMS0zNzI1Yzk5NTZmMmQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6ZjlkOGM1YzItZDIzYi00OWYxLTliMjYtMDhmNzJmODE3NTUzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Rtt+oAAABS5JREFUeNq8mWtIW2cYxxOXpNtUoihYbbxhzMAJ3jMvKxPnZR9Gvawdm2hhWOy+DLzPil91ImzKPq2jH1QQyqBRB4La6izzNi9RQYMzGg3qbCcuc5rNxBj3f9w53WhXzck5xwcekkPO+7y/vO95n9uRnpycSNyQV6Dp0AxoNPQK1AeqYH63Q3+HbkEXoEPQYegx14mkHAEjoGXQd61Wq3N1dXVrcnLy6cTExN74+PjB9vb2Ed0UGBgoT0lJ8UpOTlZqtdqAiIiIK56enh74aRDaCl0VGvAy9AvoOzMzM8uNjY0/63Q6C5d/VlBQ4FtXV/dGQkKCBpePoXegT4QAvAWtnp+fX8/Pz9evra3ZJDwkPDz8UldXV3xMTEwYLr+EfnvW/R5n/CaHtlsslsqampqHsbGx43zhSMgG2aqurn4I2+U0BzMXpxX0hn5nNpt9kpKShnZ2do4kIoifn58cj0xGaGgoHagPofuuANK/6TYajV7R0dHDdrv9RCKiKBQK6cLCQnpkZOQBLvOgR+cBdmDlItVq9YDD4RAVjhWZTCZdWVnJxkoacXnzrGewFM9FIk7a0EXBkdBcNCfNjcvbLwMkV1IJFzK0u7t7JLlgoTkbGhrIoVcyjv+FLW6HK7lMJ8xVozhAyqmpqT0hQWdnZ1PA8JTdanYFyXlezcvL03MxVl9fn4hIcj0kJORVoQDJ1+LjbYbpGeBn09PTy+vr65z9HFbxzbm5udvFxcUqIQCJgViIiQWkwJ9J4ctdo76+vj5tbW2fdHZ2XqUTyReSYckkNgJMR+B3IPxY+Bj1gBQWFmYsLi7ejIuL8+Zji1iIidgIMBM+6BehniGNRhM2MjLyKcKjho8dZErElEGAUQg3vwp5El+HNDU1fdzf3/+eUqmUuWMDzyGd5GgCVI2OjlqE9mtSqVSSnZ39lsFguJWVleXPdTyYKD6rCJB8mVUsBxwUFBTQ29tb2tLSEsdlHMOkJEDFxsaGqJFDDikrK7uGSV32mQyTwuMiw5m3t/drXN0QAdqDg4PlYsMNDAz8hBDWaTKZ/nLlfobJToB7iAaeImYqx62trd/n5OT0HR4eOjlEKGLaI8DNtLQ0HzHg9vf3rSUlJe3l5eWzXMcyTJvkowzIxeLxaRISbnNzczs3N/e+Xq//w53xiYmJAeQOCXAQdev7QsLhtC5gS3uQgDrctQGmICr4aYt/8PLykiHN8eULhtzyBAnDIAr2B3zgiAWFPi3esAfTjnhERTUfOJvNZq+trb1fVFQ04nQ6ef1RhuURsbF+sBV7rqGi2s10/Tcku/eam5uX+e4CCqdLxMK0SJ4lrNQreazT6eK5GlxaWjJptdp7fX19O0I8v93d3cTwI9u/+W8kuQNHGl5VVeVyYO/o6DAg93PZ+Z4nCId+xICvn7+sLqayswxFdNdFV3bUZTAajfnIzr/G5TdnFu6oC8AYeaGFO+Cyw8LCXijc/w+Qso0H1PqIiooaFhuS4JAzsq2PD6CH53W36IaPMOAQkFm09CJvaybm+pPmfB7urPYbdZmuYclXYKCgoqLCX2g4xGd/so05Vpmm0b67DcxSakdQAxOxVW82m218/VxPTw/bwPwKetfdBiYr1AFNh8EnODw3EGeTAco5+6ExNJZskC3JP034u+fWNm400akrSk30Y5SrW5j0tIk+NjZ2gAzm1DWpVCp5amrqaRMdeV2AWq2mJjo1CKiJ3iIRoYn+vLCvIaj6j5L8+xqCDZX0GLCvIQxMXB2WuPEa4m8BBgDXxE/mIU7+4wAAAABJRU5ErkJggg==) no-repeat;
    background-size:40px 40px;
}
.wa-se-st-single-video-zhanzhang-play:hover {
    background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpmOWQ4YzVjMi1kMjNiLTQ5ZjEtOWIyNi0wOGY3MmY4MTc1NTMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDc0OTQ3OTlGODgzMTFFNUFFQkZEMDZGREMzOTdFMTkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDc0OTQ3OThGODgzMTFFNUFFQkZEMDZGREMzOTdFMTkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2Y2IwNzk4OC0yYjNiLTQ2MDItYTllMS0zNzI1Yzk5NTZmMmQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6ZjlkOGM1YzItZDIzYi00OWYxLTliMjYtMDhmNzJmODE3NTUzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+SH0i3gAABTFJREFUeNq8mVlIY1cYx3OTGE0Mneg8VEYRA3VBZYQykVKd4tQ1UnxrcV/wQaO+aNW2oL5YbEerPmlQxBUXfLSiIo4OVFtcKFoXqhYUYUaKVmPVuGXp/7M3YK0zk3tz44FPzsn1nPvLOd/5tjBWq1XEozGQMMgTSCDkEcQD4sY+P4ccQl5D1iELkCUI55cxHAEJ5AtI1OrqqmpmZsY0NzdnQt+yvb1tMRgM14upVCrGz89PHBISIg4PD5dGRERI0Tfg0UvIIAsuKCDtTgEkurGx0dzS0nK5vr5u4fLNAgMDxXl5ebLi4mIJhi8gzewuOwyohRTp9XrX8vLy85OTE146YWtKpZKpra110+l0Fxg2QUb4AkohX09OTsbU19cbR0ZGzCIBW2JioqSkpEQRHR09geH3EBMXQDnku4GBgccZGRlGk8lkFTmhSaVSpqenR5GcnPwbht9AzuwBpJ2r7erqCsvJyTHyvOX231KGEXV0dCiysrLolpff3sm7ACv6+/ufpaWlOR3uJmRvb68iJSVlCsNv3waYODExUa7Vak+cdaxvO27ouTI2NvYHDIdtn4tvmZJCmBHjfcNRo3c2NDQYWXP28C7AQjIlXG6rWq2WCwk5NjZmbmpqkqGru33E3pAe2Cjj6emp3btXVVUV5OXlpaioqFg+ODi4EgLS3d2dga1VoJsBeWXbwc9h68xc4GwNruwRzNFTuDMPIQCJgViIyXbE5PijWltbL/ku6unpqYDuflxaWvqBWCxmHIVkWaKIjQDDyPFvbGxYHFmUwGBwg7q7uz/y9fV1c2QtYiEmYiNADUUlQil6UFDQQ3iHT5KSkt53ZB0wkU4/IcAACpmEvI1QdFllZaWmpqYmRC6Xi/msASbSw0Ca7L2ysmIR2q6Rd4iLi1PDK0UGBwcruc5nmbwJULWzsyM4oK35+Pi819bW9hR+3ZfLPJZJRYBy2DCneg6ZTCYpLCx83Nzc/CFuvIs9c1gmfvrhQLAqw23nZh0oBsO3YpwNNz4+vpWbmzu7v79vl8dhmc4o9jPAbql2d3fNzgBDEGBBDrOCmG+Hyzww0eYZ6M+r0NBQpxz18fHxBbzLL1zhqLFM1754Q6PRSISGwy08QpT80/T09CGf+fDxxLROgPNw9C5Cws3Ozr5OT0//GZDnfNdgmRYIcAnbaQgICHD4mBG6WWGYfy8qKvrVaDTy1mliYRP9JTFbjniZn58vcwTu4uLCVF1dvYBQ6Q9HcxmWhaoQVtuuDVLGT0k1nwX39vZOsejM0NDQnwLYSoatPgzeDPmpVvKCMn6uC66tre0hd55eXl4+FkJ/WYZJW/3mZlZHEXEvMn7R6OioXfqD2/9gcXHx76urK0FcZXx8vAR5CXXTbHWbmxeDPmimcgSlgPYsOD8/fyQUnEQiYejd6OpvFpVu39zhmJiYic7OTjmFS/fV6F1dXV1yhGdU9frxXZUFsj/P77P00d7ersjOzqbSx1eQK3uLR8/7+vpCMjMzz8xms1Mo6ViRw8hTU1OX31Q8epNxpn/8EhOnoLRKrVYruCtMSEiQ4DIq6R0Ylt0FZ28B8zPK9BFsupaVlZ3DQzi0mwqFgqmrq3MrKCi4YC/EMN8C5n/CM7Zm8imVgPV6/eXm5ianNMHf31+s0+lsJWCyc1QCPninjvIsoj9D3voAkcoVTI2ZiuhbW1uWw8PD68U8PDwYtVp9XUSnSCkyMtIF/SM8mhI5qYj+v3mif3+G0JBvZ8GpIuVqc82Qv1iQDTKZIp4/Q/wjwAB2z0yP+KAgHAAAAABJRU5ErkJggg==);
}
.a-se-st-single-video-zhanzhang-play-new {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 32px;
    height: 32px;
    color: #fff;
    font-size: 32px;
    line-height: 32px;
    -webkit-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
}
.a-se-st-single-video-zhanzhang-capsule {
    display: inline-block;
    font-size: 12px;
    line-height: 1;
    padding: 2px 3px;
    color: #4E6EF2;
    border: 1px solid #CDD4FF;
    border-radius: 4px;
    margin-right:4px;
}</style><style>
                .wa-se-st-image_single_video {overflow:hidden;position:relative;}
                .wa-se-st-image_single_video img {height:91px;}</style><h3 class="t" data-favicon-t="bilibili.com"><a href="https://www.bilibili.com/video/BV1re4y1W7QD" target="_blank" data-click="{'F':'77A717EA','F1':'9D73F1E4','F2':'4CA6DE6A','F3':'54E5243F','T':'1685453209','y':'6B2FCAB7'}" ac_redirectstatus="2">天天打枪?!雷电<em>小子</em>学<em>火焰</em>枪技能,雷电火焰双重输出_哔哩哔哩...</a></h3><div class="c-row c-gap-top-small"><a href="https://www.bilibili.com/video/BV1re4y1W7QD" class="wa-se-st-image_single_video c-span3" style="position:relative;top:2px;" target="_blank" ac_redirectstatus="2"><img src="https://gimg4.baidu.com/poster/src=http%3A%2F%2Ft14.baidu.com%2Fit%2Fu%3D3865977589%2C219039419%26fm%3D225%26app%3D113%26f%3DJPEG%3Fw%3D1728%26h%3D1080%26s%3D28F2E506585789EF949C34B30300D090&amp;refer=http%3A%2F%2Fwww.baidu.com&amp;app=2004&amp;size=f242,182&amp;n=0&amp;g=0n&amp;q=100?sec=1685539609&amp;t=690dcdf1d6756b54595c458c2365b2cc" alt="" class="c-img c-img3 c-img-radius-large" style="height:85px"><i class="c-icon a-se-st-single-video-zhanzhang-play-new"></i>&nbsp;-&nbsp;www.bilibili.com</a><div class="c-span9 c-span-last"><font size="-1"><p><span class="a-se-st-single-video-zhanzhang-capsule">视频</span>时长&nbsp;00:49</p><p><span class=" newTimeFactor_before_abs m"><span style="color: #9195A3;">2022年11月13日</span>&nbsp;-&nbsp;</span>天天打枪?!雷电<em>小子</em>学<em>火焰</em>枪技能,雷电火焰双重输出 588  0  2022-11-13 20:56:59  您当前的浏览器不支持 HTML5 ...</p><div class="g" style="margin-top:2px"><span class="c-showurl">www.bilibili.com/video/BV1re...</span><div class="c-tools c-gap-left" id="tools_17504607239687512454_31" data-tools="{&quot;title&quot;:&quot;天天打枪?!雷电小子学火焰枪技能,雷电火焰双重输出_哔哩哔哩...&quot;,&quot;url&quot;:&quot;http://www.baidu.com/link?url=i7o9wDl3l_KSBM6KGY7Jh0jm8klqLAZYbh3iR2KNpznvJJM3XvgvGJvBWe62Epr2xVwigNBntrKGhsEdp9c_IK&quot;}"><i class="c-icon f13"></i></div></div></font></div></div></div>
					        
				
		
						
	        
        
		

				

		
		                                                                                                            
                                                                                                                                                                                                                                                                                                
                                                                        							
        
        <div class="result-op c-container xpath-log new-pmd" srcid="1547" id="32" tpl="bk_polysemy" mu="https://baike.baidu.com/item/小虎/22302096" data-op="{'y':'BE7FBFBA'}" data-click="{&quot;p1&quot;:32,&quot;rsv_bdr&quot;:&quot;&quot;,&quot;fm&quot;:&quot;alop&quot;,&quot;rsv_stl&quot;:&quot;&quot;,&quot;p5&quot;:32}" data-cost="{&quot;renderCost&quot;:14,&quot;dataCost&quot;:5}" m-name="aladdin-san/app/bk_polysemy/result_964c95d" m-path="https://pss.bdstatic.com/r/www/cache/static/aladdin-san/app/bk_polysemy/result_964c95d" nr="1" ac_redirectstatus="0">
            <div><div class="bk_polysemy_1Ef6j" has-tts="true"><h3 class="c-title t" data-favicon-t="https://baike.baidu.com/item/%E5%B0%8F%E8%99%8E/22302096"><!--513--><!--514--><a class="
                " href="https://baike.baidu.com/item/小虎/22302096" data-showurl-highlight="false" target="_blank" tabindex="0" data-click="" aria-label="小虎，电视剧《终极一班5》中的角色，百度百科" ac_redirectstatus="2">小虎(电视剧《终极一班5》中的角色) - 百度百科</a><!--515--><!--516--></h3><!--512--><!--510--><!--517--><!--518--><div class="c-row c-gap-top-small" aria-hidden="false" aria-label=""><!--520--><div class="c-span3 left-image_3TJlK" aria-hidden="false" aria-label="查看更多内容"><!--523--><a style="color:" href="https://baike.baidu.com/item/小虎/22302096" target="_blank" aria-label="查看更多内容" tabindex="0" ac_redirectstatus="2"><!--526--><div class="
        image-wrapper_39wYE
        
        
    "><!--528--><!--529--><!--530--><!--531--><!--532--><!--533--><div class="c-img c-img-radius-large c-img-s c-img3 compatible_rxApe"><span class="c-img-border c-img-radius-large"></span><img src="https://t8.baidu.com/it/u=3343586010,593805567&amp;fm=74&amp;app=80&amp;size=f256,256&amp;n=0&amp;f=JPEG&amp;fmt=auto?sec=1685552400&amp;t=5c287e9d594da94648360ada10023a3d" aria-hidden="true" alt="查看更多内容" aria-label="查看更多内容"></div></div><!--534--><!--526--></a><!--524--><!--523--></div><!--521--><div class="c-span9 c-span-last main-info_4Q_kj" aria-hidden="false" aria-label=""><!--536--><!--537--><div><div class="c-font-normal c-color-text" aria-label="魔化后被疯龙控制，又再次觉醒成为火焰使者，他开启了末日时钟欲摧毁金时空，蓝斯洛等众人出手阻止小虎……角色能力 超级拔魔战士 历代最强的拔魔战士，拥有对魔的控制力 ，对魔的感知能力和对魔物的克制，不需要拔魔斩便能击杀魔族。火焰..."><!--541--><div class="text_2NOr6">魔化后被疯龙控制，又再次觉醒成为<em>火焰</em>使者，他开启了末日时钟欲摧毁金时空，蓝斯洛等众人出手阻止小虎……角色能力 超级拔魔战士 历代最强的拔魔战士，拥有对魔的控制力 ，对魔的感知能力和对魔物的克制，不需要拔魔斩便能击杀魔族。火焰...</div><!--542--></div><!--539--></div><!--538--><div class=" catalog-list_iR5a4"><div><a style="color:" href="http://www.baidu.com/link?url=Zl9Y-azK-qjxUIwwKml_PJVkx_Ek6-siNJgmUZfDDF7pplrQWt_zgjNhdKFEqObgKXGjmySnr-KAs8mlWREekzUPHVGbrsNfH4_4dgFzdh_" target="_blank" aria-label="角色形象" tabindex="0"><!--s-slot--><!--548-->
                            
                            角色形象
                        <!--548--><!--/s-slot--></a><a style="color:" href="http://www.baidu.com/link?url=Zl9Y-azK-qjxUIwwKml_PJVkx_Ek6-siNJgmUZfDDF7pplrQWt_zgjNhdKFEqObgKXGjmySnr-KAs8mlWREektRG6uMcGx-nxeaIJR0WxWS" target="_blank" aria-label="角色经历" tabindex="0"><!--s-slot--><!--551-->
                            
                            角色经历
                        <!--551--><!--/s-slot--></a><a style="color:" href="http://www.baidu.com/link?url=Zl9Y-azK-qjxUIwwKml_PJVkx_Ek6-siNJgmUZfDDF7pplrQWt_zgjNhdKFEqObgKXGjmySnr-KAs8mlWREekuyixAtVeMn9vQdXV5SILpa" target="_blank" aria-label="角色能力" tabindex="0"><!--s-slot--><!--554-->
                            
                            角色能力
                        <!--554--><!--/s-slot--></a><a style="color:" href="http://www.baidu.com/link?url=Zl9Y-azK-qjxUIwwKml_PJVkx_Ek6-siNJgmUZfDDF7pplrQWt_zgjNhdKFEqObgKXGjmySnr-KAs8mlWREek-NOxM3vDLxFn8S9Lww2GeW" target="_blank" aria-label="战斗记录" tabindex="0"><!--s-slot--><!--557-->
                            
                            战斗记录
                        <!--557--><!--/s-slot--></a><!--545--></div><!--544--></div><!--543--><div class="c-row source_1Vdff source_1rJIg"><a href="https://baike.baidu.com/item/小虎/22302096" target="_blank" class="siteLink_9TPP3" aria-hidden="false" aria-label="百度百科" ac_redirectstatus="2"><div class="site-img_aJqZX c-gap-right-xsmall"><div class="
        image-wrapper_39wYE
        
        
    "><!--563--><!--564--><!--565--><!--566--><!--567--><!--568--><div class="c-img c-img-radius-large c-img-s  compatible_rxApe"><span class="c-img-border c-img-radius-large"></span><img src="https://gimg3.baidu.com/search/src=https%3A%2F%2Fbaikebcs.bdimg.com%2Fbaike-icon.png&amp;refer=http%3A%2F%2Fwww.baidu.com&amp;app=2021&amp;size=f64,64&amp;n=0&amp;g=0n&amp;q=100&amp;fmt=auto?sec=1685552400&amp;t=e7f08325147383bd88e73e7fbb982e05" aria-hidden="false" alt="" aria-label=""></div></div><!--569--></div><!--561--><span class="c-color-gray" aria-hidden="true">百度百科</span><!--570--></a><!--560--><div class="c-tools tools_47szj" data-tools="{&quot;title&quot;:&quot;小虎(电视剧《终极一班5》中的角色)&quot;,&quot;url&quot;:&quot;http://www.baidu.com/link?url=7j7m_KzVGIiV_5yv2_VoU_rHhe3LdywTHqfk9POPKzvXEdQVjR3-fnkDBFuVcNNDZHEOj_KECFuWyyqOFrpAQm2E_AOSSdenycYdcqwntTy&quot;}" aria-hidden="true"><i class="c-icon icon_X09BS"></i></div><!--571--><!--572--><!--573--><!--574--><!--575--><!--576--><!--577--><!--577--></div><!--558--><div class="tts-wrapper_1Lt-9
                        
                        
                        display-show_1Ik3S"><div class="tts-button_1V9FA tts" data-tts-id="08f5fda4451ea46bf684b0a72dd15642" data-ext="{&quot;baike_id&quot;:&quot;22302096&quot;,&quot;source&quot;:&quot;baike&quot;,&quot;lid&quot;:&quot;e97754e500035aae&quot;,&quot;title&quot;:&quot;%E5%B0%8F%E8%99%8E&quot;,&quot;url&quot;:&quot;https%3A%2F%2Fbaike.baidu.com%2Fitem%2F%25E5%25B0%258F%25E8%2599%258E%2F22302096&quot;}" data-tts-source-type="default" data-url="https://baike.baidu.com/item/%E5%B0%8F%E8%99%8E/22302096"><div class="play-tts_neB8h button-wrapper_oe2Vk play-tts"><i class="c-icon"></i><span class="tts-button-text_3ucDJ">播报</span></div><div class="pause-tts_17OBj button-wrapper_oe2Vk pause-tts"><i class="c-icon"></i><span class="tts-button-text_3ucDJ">暂停</span></div></div></div><!--536--></div><!--520--></div></div><!--509--></div>
        </div>
					        
				
		
						
	        
        
		

				

		
		                                                                                                            
                                                                                                                                                                                                                                                                    							<div class="result c-container new-pmd" id="33" srcid="1508" tpl="se_st_single_video_zhanzhang" data-click="{&quot;rsv_bdr&quot;:&quot;&quot;,&quot;p5&quot;:33}" ac_redirectstatus="0"><style>.wa-se-st-single-video-zhanzhang-play {
    position: absolute;
    height: 40px;
    width: 40px;
    top: 50%;
    left: 50%;
    margin: -20px 0 0 -20px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpmOWQ4YzVjMi1kMjNiLTQ5ZjEtOWIyNi0wOGY3MmY4MTc1NTMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDc0OTQ3OURGODgzMTFFNUFFQkZEMDZGREMzOTdFMTkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDc0OTQ3OUNGODgzMTFFNUFFQkZEMDZGREMzOTdFMTkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2Y2IwNzk4OC0yYjNiLTQ2MDItYTllMS0zNzI1Yzk5NTZmMmQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6ZjlkOGM1YzItZDIzYi00OWYxLTliMjYtMDhmNzJmODE3NTUzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Rtt+oAAABS5JREFUeNq8mWtIW2cYxxOXpNtUoihYbbxhzMAJ3jMvKxPnZR9Gvawdm2hhWOy+DLzPil91ImzKPq2jH1QQyqBRB4La6izzNi9RQYMzGg3qbCcuc5rNxBj3f9w53WhXzck5xwcekkPO+7y/vO95n9uRnpycSNyQV6Dp0AxoNPQK1AeqYH63Q3+HbkEXoEPQYegx14mkHAEjoGXQd61Wq3N1dXVrcnLy6cTExN74+PjB9vb2Ed0UGBgoT0lJ8UpOTlZqtdqAiIiIK56enh74aRDaCl0VGvAy9AvoOzMzM8uNjY0/63Q6C5d/VlBQ4FtXV/dGQkKCBpePoXegT4QAvAWtnp+fX8/Pz9evra3ZJDwkPDz8UldXV3xMTEwYLr+EfnvW/R5n/CaHtlsslsqampqHsbGx43zhSMgG2aqurn4I2+U0BzMXpxX0hn5nNpt9kpKShnZ2do4kIoifn58cj0xGaGgoHagPofuuANK/6TYajV7R0dHDdrv9RCKiKBQK6cLCQnpkZOQBLvOgR+cBdmDlItVq9YDD4RAVjhWZTCZdWVnJxkoacXnzrGewFM9FIk7a0EXBkdBcNCfNjcvbLwMkV1IJFzK0u7t7JLlgoTkbGhrIoVcyjv+FLW6HK7lMJ8xVozhAyqmpqT0hQWdnZ1PA8JTdanYFyXlezcvL03MxVl9fn4hIcj0kJORVoQDJ1+LjbYbpGeBn09PTy+vr65z9HFbxzbm5udvFxcUqIQCJgViIiQWkwJ9J4ctdo76+vj5tbW2fdHZ2XqUTyReSYckkNgJMR+B3IPxY+Bj1gBQWFmYsLi7ejIuL8+Zji1iIidgIMBM+6BehniGNRhM2MjLyKcKjho8dZErElEGAUQg3vwp5El+HNDU1fdzf3/+eUqmUuWMDzyGd5GgCVI2OjlqE9mtSqVSSnZ39lsFguJWVleXPdTyYKD6rCJB8mVUsBxwUFBTQ29tb2tLSEsdlHMOkJEDFxsaGqJFDDikrK7uGSV32mQyTwuMiw5m3t/drXN0QAdqDg4PlYsMNDAz8hBDWaTKZ/nLlfobJToB7iAaeImYqx62trd/n5OT0HR4eOjlEKGLaI8DNtLQ0HzHg9vf3rSUlJe3l5eWzXMcyTJvkowzIxeLxaRISbnNzczs3N/e+Xq//w53xiYmJAeQOCXAQdev7QsLhtC5gS3uQgDrctQGmICr4aYt/8PLykiHN8eULhtzyBAnDIAr2B3zgiAWFPi3esAfTjnhERTUfOJvNZq+trb1fVFQ04nQ6ef1RhuURsbF+sBV7rqGi2s10/Tcku/eam5uX+e4CCqdLxMK0SJ4lrNQreazT6eK5GlxaWjJptdp7fX19O0I8v93d3cTwI9u/+W8kuQNHGl5VVeVyYO/o6DAg93PZ+Z4nCId+xICvn7+sLqayswxFdNdFV3bUZTAajfnIzr/G5TdnFu6oC8AYeaGFO+Cyw8LCXijc/w+Qso0H1PqIiooaFhuS4JAzsq2PD6CH53W36IaPMOAQkFm09CJvaybm+pPmfB7urPYbdZmuYclXYKCgoqLCX2g4xGd/so05Vpmm0b67DcxSakdQAxOxVW82m218/VxPTw/bwPwKetfdBiYr1AFNh8EnODw3EGeTAco5+6ExNJZskC3JP034u+fWNm400akrSk30Y5SrW5j0tIk+NjZ2gAzm1DWpVCp5amrqaRMdeV2AWq2mJjo1CKiJ3iIRoYn+vLCvIaj6j5L8+xqCDZX0GLCvIQxMXB2WuPEa4m8BBgDXxE/mIU7+4wAAAABJRU5ErkJggg==) no-repeat;
    background-size:40px 40px;
}
.wa-se-st-single-video-zhanzhang-play:hover {
    background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpmOWQ4YzVjMi1kMjNiLTQ5ZjEtOWIyNi0wOGY3MmY4MTc1NTMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDc0OTQ3OTlGODgzMTFFNUFFQkZEMDZGREMzOTdFMTkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDc0OTQ3OThGODgzMTFFNUFFQkZEMDZGREMzOTdFMTkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2Y2IwNzk4OC0yYjNiLTQ2MDItYTllMS0zNzI1Yzk5NTZmMmQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6ZjlkOGM1YzItZDIzYi00OWYxLTliMjYtMDhmNzJmODE3NTUzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+SH0i3gAABTFJREFUeNq8mVlIY1cYx3OTGE0Mneg8VEYRA3VBZYQykVKd4tQ1UnxrcV/wQaO+aNW2oL5YbEerPmlQxBUXfLSiIo4OVFtcKFoXqhYUYUaKVmPVuGXp/7M3YK0zk3tz44FPzsn1nPvLOd/5tjBWq1XEozGQMMgTSCDkEcQD4sY+P4ccQl5D1iELkCUI55cxHAEJ5AtI1OrqqmpmZsY0NzdnQt+yvb1tMRgM14upVCrGz89PHBISIg4PD5dGRERI0Tfg0UvIIAsuKCDtTgEkurGx0dzS0nK5vr5u4fLNAgMDxXl5ebLi4mIJhi8gzewuOwyohRTp9XrX8vLy85OTE146YWtKpZKpra110+l0Fxg2QUb4AkohX09OTsbU19cbR0ZGzCIBW2JioqSkpEQRHR09geH3EBMXQDnku4GBgccZGRlGk8lkFTmhSaVSpqenR5GcnPwbht9AzuwBpJ2r7erqCsvJyTHyvOX231KGEXV0dCiysrLolpff3sm7ACv6+/ufpaWlOR3uJmRvb68iJSVlCsNv3waYODExUa7Vak+cdaxvO27ouTI2NvYHDIdtn4tvmZJCmBHjfcNRo3c2NDQYWXP28C7AQjIlXG6rWq2WCwk5NjZmbmpqkqGru33E3pAe2Cjj6emp3btXVVUV5OXlpaioqFg+ODi4EgLS3d2dga1VoJsBeWXbwc9h68xc4GwNruwRzNFTuDMPIQCJgViIyXbE5PijWltbL/ku6unpqYDuflxaWvqBWCxmHIVkWaKIjQDDyPFvbGxYHFmUwGBwg7q7uz/y9fV1c2QtYiEmYiNADUUlQil6UFDQQ3iHT5KSkt53ZB0wkU4/IcAACpmEvI1QdFllZaWmpqYmRC6Xi/msASbSw0Ca7L2ysmIR2q6Rd4iLi1PDK0UGBwcruc5nmbwJULWzsyM4oK35+Pi819bW9hR+3ZfLPJZJRYBy2DCneg6ZTCYpLCx83Nzc/CFuvIs9c1gmfvrhQLAqw23nZh0oBsO3YpwNNz4+vpWbmzu7v79vl8dhmc4o9jPAbql2d3fNzgBDEGBBDrOCmG+Hyzww0eYZ6M+r0NBQpxz18fHxBbzLL1zhqLFM1754Q6PRSISGwy08QpT80/T09CGf+fDxxLROgPNw9C5Cws3Ozr5OT0//GZDnfNdgmRYIcAnbaQgICHD4mBG6WWGYfy8qKvrVaDTy1mliYRP9JTFbjniZn58vcwTu4uLCVF1dvYBQ6Q9HcxmWhaoQVtuuDVLGT0k1nwX39vZOsejM0NDQnwLYSoatPgzeDPmpVvKCMn6uC66tre0hd55eXl4+FkJ/WYZJW/3mZlZHEXEvMn7R6OioXfqD2/9gcXHx76urK0FcZXx8vAR5CXXTbHWbmxeDPmimcgSlgPYsOD8/fyQUnEQiYejd6OpvFpVu39zhmJiYic7OTjmFS/fV6F1dXV1yhGdU9frxXZUFsj/P77P00d7ersjOzqbSx1eQK3uLR8/7+vpCMjMzz8xms1Mo6ViRw8hTU1OX31Q8epNxpn/8EhOnoLRKrVYruCtMSEiQ4DIq6R0Ylt0FZ28B8zPK9BFsupaVlZ3DQzi0mwqFgqmrq3MrKCi4YC/EMN8C5n/CM7Zm8imVgPV6/eXm5ianNMHf31+s0+lsJWCyc1QCPninjvIsoj9D3voAkcoVTI2ZiuhbW1uWw8PD68U8PDwYtVp9XUSnSCkyMtIF/SM8mhI5qYj+v3mif3+G0JBvZ8GpIuVqc82Qv1iQDTKZIp4/Q/wjwAB2z0yP+KAgHAAAAABJRU5ErkJggg==);
}
.a-se-st-single-video-zhanzhang-play-new {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 32px;
    height: 32px;
    color: #fff;
    font-size: 32px;
    line-height: 32px;
    -webkit-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
}
.a-se-st-single-video-zhanzhang-capsule {
    display: inline-block;
    font-size: 12px;
    line-height: 1;
    padding: 2px 3px;
    color: #4E6EF2;
    border: 1px solid #CDD4FF;
    border-radius: 4px;
    margin-right:4px;
}</style><style>
                .wa-se-st-image_single_video {overflow:hidden;position:relative;}
                .wa-se-st-image_single_video img {height:91px;}</style><h3 class="t" data-favicon-t="iqiyi.com"><a href="https://www.iqiyi.com/v_19rs8xcv5o.html" target="_blank" data-click="{'F':'77A717EA','F1':'9D73F1E4','F2':'4CA6DE6A','F3':'54E5243F','T':'1685453209','y':'7FF6DDF7'}" ac_redirectstatus="2">...第2019-06-06期【植物大战僵尸2】游戏时刻:牛仔<em>小子</em>僵尸前...</a></h3><div class="c-row c-gap-top-small"><a href="https://www.iqiyi.com/v_19rs8xcv5o.html" class="wa-se-st-image_single_video c-span3" style="position:relative;top:2px;" target="_blank" ac_redirectstatus="2"><img src="https://gimg4.baidu.com/poster/src=http%3A%2F%2Ft14.baidu.com%2Fit%2Fu%3D1513867330%2C3211163868%26fm%3D225%26app%3D113%26f%3DJPEG%3Fw%3D480%26h%3D270%26s%3DD7A506E21D10CDDC2A026A6E0300707E&amp;refer=http%3A%2F%2Fwww.baidu.com&amp;app=2004&amp;size=f242,182&amp;n=0&amp;g=0n&amp;q=100?sec=1685539609&amp;t=a36a867b4ff08818825a409a53a25656" alt="" class="c-img c-img3 c-img-radius-large" style="height:85px"><i class="c-icon a-se-st-single-video-zhanzhang-play-new"></i>&nbsp;-&nbsp;www.iqiyi.com</a><div class="c-span9 c-span-last"><font size="-1"><p><span class="a-se-st-single-video-zhanzhang-capsule">视频</span>时长&nbsp;03:20</p><p><span class=" newTimeFactor_before_abs m"><span style="color: #9195A3;">2019年6月6日</span>&nbsp;-&nbsp;</span>【植物大战僵尸2】破解版搞笑游戏视频，最精彩、最搞笑、最全植物、最全僵尸！你想看的这里都有！喜欢的小伙伴记...</p><div class="g" style="margin-top:2px"><span class="c-showurl">www.iqiyi.com/v_19rs8xcv...html</span><div class="c-tools c-gap-left" id="tools_17216897420931543159_33" data-tools="{&quot;title&quot;:&quot;...第2019-06-06期【植物大战僵尸2】游戏时刻:牛仔小子僵尸前来挑战...&quot;,&quot;url&quot;:&quot;http://www.baidu.com/link?url=ioBBtvUAvq0KS4RMfAL29hYdrNwqiwWtoDVXW1rzdo8yXD3RfDLlBeZR85XkhKvnt6AHEl_aD3su0EmosUdvq_&quot;}"><i class="c-icon f13"></i></div></div></font></div></div></div>
					        
				
		
						
	        
        
		

				

		
		                                                                                                            
                                                                                                                                                                                                                                                                                                
                                                                        							
        
        <div class="result c-container xpath-log new-pmd" srcid="1599" id="34" tpl="se_com_default" mu="https://www.itsfun.com.tw/porshe/wiki-1580696-6036476" data-op="{'y':'FFFEC1C7'}" data-click="{&quot;p1&quot;:34,&quot;rsv_bdr&quot;:&quot;&quot;,&quot;rsv_cd&quot;:&quot;&quot;,&quot;fm&quot;:&quot;as&quot;,&quot;p5&quot;:34}" data-cost="{&quot;renderCost&quot;:5,&quot;dataCost&quot;:2}" m-name="aladdin-san/app/se_com_default/result_76dcd8b" m-path="https://pss.bdstatic.com/r/www/cache/static/aladdin-san/app/se_com_default/result_76dcd8b" nr="1" ac_redirectstatus="0">
            <div class="c-container" data-click=""><div has-tts="false"><h3 class="c-title t t tts-title" data-favicon-t="https://www.itsfun.com.tw/porshe/wiki-1580696-6036476"><!--407--><!--408--><a class="
                " href="https://www.itsfun.com.tw/porshe/wiki-1580696-6036476" data-showurl-highlight="true" target="_blank" tabindex="0" data-click="{&quot;F&quot;:&quot;77A717EA&quot;,&quot;F1&quot;:&quot;9D73F1E4&quot;,&quot;F2&quot;:&quot;4CA6DE6A&quot;,&quot;F3&quot;:&quot;54E5243F&quot;,&quot;T&quot;:1685453209,&quot;y&quot;:&quot;FFFEC1C7&quot;}" aria-label="" ac_redirectstatus="2">porshe:porshe,泰文名 : ศรัณย์ ศิร...</a><!--409--><!--410--></h3><!--406--><div style="margin-bottom: -4px;"><!--412--><!--413--><!--414--><!--415--><!--416--><!--417--></div><div><!--420--><div class="c-row c-gap-top-middle" aria-hidden="false" aria-label=""><!--422--><div class="c-span3" aria-hidden="false" aria-label=""><!--424--><a href="https://www.itsfun.com.tw/porshe/wiki-1580696-6036476" target="_blank" ac_redirectstatus="2"><div class="
        image-wrapper_39wYE
        
        
     c-gap-top-mini"><!--426--><!--427--><!--428--><!--429--><!--430--><!--431--><div class="c-img c-img-radius-large  c-img3 compatible_rxApe"><span class="c-img-border c-img-radius-large"></span><img src="https://t7.baidu.com/it/u=2859627961,1747446746&amp;fm=218&amp;app=126&amp;size=f242,150&amp;n=0&amp;f=JPEG&amp;fmt=auto?s=1F09A9465ADAD89C8C00397E03009060&amp;sec=1685552400&amp;t=b4de134cb33ce58b67e8f69804892880" aria-hidden="false" alt="" aria-label="" style="width: 128px;height: 85px;"></div></div></a><!--424--></div><div class="c-span9 c-span-last" aria-hidden="false" aria-label=""><!--433--><!--434--><!--435--><!--436--><!--437--><!--438--><!--439--><!--440--><!--441--><!--442--><span class="content-right_8Zs40">盡管如此,Gumpan對孔劇和戲班的熱愛還是最終打動了父親,Dumron接受了Gumpan成為一個“戲班<em>小子</em>”。惡魔<em>火焰</em> Kao的媽媽Papit/Nudi. 在她很小的時候,拋棄了她和父兄,尋求更好的生活。長大後,Kao成為...</span><!--443--><!--444--><div class="c-row source_1Vdff OP_LOG_LINK c-gap-top-xsmall "><a href="https://www.itsfun.com.tw/porshe/wiki-1580696-6036476" target="_blank" class="siteLink_9TPP3" aria-hidden="false" tabindex="0" aria-label="" ac_redirectstatus="2"><!--448--><span class="c-color-gray" aria-hidden="true">www.itsfun.com.tw/porshe/wiki-...</span><!--449--></a><!--447--><div class="c-tools tools_47szj" id="tools_252729964662728872_4" data-tools="{'title': &quot;porshe:porshe,泰文名:ศรัณย์ศิร...&quot;,
            'url': &quot;http://www.baidu.com/link?url=Zl9Y-azK-qjxUIwwKml_P3ptvh6W7nQhVBRKg7popasHj9Gw62WyqJ0NhB1gTxOePw-gGbwYhgXkDwcEYgDWoK&quot;}" aria-hidden="true"><i class="c-icon icon_X09BS"></i></div><!--450--><!--451--><!--452--><!--453--><!--454--><!--455--><!--456--><!--457--><!--456--></div><!--445--><!--458--><!--433--></div><!--422--></div><!--459--><!--460--><!--420--><!--419--></div></div><!--461--><div><!--464--><!--465--></div><!--462--></div>
        </div>
					        
				
		
						
	        
        
		

				

		
		                                                                                                            
                                                                                                                                                                                                                                                                                                
                                                                        							
        
        <div class="result c-container xpath-log new-pmd" srcid="1599" id="35" tpl="se_com_default" mu="https://m.ankangwang.com/akwNOQmrU/" data-op="{'y':'DBBBF79D'}" data-click="{&quot;p1&quot;:35,&quot;rsv_bdr&quot;:&quot;&quot;,&quot;rsv_cd&quot;:&quot;&quot;,&quot;fm&quot;:&quot;as&quot;,&quot;p5&quot;:35}" data-cost="{&quot;renderCost&quot;:1,&quot;dataCost&quot;:1}" m-name="aladdin-san/app/se_com_default/result_76dcd8b" m-path="https://pss.bdstatic.com/r/www/cache/static/aladdin-san/app/se_com_default/result_76dcd8b" nr="1" ac_redirectstatus="0">
            <div class="c-container" data-click=""><div has-tts="true"><h3 class="c-title t t tts-title" data-favicon-t="https://m.ankangwang.com/akwNOQmrU/"><!--362--><!--363--><a class="
                " href="https://m.ankangwang.com/akwNOQmrU/" data-showurl-highlight="true" target="_blank" tabindex="0" data-click="{&quot;F&quot;:&quot;77A717EA&quot;,&quot;F1&quot;:&quot;9D73F1E4&quot;,&quot;F2&quot;:&quot;4CA6DE6A&quot;,&quot;F3&quot;:&quot;54E5243F&quot;,&quot;T&quot;:1685453209,&quot;y&quot;:&quot;DBBBF79D&quot;}" aria-label="" ac_redirectstatus="2">安康给大家科普一下公司取名大全免费V0.2.3版|安康网</a><!--364--><!--365--></h3><!--361--><div style="margin-bottom: -4px;"><!--367--><!--368--><!--369--><!--370--><!--371--><!--372--></div><div><div class="c-gap-top-small"><!--375--><!--376--><!--377--><!--378--><!--379--><!--380--><span class="content-right_8Zs40">紫色<em>火焰</em>?这<em>小子</em>,真是羽族皇脉?啊,亲家,你这是干什幺?快把刀放下。有话好好说。史文晶立刻劝阻道。不过,这个过程不会耗费太长时间。 老板看到这一幕,...</span><!--381--><!--382--><div class="c-row source_1Vdff OP_LOG_LINK c-gap-top-xsmall source_s_3aixw "><a href="https://m.ankangwang.com/akwNOQmrU/" target="_blank" class="siteLink_9TPP3" aria-hidden="false" tabindex="0" aria-label="" ac_redirectstatus="2"><!--386--><span class="c-color-gray" aria-hidden="true">安康网</span><!--387-->&nbsp;-&nbsp;m.ankangwang.com</a><!--385--><div class="c-tools tools_47szj" id="tools_388453820885905937_5" data-tools="{'title': &quot;安康给大家科普一下公司取名大全免费V0.2.3版|安康网&quot;,
            'url': &quot;http://www.baidu.com/link?url=7j7m_KzVGIiV_5yv2_VoUIK2kZgR1XNAIZJKmJR4FOAITYAs4dlOD7VRdKX_6jAs&quot;}" aria-hidden="true"><i class="c-icon icon_X09BS"></i></div><!--388--><!--389--><!--390--><!--391--><!--392--><!--393--><!--394--><!--395--><!--394--></div><!--383--><div class="tts-button_1V9FA tts tts-site_2MWX0" data-tts-id="dbf24a6a9606f00e62d696096903f587" data-ext="{&quot;source&quot;:&quot;oh5&quot;,&quot;lid&quot;:&quot;e97754e500035aae&quot;,&quot;title&quot;:&quot;%E5%AE%89%E5%BA%B7%E7%BB%99%E5%A4%A7%E5%AE%B6%E7%A7%91%E6%99%AE%E4%B8%80%E4%B8%8B%E5%85%AC%E5%8F%B8%E5%8F%96%E5%90%8D%E5%A4%A7%E5%85%A8%E5%85%8D%E8%B4%B9V0.2.3%E7%89%88%7C%E5%AE%89%E5%BA%B7%E7%BD%91&quot;,&quot;url&quot;:&quot;https%3A%2F%2Fm.ankangwang.com%2FakwNOQmrU%2F&quot;}" data-tts-source-type="default" data-url="https://m.ankangwang.com/akwNOQmrU/"><div class="play-tts_neB8h button-wrapper_oe2Vk play-tts"><i class="c-icon"></i><span class="tts-button-text_3ucDJ">播报</span></div><div class="pause-tts_17OBj button-wrapper_oe2Vk pause-tts"><i class="c-icon"></i><span class="tts-button-text_3ucDJ">暂停</span></div></div><!--396--></div><!--374--></div></div><!--398--><div><!--401--><!--402--></div><!--399--></div>
        </div>
					        
				
		
						
	        
        
		

				

		
		                                                                                                            
                                                                                                                                                                                                                                                                                                
                                                                        							
        
        <div class="result c-container xpath-log new-pmd" srcid="1599" id="36" tpl="se_com_default" mu="http://www.cmodel.com/news/201801/03c9m3665.html" data-op="{'y':'DFDF5BDF'}" data-click="{&quot;p1&quot;:36,&quot;rsv_bdr&quot;:&quot;&quot;,&quot;rsv_cd&quot;:&quot;&quot;,&quot;fm&quot;:&quot;as&quot;,&quot;p5&quot;:36}" data-cost="{&quot;renderCost&quot;:2,&quot;dataCost&quot;:1}" m-name="aladdin-san/app/se_com_default/result_76dcd8b" m-path="https://pss.bdstatic.com/r/www/cache/static/aladdin-san/app/se_com_default/result_76dcd8b" nr="1" ac_redirectstatus="0">
            <div class="c-container" data-click=""><div has-tts="true"><h3 class="c-title t t tts-title" data-favicon-t="http://www.cmodel.com/news/201801/03c9m3665.html"><!--317--><!--318--><a class="
                " href="http://www.cmodel.com/news/201801/03c9m3665.html" data-showurl-highlight="true" target="_blank" tabindex="0" data-click="{&quot;F&quot;:&quot;77A717EA&quot;,&quot;F1&quot;:&quot;9D73F1E4&quot;,&quot;F2&quot;:&quot;4CA6DE6A&quot;,&quot;F3&quot;:&quot;54E5243F&quot;,&quot;T&quot;:1685453209,&quot;y&quot;:&quot;DFDF5BDF&quot;}" aria-label="" ac_redirectstatus="2">《最强男神》即将开播 “假<em>小子</em>”赵思点燃新年<em>火焰</em> - 中国...</a><!--319--><!--320--></h3><!--316--><div style="margin-bottom: -4px;"><!--322--><!--323--><!--324--><!--325--><!--326--><!--327--></div><div><div class="c-gap-top-small"><!--330--><!--331--><!--332--><span class="c-color-gray2">2018年1月3日  </span><!--333--><!--334--><!--335--><span class="content-right_8Zs40">《最强男神》即将开播 “假<em>小子</em>”赵思点燃新年<em>火焰</em> 中国模特网讯 www.cmodel.com由阿里影业出品,知名导演张力执导,赵思携手张思帆、张新成、崔宝月等演员联袂主...</span><!--336--><!--337--><div class="c-row source_1Vdff OP_LOG_LINK c-gap-top-xsmall source_s_3aixw "><a href="http://www.cmodel.com/news/201801/03c9m3665.html" target="_blank" class="siteLink_9TPP3" aria-hidden="false" tabindex="0" aria-label="" ac_redirectstatus="2"><!--341--><span class="c-color-gray" aria-hidden="true">中国模特网</span><!--342-->&nbsp;-&nbsp;www.cmodel.com</a><!--340--><div class="c-tools tools_47szj" id="tools_18172906681371274229_6" data-tools="{'title': &quot;《最强男神》即将开播“假小子”赵思点燃新年火焰-中国模特网&quot;,
            'url': &quot;http://www.baidu.com/link?url=fJjlzQUDiIHbW-r_EwcRiqBSb1UBQOqc3JftySmycYxYwR3Mm4nC_M3Cxr9X9JA-FpgLXmbZzGVTPoDusbKzZK&quot;}" aria-hidden="true"><i class="c-icon icon_X09BS"></i></div><!--343--><!--344--><!--345--><!--346--><!--347--><!--348--><!--349--><!--350--><!--349--></div><!--338--><div class="tts-button_1V9FA tts tts-site_2MWX0" data-tts-id="38dcc2291004dfee21a36d2e1bd85463" data-ext="{&quot;source&quot;:&quot;oh5&quot;,&quot;lid&quot;:&quot;e97754e500035aae&quot;,&quot;title&quot;:&quot;%E3%80%8A%E6%9C%80%E5%BC%BA%E7%94%B7%E7%A5%9E%E3%80%8B%E5%8D%B3%E5%B0%86%E5%BC%80%E6%92%AD+%E2%80%9C%E5%81%87%E5%B0%8F%E5%AD%90%E2%80%9D%E8%B5%B5%E6%80%9D%E7%82%B9%E7%87%83%E6%96%B0%E5%B9%B4%E7%81%AB%E7%84%B0+-+%E4%B8%AD%E5%9B%BD%E6%A8%A1%E7%89%B9%E7%BD%91&quot;,&quot;url&quot;:&quot;http%3A%2F%2Fwww.cmodel.com%2Fnews%2F201801%2F03c9m3665.html&quot;}" data-tts-source-type="default" data-url="http://www.cmodel.com/news/201801/03c9m3665.html"><div class="play-tts_neB8h button-wrapper_oe2Vk play-tts"><i class="c-icon"></i><span class="tts-button-text_3ucDJ">播报</span></div><div class="pause-tts_17OBj button-wrapper_oe2Vk pause-tts"><i class="c-icon"></i><span class="tts-button-text_3ucDJ">暂停</span></div></div><!--351--></div><!--329--></div></div><!--353--><div><!--356--><!--357--></div><!--354--></div>
        </div>
					        
				
		
						
	        
        
		

				

		
		                                                                                                            
                                                                                                                                                                                                                                                                                                
                                                                        							
        
        <div class="result c-container xpath-log new-pmd" srcid="1599" id="37" tpl="se_com_default" mu="https://cpu.baidu.com/pc/1022/275122716/detail/126468782734/video?chk=1" data-op="{'y':'F7AF7FDB'}" data-click="{&quot;p1&quot;:37,&quot;rsv_bdr&quot;:&quot;&quot;,&quot;rsv_cd&quot;:&quot;&quot;,&quot;fm&quot;:&quot;as&quot;,&quot;p5&quot;:37}" data-cost="{&quot;renderCost&quot;:2,&quot;dataCost&quot;:1}" m-name="aladdin-san/app/se_com_default/result_76dcd8b" m-path="https://pss.bdstatic.com/r/www/cache/static/aladdin-san/app/se_com_default/result_76dcd8b" nr="1" ac_redirectstatus="0">
            <div class="c-container" data-click=""><div has-tts="false"><h3 class="c-title t t tts-title" data-favicon-t="https://cpu.baidu.com/pc/1022/275122716/detail/126468782734/video?chk=1"><!--273--><!--274--><a class="
                " href="https://cpu.baidu.com/pc/1022/275122716/detail/126468782734/video?chk=1" data-showurl-highlight="true" target="_blank" tabindex="0" data-click="{&quot;F&quot;:&quot;77A717EA&quot;,&quot;F1&quot;:&quot;9D73F1E4&quot;,&quot;F2&quot;:&quot;4CA6DE6A&quot;,&quot;F3&quot;:&quot;54E5243F&quot;,&quot;T&quot;:1685453209,&quot;y&quot;:&quot;F7AF7FDB&quot;}" aria-label="" ac_redirectstatus="2">八部:降龙十八掌大战无相劫指,鸠摩智第一次正面吃瘪,精彩</a><!--275--><!--276--></h3><!--272--><div style="margin-bottom: -4px;"><!--278--><!--279--><!--280--><!--281--><!--282--><!--283--></div><div><div class="c-gap-top-small"><!--286--><!--287--><!--288--><span class="c-color-gray2">6天前 </span><!--289--><!--290--><!--291--><span class="content-right_8Zs40">鸠摩智打不赢老子,那就要打<em>小子</em> 斗转星移 <em>火焰</em>刀 参合指 1538 发布时间:20小时前 展现着儿时的梦想 热门推荐 赵一曼之子给毛主席写过“讽刺信”,53岁自缢,手臂上留下三...</span><!--292--><!--293--><div class="c-row source_1Vdff OP_LOG_LINK c-gap-top-xsmall source_s_3aixw "><a href="https://cpu.baidu.com/pc/1022/275122716/detail/126468782734/video?chk=1" target="_blank" class="siteLink_9TPP3" aria-hidden="false" tabindex="0" aria-label="" ac_redirectstatus="2"><!--297--><span class="c-color-gray" aria-hidden="true">cpu.baidu.com/pc/1022/27512271...</span><!--298--></a><!--296--><div class="c-tools tools_47szj" id="tools_5725970965821684629_7" data-tools="{'title': &quot;八部:降龙十八掌大战无相劫指,鸠摩智第一次正面吃瘪,精彩&quot;,
            'url': &quot;http://www.baidu.com/link?url=ioBBtvUAvq0KS4RMfAL29hYdrNwqiwWtoDVXW1rzdo85xIfdp8fl_33Q338SH19bNnGsAcMG2Q8otB2O5090N7J_BjwB3c37ZFyKarAg_-W0OUR7B9ZXmeBuIgOwewRl&quot;}" aria-hidden="true"><i class="c-icon icon_X09BS"></i></div><!--299--><!--300--><!--301--><!--302--><!--303--><!--304--><!--305--><!--306--><!--305--></div><!--294--><!--307--></div><!--285--></div></div><!--308--><div><!--311--><!--312--></div><!--309--></div>
        </div>
					        
				
		
						
	        
        
		

				

		
		                                                                                                            
                                                                                                                                                                                                                                                                                                
                                                                        							
        
        <div class="result c-container xpath-log new-pmd" srcid="1599" id="38" tpl="se_com_default" mu="http://www.pptok.com/fanwen/1659966547409835.html" data-op="{'y':'3FFBFFFD'}" data-click="{&quot;p1&quot;:38,&quot;rsv_bdr&quot;:&quot;&quot;,&quot;rsv_cd&quot;:&quot;&quot;,&quot;fm&quot;:&quot;as&quot;,&quot;p5&quot;:38}" data-cost="{&quot;renderCost&quot;:1,&quot;dataCost&quot;:1}" m-name="aladdin-san/app/se_com_default/result_76dcd8b" m-path="https://pss.bdstatic.com/r/www/cache/static/aladdin-san/app/se_com_default/result_76dcd8b" nr="1" ac_redirectstatus="0">
            <div class="c-container" data-click=""><div has-tts="true"><h3 class="c-title t t tts-title" data-favicon-t="http://www.pptok.com/fanwen/1659966547409835.html"><!--228--><!--229--><a class="
                " href="http://www.pptok.com/fanwen/1659966547409835.html" data-showurl-highlight="true" target="_blank" tabindex="0" data-click="{&quot;F&quot;:&quot;77A717EA&quot;,&quot;F1&quot;:&quot;9D73F1E4&quot;,&quot;F2&quot;:&quot;4CA6DE6A&quot;,&quot;F3&quot;:&quot;54E5243F&quot;,&quot;T&quot;:1685453209,&quot;y&quot;:&quot;3FFBFFFD&quot;}" aria-label="" ac_redirectstatus="2">观步步为赢后有感1300字</a><!--230--><!--231--></h3><!--227--><div style="margin-bottom: -4px;"><!--233--><!--234--><!--235--><!--236--><!--237--><!--238--></div><div><div class="c-gap-top-small"><!--241--><!--242--><!--243--><span class="c-color-gray2">2022年10月21日  </span><!--244--><!--245--><!--246--><span class="content-right_8Zs40">《龙拳<em>小子</em>》观后感:众人拾柴<em>火焰</em>高 就在前不久,我看了一部电影,名叫《龙拳小子》。电影讲述了主人公林秋楠在美国长大,随后带着“超级英雄”梦回到了中国的故...</span><!--247--><!--248--><div class="c-row source_1Vdff OP_LOG_LINK c-gap-top-xsmall source_s_3aixw "><a href="http://www.pptok.com/fanwen/1659966547409835.html" target="_blank" class="siteLink_9TPP3" aria-hidden="false" tabindex="0" aria-label="" ac_redirectstatus="2"><!--252--><span class="c-color-gray" aria-hidden="true">www.pptok.com/fanwen/165996654...</span><!--253--></a><!--251--><div class="c-tools tools_47szj" id="tools_12636410489991545016_8" data-tools="{'title': &quot;观步步为赢后有感1300字&quot;,
            'url': &quot;http://www.baidu.com/link?url=59uhNAQT3pwoX7pL-fG4I7SrlUo_lKUcIJBF3R4sU0jBHTOUyRh-GDDnVYesOf131F6YgbATmKP6Z8HGdmAFJK&quot;}" aria-hidden="true"><i class="c-icon icon_X09BS"></i></div><!--254--><!--255--><!--256--><!--257--><!--258--><!--259--><!--260--><!--261--><!--260--></div><!--249--><div class="tts-button_1V9FA tts tts-site_2MWX0" data-tts-id="09ba382d0b492b3de92c5e370361414f" data-ext="{&quot;source&quot;:&quot;oh5&quot;,&quot;lid&quot;:&quot;e97754e500035aae&quot;,&quot;title&quot;:&quot;%E8%A7%82%E6%AD%A5%E6%AD%A5%E4%B8%BA%E8%B5%A2%E5%90%8E%E6%9C%89%E6%84%9F1300%E5%AD%97&quot;,&quot;url&quot;:&quot;http%3A%2F%2Fwww.pptok.com%2Ffanwen%2F1659966547409835.html&quot;}" data-tts-source-type="default" data-url="http://www.pptok.com/fanwen/1659966547409835.html"><div class="play-tts_neB8h button-wrapper_oe2Vk play-tts"><i class="c-icon"></i><span class="tts-button-text_3ucDJ">播报</span></div><div class="pause-tts_17OBj button-wrapper_oe2Vk pause-tts"><i class="c-icon"></i><span class="tts-button-text_3ucDJ">暂停</span></div></div><!--262--></div><!--240--></div></div><!--264--><div><!--267--><!--268--></div><!--265--></div>
        </div>
					        
				
		
						
	        
        
		

				

		
		                                                                                                            
                                                                                                                                                                                                                                                                    							<div class="result c-container new-pmd" id="39" srcid="1508" tpl="se_st_single_video_zhanzhang" data-click="{&quot;rsv_bdr&quot;:&quot;&quot;,&quot;p5&quot;:39}" ac_redirectstatus="0"><style>.wa-se-st-single-video-zhanzhang-play {
    position: absolute;
    height: 40px;
    width: 40px;
    top: 50%;
    left: 50%;
    margin: -20px 0 0 -20px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpmOWQ4YzVjMi1kMjNiLTQ5ZjEtOWIyNi0wOGY3MmY4MTc1NTMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDc0OTQ3OURGODgzMTFFNUFFQkZEMDZGREMzOTdFMTkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDc0OTQ3OUNGODgzMTFFNUFFQkZEMDZGREMzOTdFMTkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2Y2IwNzk4OC0yYjNiLTQ2MDItYTllMS0zNzI1Yzk5NTZmMmQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6ZjlkOGM1YzItZDIzYi00OWYxLTliMjYtMDhmNzJmODE3NTUzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Rtt+oAAABS5JREFUeNq8mWtIW2cYxxOXpNtUoihYbbxhzMAJ3jMvKxPnZR9Gvawdm2hhWOy+DLzPil91ImzKPq2jH1QQyqBRB4La6izzNi9RQYMzGg3qbCcuc5rNxBj3f9w53WhXzck5xwcekkPO+7y/vO95n9uRnpycSNyQV6Dp0AxoNPQK1AeqYH63Q3+HbkEXoEPQYegx14mkHAEjoGXQd61Wq3N1dXVrcnLy6cTExN74+PjB9vb2Ed0UGBgoT0lJ8UpOTlZqtdqAiIiIK56enh74aRDaCl0VGvAy9AvoOzMzM8uNjY0/63Q6C5d/VlBQ4FtXV/dGQkKCBpePoXegT4QAvAWtnp+fX8/Pz9evra3ZJDwkPDz8UldXV3xMTEwYLr+EfnvW/R5n/CaHtlsslsqampqHsbGx43zhSMgG2aqurn4I2+U0BzMXpxX0hn5nNpt9kpKShnZ2do4kIoifn58cj0xGaGgoHagPofuuANK/6TYajV7R0dHDdrv9RCKiKBQK6cLCQnpkZOQBLvOgR+cBdmDlItVq9YDD4RAVjhWZTCZdWVnJxkoacXnzrGewFM9FIk7a0EXBkdBcNCfNjcvbLwMkV1IJFzK0u7t7JLlgoTkbGhrIoVcyjv+FLW6HK7lMJ8xVozhAyqmpqT0hQWdnZ1PA8JTdanYFyXlezcvL03MxVl9fn4hIcj0kJORVoQDJ1+LjbYbpGeBn09PTy+vr65z9HFbxzbm5udvFxcUqIQCJgViIiQWkwJ9J4ctdo76+vj5tbW2fdHZ2XqUTyReSYckkNgJMR+B3IPxY+Bj1gBQWFmYsLi7ejIuL8+Zji1iIidgIMBM+6BehniGNRhM2MjLyKcKjho8dZErElEGAUQg3vwp5El+HNDU1fdzf3/+eUqmUuWMDzyGd5GgCVI2OjlqE9mtSqVSSnZ39lsFguJWVleXPdTyYKD6rCJB8mVUsBxwUFBTQ29tb2tLSEsdlHMOkJEDFxsaGqJFDDikrK7uGSV32mQyTwuMiw5m3t/drXN0QAdqDg4PlYsMNDAz8hBDWaTKZ/nLlfobJToB7iAaeImYqx62trd/n5OT0HR4eOjlEKGLaI8DNtLQ0HzHg9vf3rSUlJe3l5eWzXMcyTJvkowzIxeLxaRISbnNzczs3N/e+Xq//w53xiYmJAeQOCXAQdev7QsLhtC5gS3uQgDrctQGmICr4aYt/8PLykiHN8eULhtzyBAnDIAr2B3zgiAWFPi3esAfTjnhERTUfOJvNZq+trb1fVFQ04nQ6ef1RhuURsbF+sBV7rqGi2s10/Tcku/eam5uX+e4CCqdLxMK0SJ4lrNQreazT6eK5GlxaWjJptdp7fX19O0I8v93d3cTwI9u/+W8kuQNHGl5VVeVyYO/o6DAg93PZ+Z4nCId+xICvn7+sLqayswxFdNdFV3bUZTAajfnIzr/G5TdnFu6oC8AYeaGFO+Cyw8LCXijc/w+Qso0H1PqIiooaFhuS4JAzsq2PD6CH53W36IaPMOAQkFm09CJvaybm+pPmfB7urPYbdZmuYclXYKCgoqLCX2g4xGd/so05Vpmm0b67DcxSakdQAxOxVW82m218/VxPTw/bwPwKetfdBiYr1AFNh8EnODw3EGeTAco5+6ExNJZskC3JP034u+fWNm400akrSk30Y5SrW5j0tIk+NjZ2gAzm1DWpVCp5amrqaRMdeV2AWq2mJjo1CKiJ3iIRoYn+vLCvIaj6j5L8+xqCDZX0GLCvIQxMXB2WuPEa4m8BBgDXxE/mIU7+4wAAAABJRU5ErkJggg==) no-repeat;
    background-size:40px 40px;
}
.wa-se-st-single-video-zhanzhang-play:hover {
    background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpmOWQ4YzVjMi1kMjNiLTQ5ZjEtOWIyNi0wOGY3MmY4MTc1NTMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDc0OTQ3OTlGODgzMTFFNUFFQkZEMDZGREMzOTdFMTkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDc0OTQ3OThGODgzMTFFNUFFQkZEMDZGREMzOTdFMTkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2Y2IwNzk4OC0yYjNiLTQ2MDItYTllMS0zNzI1Yzk5NTZmMmQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6ZjlkOGM1YzItZDIzYi00OWYxLTliMjYtMDhmNzJmODE3NTUzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+SH0i3gAABTFJREFUeNq8mVlIY1cYx3OTGE0Mneg8VEYRA3VBZYQykVKd4tQ1UnxrcV/wQaO+aNW2oL5YbEerPmlQxBUXfLSiIo4OVFtcKFoXqhYUYUaKVmPVuGXp/7M3YK0zk3tz44FPzsn1nPvLOd/5tjBWq1XEozGQMMgTSCDkEcQD4sY+P4ccQl5D1iELkCUI55cxHAEJ5AtI1OrqqmpmZsY0NzdnQt+yvb1tMRgM14upVCrGz89PHBISIg4PD5dGRERI0Tfg0UvIIAsuKCDtTgEkurGx0dzS0nK5vr5u4fLNAgMDxXl5ebLi4mIJhi8gzewuOwyohRTp9XrX8vLy85OTE146YWtKpZKpra110+l0Fxg2QUb4AkohX09OTsbU19cbR0ZGzCIBW2JioqSkpEQRHR09geH3EBMXQDnku4GBgccZGRlGk8lkFTmhSaVSpqenR5GcnPwbht9AzuwBpJ2r7erqCsvJyTHyvOX231KGEXV0dCiysrLolpff3sm7ACv6+/ufpaWlOR3uJmRvb68iJSVlCsNv3waYODExUa7Vak+cdaxvO27ouTI2NvYHDIdtn4tvmZJCmBHjfcNRo3c2NDQYWXP28C7AQjIlXG6rWq2WCwk5NjZmbmpqkqGru33E3pAe2Cjj6emp3btXVVUV5OXlpaioqFg+ODi4EgLS3d2dga1VoJsBeWXbwc9h68xc4GwNruwRzNFTuDMPIQCJgViIyXbE5PijWltbL/ku6unpqYDuflxaWvqBWCxmHIVkWaKIjQDDyPFvbGxYHFmUwGBwg7q7uz/y9fV1c2QtYiEmYiNADUUlQil6UFDQQ3iHT5KSkt53ZB0wkU4/IcAACpmEvI1QdFllZaWmpqYmRC6Xi/msASbSw0Ca7L2ysmIR2q6Rd4iLi1PDK0UGBwcruc5nmbwJULWzsyM4oK35+Pi819bW9hR+3ZfLPJZJRYBy2DCneg6ZTCYpLCx83Nzc/CFuvIs9c1gmfvrhQLAqw23nZh0oBsO3YpwNNz4+vpWbmzu7v79vl8dhmc4o9jPAbql2d3fNzgBDEGBBDrOCmG+Hyzww0eYZ6M+r0NBQpxz18fHxBbzLL1zhqLFM1754Q6PRSISGwy08QpT80/T09CGf+fDxxLROgPNw9C5Cws3Ozr5OT0//GZDnfNdgmRYIcAnbaQgICHD4mBG6WWGYfy8qKvrVaDTy1mliYRP9JTFbjniZn58vcwTu4uLCVF1dvYBQ6Q9HcxmWhaoQVtuuDVLGT0k1nwX39vZOsejM0NDQnwLYSoatPgzeDPmpVvKCMn6uC66tre0hd55eXl4+FkJ/WYZJW/3mZlZHEXEvMn7R6OioXfqD2/9gcXHx76urK0FcZXx8vAR5CXXTbHWbmxeDPmimcgSlgPYsOD8/fyQUnEQiYejd6OpvFpVu39zhmJiYic7OTjmFS/fV6F1dXV1yhGdU9frxXZUFsj/P77P00d7ersjOzqbSx1eQK3uLR8/7+vpCMjMzz8xms1Mo6ViRw8hTU1OX31Q8epNxpn/8EhOnoLRKrVYruCtMSEiQ4DIq6R0Ylt0FZ28B8zPK9BFsupaVlZ3DQzi0mwqFgqmrq3MrKCi4YC/EMN8C5n/CM7Zm8imVgPV6/eXm5ianNMHf31+s0+lsJWCyc1QCPninjvIsoj9D3voAkcoVTI2ZiuhbW1uWw8PD68U8PDwYtVp9XUSnSCkyMtIF/SM8mhI5qYj+v3mif3+G0JBvZ8GpIuVqc82Qv1iQDTKZIp4/Q/wjwAB2z0yP+KAgHAAAAABJRU5ErkJggg==);
}
.a-se-st-single-video-zhanzhang-play-new {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 32px;
    height: 32px;
    color: #fff;
    font-size: 32px;
    line-height: 32px;
    -webkit-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
}
.a-se-st-single-video-zhanzhang-capsule {
    display: inline-block;
    font-size: 12px;
    line-height: 1;
    padding: 2px 3px;
    color: #4E6EF2;
    border: 1px solid #CDD4FF;
    border-radius: 4px;
    margin-right:4px;
}</style><style>
                .wa-se-st-image_single_video {overflow:hidden;position:relative;}
                .wa-se-st-image_single_video img {height:91px;}</style><h3 class="t" data-favicon-t="baidu.com"><a href="https://quanmin.baidu.com/sv?source=share-h5&amp;pd=qm_share_search&amp;vid=4642478005506908249" target="_blank" data-click="{'F':'77A717EA','F1':'9D73F1E4','F2':'4CA6DD6A','F3':'54E5243F','T':'1685453209','y':'AAFE3EFF'}" ac_redirectstatus="2">这俩<em>小子</em>还行,也算攒点钱了,把面包车钱还回来了,做个<em>火焰</em>腰片-...</a></h3><div class="c-row c-gap-top-small"><a href="https://quanmin.baidu.com/sv?source=share-h5&amp;pd=qm_share_search&amp;vid=4642478005506908249" class="wa-se-st-image_single_video c-span3" style="position:relative;top:2px;" target="_blank" ac_redirectstatus="2"><img src="https://gimg4.baidu.com/poster/src=http%3A%2F%2Ft13.baidu.com%2Fit%2Fu%3D1965428186%2C3612151598%26fm%3D225%26app%3D113%26f%3DJPEG%3Fw%3D1080%26h%3D1429%26s%3DF22004E74A319EDE5425B42D0300D04A&amp;refer=http%3A%2F%2Fwww.baidu.com&amp;app=2004&amp;size=f242,182&amp;n=0&amp;g=0n&amp;q=100?sec=1685539609&amp;t=9e356464f136848bd285d7e274d03682" alt="" class="c-img c-img3 c-img-radius-large" style="height:85px"><i class="c-icon a-se-st-single-video-zhanzhang-play-new"></i>&nbsp;-&nbsp;quanmin.baidu.com</a><div class="c-span9 c-span-last"><font size="-1"><p><span class="a-se-st-single-video-zhanzhang-capsule">视频</span>时长&nbsp;09:51</p><p><span class=" newTimeFactor_before_abs m"><span style="color: #9195A3;">2023年5月11日</span>&nbsp;-&nbsp;</span>本视频由东子爱做饭提供,视频内容为:这俩<em>小子</em>还行,也算攒点钱了,把面包车钱还回来了,做个<em>火焰</em>腰片,有2人点赞,188...</p><div class="g" style="margin-top:2px"><span class="c-showurl">quanmin.baidu.com/sv?source=...</span><div class="c-tools c-gap-left" id="tools_13968033220750083208_39" data-tools="{&quot;title&quot;:&quot;这俩小子还行,也算攒点钱了,把面包车钱还回来了,做个火焰腰片-度...&quot;,&quot;url&quot;:&quot;http://www.baidu.com/link?url=ioBBtvUAvq0KS4RMfAL29hYdrNwqiwWtoDVXW1rzdo7eGMTakTj-aU4S-i9bp2QTTCDzmaBMGpQ1K1p66FH6b8EiwktLlPllPSAHyZbHPwnio5km_pqEjE2_Rt4xGDp3aACQrxXh0ZfjkU0o26U4z_&quot;}"><i class="c-icon f13"></i></div></div></font></div></div></div>
					        
				
		
						
	        
        
		

				

		
		                                                                                                            
                                                                                                                                                                                                                                                                                                
                                                                        							
        
        <div class="result c-container xpath-log new-pmd" srcid="1599" id="40" tpl="se_com_default" mu="https://weibo.com/5531870857/MhZkcaiST" data-op="{'y':'F8FDF3AE'}" data-click="{&quot;p1&quot;:40,&quot;rsv_bdr&quot;:&quot;&quot;,&quot;rsv_cd&quot;:&quot;&quot;,&quot;fm&quot;:&quot;as&quot;,&quot;p5&quot;:40}" data-cost="{&quot;renderCost&quot;:2,&quot;dataCost&quot;:1}" m-name="aladdin-san/app/se_com_default/result_76dcd8b" m-path="https://pss.bdstatic.com/r/www/cache/static/aladdin-san/app/se_com_default/result_76dcd8b" nr="1" ac_redirectstatus="0">
            <div class="c-container" data-click=""><div has-tts="false"><h3 class="c-title t t tts-title" data-favicon-t="https://weibo.com/5531870857/MhZkcaiST"><!--165--><!--166--><a class="
                " href="https://weibo.com/5531870857/MhZkcaiST" data-showurl-highlight="true" target="_blank" tabindex="0" data-click="{&quot;F&quot;:&quot;77A717EA&quot;,&quot;F1&quot;:&quot;9D73F1E4&quot;,&quot;F2&quot;:&quot;4CA6DE6A&quot;,&quot;F3&quot;:&quot;54E5243F&quot;,&quot;T&quot;:1685453209,&quot;y&quot;:&quot;F8FDF3AE&quot;}" aria-label="" ac_redirectstatus="2">//@随心远行吧:就你<em>小子</em>还想当海贼王?... 来自漫游<em>火焰</em> - ...</a><!--167--><!--168--></h3><!--164--><div style="margin-bottom: -4px;"><!--170--><!--171--><!--172--><!--173--><!--174--><!--175--></div><div><!--178--><div class="c-row c-gap-top-middle" aria-hidden="false" aria-label=""><!--180--><div class="c-span3" aria-hidden="false" aria-label=""><!--182--><a href="https://weibo.com/5531870857/MhZkcaiST" target="_blank" ac_redirectstatus="2"><div class="
        image-wrapper_39wYE
        
        
     c-gap-top-mini"><!--184--><!--185--><!--186--><!--187--><!--188--><!--189--><div class="c-img c-img-radius-large  c-img3 compatible_rxApe"><span class="c-img-border c-img-radius-large"></span><img src="https://t7.baidu.com/it/u=2277872180,279493821&amp;fm=218&amp;app=126&amp;size=f242,150&amp;n=0&amp;f=JPEG&amp;fmt=auto?s=EE00448B4856B7E94225C9A803008061&amp;sec=1685552400&amp;t=f01d7ba980a372cf088b671f68083dcb" aria-hidden="false" alt="" aria-label="" style="width: 128px;height: 85px;"></div></div></a><!--182--></div><div class="c-span9 c-span-last" aria-hidden="false" aria-label=""><!--191--><!--192--><!--193--><!--194--><!--195--><!--196--><!--197--><!--198--><!--199--><!--200--><span class="content-right_8Zs40">漫游<em>火焰</em> 22-12-4 08:39 发布于 福建 来自 真我Q2 Pro 轻潮范 //@随心远行吧:《就你<em>小子</em>还想当海贼王?》 @ACG动漫娘 #海贼王# 我感觉这个手办,意境完全变了啊 ​​​​</span><!--201--><!--202--><div class="c-row source_1Vdff OP_LOG_LINK c-gap-top-xsmall "><a href="https://weibo.com/5531870857/MhZkcaiST" target="_blank" class="siteLink_9TPP3" aria-hidden="false" tabindex="0" aria-label="" ac_redirectstatus="2"><!--206--><span class="c-color-gray" aria-hidden="true">微博</span><!--207-->&nbsp;-&nbsp;weibo.com</a><!--205--><div class="c-tools tools_47szj" id="tools_14144506175458363462_10" data-tools="{'title': &quot;//@随心远行吧:就你小子还想当海贼王?...来自漫游火焰-微博&quot;,
            'url': &quot;http://www.baidu.com/link?url=K7JcD7YSw826P7y8dwXG_ZR6gJLNtEycRObW8yBxiyChh6eptIVaRC_vnbM9dhxB&quot;}" aria-hidden="true"><i class="c-icon icon_X09BS"></i></div><!--208--><!--209--><!--210--><!--211--><!--212--><!--213--><!--214--><!--215--><!--214--></div><!--203--><!--216--><!--191--></div><!--180--></div><!--217--><!--218--><!--178--><!--177--></div></div><!--219--><div><!--222--><!--223--></div><!--220--></div>
        </div>
    `

    let y = `                                                                                                            
                                                                                                                                                                                                                                                                                                
                                                                        							
        
        <div class="result c-container xpath-log new-pmd" srcid="1599" id="41" tpl="se_com_default" mu="https://weibo.com/5531870857/MhZkcaiST" data-op="{'y':'F6BC7EDE'}" data-click="{&quot;p1&quot;:41,&quot;rsv_bdr&quot;:&quot;&quot;,&quot;rsv_cd&quot;:&quot;&quot;,&quot;fm&quot;:&quot;as&quot;,&quot;p5&quot;:41}" data-cost="{&quot;renderCost&quot;:1,&quot;dataCost&quot;:1}" m-name="aladdin-san/app/se_com_default/result_76dcd8b" m-path="https://pss.bdstatic.com/r/www/cache/static/aladdin-san/app/se_com_default/result_76dcd8b" nr="1" ac_redirectstatus="0">
            <div class="c-container" data-click=""><div has-tts="false"><h3 class="c-title t t tts-title" data-favicon-t="https://weibo.com/5531870857/MhZkcaiST"><!--667--><!--668--><a class="
                " href="https://weibo.com/5531870857/MhZkcaiST" data-showurl-highlight="true" target="_blank" tabindex="0" data-click="{&quot;F&quot;:&quot;77A717EA&quot;,&quot;F1&quot;:&quot;9D73F1E4&quot;,&quot;F2&quot;:&quot;4CA6DE6A&quot;,&quot;F3&quot;:&quot;54E5243F&quot;,&quot;T&quot;:1685453358,&quot;y&quot;:&quot;F6BC7EDE&quot;}" aria-label="" ac_redirectstatus="2">//@随心远行吧:就你<em>小子</em>还想当海贼王?... 来自漫游<em>火焰</em> - ...</a><!--669--><!--670--></h3><!--666--><div style="margin-bottom: -4px;"><!--672--><!--673--><!--674--><!--675--><!--676--><!--677--></div><div><!--680--><div class="c-row c-gap-top-middle" aria-hidden="false" aria-label=""><!--682--><div class="c-span3" aria-hidden="false" aria-label=""><!--684--><a href="https://weibo.com/5531870857/MhZkcaiST" target="_blank" ac_redirectstatus="2"><div class="
        image-wrapper_39wYE
        
        
     c-gap-top-mini"><!--686--><!--687--><!--688--><!--689--><!--690--><!--691--><div class="c-img c-img-radius-large  c-img3 compatible_rxApe"><span class="c-img-border c-img-radius-large"></span><img src="https://t7.baidu.com/it/u=2277872180,279493821&amp;fm=218&amp;app=126&amp;size=f242,150&amp;n=0&amp;f=JPEG&amp;fmt=auto?s=EE00448B4856B7E94225C9A803008061&amp;sec=1685552400&amp;t=f01d7ba980a372cf088b671f68083dcb" aria-hidden="false" alt="" aria-label="" style="width: 128px;height: 85px;"></div></div></a><!--684--></div><div class="c-span9 c-span-last" aria-hidden="false" aria-label=""><!--693--><!--694--><!--695--><!--696--><!--697--><!--698--><!--699--><!--700--><!--701--><!--702--><span class="content-right_8Zs40">漫游<em>火焰</em> 22-12-4 08:39 发布于 福建 来自 真我Q2 Pro 轻潮范 //@随心远行吧:《就你<em>小子</em>还想当海贼王?》 @ACG动漫娘 #海贼王# 我感觉这个手办,意境完全变了啊 ​​​​</span><!--703--><!--704--><div class="c-row source_1Vdff OP_LOG_LINK c-gap-top-xsmall "><a href="https://weibo.com/5531870857/MhZkcaiST" target="_blank" class="siteLink_9TPP3" aria-hidden="false" tabindex="0" aria-label="" ac_redirectstatus="2"><!--708--><span class="c-color-gray" aria-hidden="true">微博</span><!--709-->&nbsp;-&nbsp;weibo.com</a><!--707--><div class="c-tools tools_47szj" id="tools_14144506175458363462_1" data-tools="{'title': &quot;//@随心远行吧:就你小子还想当海贼王?...来自漫游火焰-微博&quot;,
            'url': &quot;http://www.baidu.com/link?url=dpIxblgwYt9EDhaR76MlFyqmCR7u2kNKmIEpPUzgSFGm2RD8w0ovsPEF8CP75Xum&quot;}" aria-hidden="true"><i class="c-icon icon_X09BS"></i></div><!--710--><!--711--><!--712--><!--713--><!--714--><!--715--><!--716--><!--717--><!--716--></div><!--705--><!--718--><!--693--></div><!--682--></div><!--719--><!--720--><!--680--><!--679--></div></div><!--721--><div><!--724--><!--725--></div><!--722--></div>
        </div>
					        
				
		
						
	        
        
		

				

		
		                                                                                                            
                                                                                                                                                                                                                                                                                                
                                                                        							
        
        <div class="result c-container xpath-log new-pmd" srcid="1599" id="42" tpl="se_com_default" mu="http://film.szonline.net/souluo/20211220/film137994.html" data-op="{'y':'B5EEDF7F'}" data-click="{&quot;p1&quot;:42,&quot;rsv_bdr&quot;:&quot;&quot;,&quot;rsv_cd&quot;:&quot;&quot;,&quot;fm&quot;:&quot;as&quot;,&quot;p5&quot;:42}" data-cost="{&quot;renderCost&quot;:1,&quot;dataCost&quot;:1}" m-name="aladdin-san/app/se_com_default/result_76dcd8b" m-path="https://pss.bdstatic.com/r/www/cache/static/aladdin-san/app/se_com_default/result_76dcd8b" nr="1" ac_redirectstatus="0">
            <div class="c-container" data-click=""><div has-tts="true"><h3 class="c-title t t tts-title" data-favicon-t="http://film.szonline.net/souluo/20211220/film137994.html"><!--622--><!--623--><a class="
                " href="http://film.szonline.net/souluo/20211220/film137994.html" data-showurl-highlight="true" target="_blank" tabindex="0" data-click="{&quot;F&quot;:&quot;77A717EA&quot;,&quot;F1&quot;:&quot;9D73F1E4&quot;,&quot;F2&quot;:&quot;4CA6DE6A&quot;,&quot;F3&quot;:&quot;54E5243F&quot;,&quot;T&quot;:1685453358,&quot;y&quot;:&quot;B5EEDF7F&quot;}" aria-label="" ac_redirectstatus="2">本周上映电影!周冬雨&amp;刘昊然《平原上的<em>火焰</em>》徐峥&amp;amp...</a><!--624--><!--625--></h3><!--621--><div style="margin-bottom: -4px;"><!--627--><!--628--><!--629--><!--630--><!--631--><!--632--></div><div><div class="c-gap-top-small"><!--635--><!--636--><!--637--><span class="c-color-gray2">2021年12月20日  </span><!--638--><!--639--><!--640--><span class="content-right_8Zs40">本周(12.20-12.26)是2021年的第51周,也是倒数第二周,有平安夜圣诞节加持,本周上映新片多达14部,这其中包括张骥执导、周冬雨和刘昊然领衔主演的《平原上的<em>火焰</em>...</span><!--641--><!--642--><div class="c-row source_1Vdff OP_LOG_LINK c-gap-top-xsmall source_s_3aixw "><a href="http://film.szonline.net/souluo/20211220/film137994.html" target="_blank" class="siteLink_9TPP3" aria-hidden="false" tabindex="0" aria-label="" ac_redirectstatus="2"><!--646--><span class="c-color-gray" aria-hidden="true">深圳热线</span><!--647-->&nbsp;-&nbsp;film.szonline.net</a><!--645--><div class="c-tools tools_47szj" id="tools_5650823851450794707_2" data-tools="{'title': &quot;本周上映电影!周冬雨&amp;amp;amp;刘昊然《平原上的火焰》徐峥&amp;amp;amp;马伊琍...&quot;,
            'url': &quot;http://www.baidu.com/link?url=mDhA4HBNTWIchFHisqDNYnqsUtMcyT4upCkwvmmwGNYdvIXq87x1FBIKSRgBwGbcZ42QelSlOh81mfZo5i6gY6_4wshmP19cRMk7QiHfm1m&quot;}" aria-hidden="true"><i class="c-icon icon_X09BS"></i></div><!--648--><!--649--><!--650--><!--651--><!--652--><!--653--><!--654--><!--655--><!--654--></div><!--643--><div class="tts-button_1V9FA tts tts-site_2MWX0" data-tts-id="c30278d171111f22734983fd3ed36448" data-ext="{&quot;source&quot;:&quot;oh5&quot;,&quot;lid&quot;:&quot;8978cea80004086a&quot;,&quot;title&quot;:&quot;%E6%9C%AC%E5%91%A8%E4%B8%8A%E6%98%A0%E7%94%B5%E5%BD%B1%21%E5%91%A8%E5%86%AC%E9%9B%A8%26amp%3B%E5%88%98%E6%98%8A%E7%84%B6%E3%80%8A%E5%B9%B3%E5%8E%9F%E4%B8%8A%E7%9A%84%E7%81%AB%E7%84%B0%E3%80%8B%E5%BE%90%E5%B3%A5%26amp%3B%E9%A9%AC%E4%BC%8A%E7%90%8D...&quot;,&quot;url&quot;:&quot;http%3A%2F%2Ffilm.szonline.net%2Fsouluo%2F20211220%2Ffilm137994.html&quot;}" data-tts-source-type="default" data-url="http://film.szonline.net/souluo/20211220/film137994.html"><div class="play-tts_neB8h button-wrapper_oe2Vk play-tts"><i class="c-icon"></i><span class="tts-button-text_3ucDJ">播报</span></div><div class="pause-tts_17OBj button-wrapper_oe2Vk pause-tts"><i class="c-icon"></i><span class="tts-button-text_3ucDJ">暂停</span></div></div><!--656--></div><!--634--></div></div><!--658--><div><!--661--><!--662--></div><!--659--></div>
        </div>
					        
				
		
						
	        
        
		

				

		
		                                                                                                            
                                                                                                                                                                                                                                                                                                
                                                                        							
        
        <div class="result c-container xpath-log new-pmd" srcid="1599" id="43" tpl="se_com_default" mu="https://mzh.moegirl.org/辐射4/特殊装备获取" data-op="{'y':'1F7FFFBF'}" data-click="{&quot;p1&quot;:43,&quot;rsv_bdr&quot;:&quot;&quot;,&quot;rsv_cd&quot;:&quot;&quot;,&quot;fm&quot;:&quot;as&quot;,&quot;p5&quot;:43}" data-cost="{&quot;renderCost&quot;:1,&quot;dataCost&quot;:0}" m-name="aladdin-san/app/se_com_default/result_76dcd8b" m-path="https://pss.bdstatic.com/r/www/cache/static/aladdin-san/app/se_com_default/result_76dcd8b" nr="1" ac_redirectstatus="0">
            <div class="c-container" data-click=""><div has-tts="false"><h3 class="c-title t t tts-title" data-favicon-t="https://mzh.moegirl.org/%E8%BE%90%E5%B0%844/%E7%89%B9%E6%AE%8A%E8%A3%85%E5%A4%87%E8%8E%B7%E5%8F%96"><!--578--><!--579--><a class="
                " href="https://mzh.moegirl.org/辐射4/特殊装备获取" data-showurl-highlight="true" target="_blank" tabindex="0" data-click="{&quot;F&quot;:&quot;77A717EA&quot;,&quot;F1&quot;:&quot;9D73F1E4&quot;,&quot;F2&quot;:&quot;4CA6DE6A&quot;,&quot;F3&quot;:&quot;54E5243F&quot;,&quot;T&quot;:1685453358,&quot;y&quot;:&quot;1F7FFFBF&quot;}" aria-label="" ac_redirectstatus="2">辐射4/特殊装备获取 - 萌娘百科 万物皆可萌的百科全书</a><!--580--><!--581--></h3><!--577--><div style="margin-bottom: -4px;"><!--583--><!--584--><!--585--><!--586--><!--587--><!--588--></div><div><div class="c-gap-top-small"><!--591--><!--592--><!--593--><span class="c-color-gray2">2023年1月16日  </span><!--594--><!--595--><!--596--><span class="content-right_8Zs40">获得方式:杀死索格斯打铁坊头目矿渣后即可夺取(同时也有小概率在传说级敌人身上刷出有前缀的<em>火焰</em>刀) 瑞芭II 类型:猎枪 传说前缀:驱虫者 获得方式:位于巴尼地堡...</span><!--597--><!--598--><div class="c-row source_1Vdff OP_LOG_LINK c-gap-top-xsmall source_s_3aixw "><a href="https://mzh.moegirl.org/辐射4/特殊装备获取" target="_blank" class="siteLink_9TPP3" aria-hidden="false" tabindex="0" aria-label="" ac_redirectstatus="2"><!--602--><span class="c-color-gray" aria-hidden="true">mzh.moegirl.org/辐射4/特殊装备...</span><!--603--></a><!--601--><div class="c-tools tools_47szj" id="tools_14896985406679799506_3" data-tools="{'title': &quot;辐射4/特殊装备获取-萌娘百科万物皆可萌的百科全书&quot;,
            'url': &quot;http://www.baidu.com/link?url=KY2dP4whTBeXZkiyZs217c-nlD21ZRImp7c3gHL_8IDIJjYeM9paOjjv9lpN5ChNcsqD38VblQuAFF58Tl8LIyeav-6t9vu-0LojvMpew_RMubP5ivLoaPSb8XLFpohsyJk2nm-6MrLL-HGjG6CRpK&quot;}" aria-hidden="true"><i class="c-icon icon_X09BS"></i></div><!--604--><!--605--><!--606--><!--607--><!--608--><!--609--><!--610--><!--611--><!--610--></div><!--599--><!--612--></div><!--590--></div></div><!--613--><div><!--616--><!--617--></div><!--614--></div>
        </div>
					        
				
		
						
	        
        
		

				

		
		                                                                                                            
                                                                                                                                                                                                                                                                                                
                                                                        							
        
        <div class="result c-container xpath-log new-pmd" srcid="1599" id="44" tpl="se_com_default" mu="https://new.qq.com/omn/20221003/20221003A04VPZ00.html" data-op="{'y':'26DB937E'}" data-click="{&quot;p1&quot;:44,&quot;rsv_bdr&quot;:&quot;&quot;,&quot;rsv_cd&quot;:&quot;&quot;,&quot;fm&quot;:&quot;as&quot;,&quot;p5&quot;:44}" data-cost="{&quot;renderCost&quot;:1,&quot;dataCost&quot;:1}" m-name="aladdin-san/app/se_com_default/result_76dcd8b" m-path="https://pss.bdstatic.com/r/www/cache/static/aladdin-san/app/se_com_default/result_76dcd8b" nr="1" ac_redirectstatus="0">
            <div class="c-container" data-click=""><div has-tts="true"><h3 class="c-title t t tts-title" data-favicon-t="https://new.qq.com/omn/20221003/20221003A04VPZ00.html"><!--514--><!--515--><a class="
                " href="https://new.qq.com/omn/20221003/20221003A04VPZ00.html" data-showurl-highlight="true" target="_blank" tabindex="0" data-click="{&quot;F&quot;:&quot;77A717EA&quot;,&quot;F1&quot;:&quot;9D73F1E4&quot;,&quot;F2&quot;:&quot;4CA6DE6A&quot;,&quot;F3&quot;:&quot;54E5243F&quot;,&quot;T&quot;:1685453358,&quot;y&quot;:&quot;26DB937E&quot;}" aria-label="" ac_redirectstatus="2"><em>火焰</em>宣言:法国电影的 “破坏分子”们_腾讯新闻</a><!--516--><!--517--></h3><!--513--><div style="margin-bottom: -4px;"><!--519--><!--520--><!--521--><!--522--><!--523--><!--524--></div><div><!--527--><div class="c-row c-gap-top-middle" aria-hidden="false" aria-label=""><!--529--><div class="c-span3" aria-hidden="false" aria-label=""><!--531--><a href="https://new.qq.com/omn/20221003/20221003A04VPZ00.html" target="_blank" ac_redirectstatus="2"><div class="
        image-wrapper_39wYE
        
        
     c-gap-top-mini"><!--533--><!--534--><!--535--><!--536--><!--537--><!--538--><div class="c-img c-img-radius-large  c-img3 compatible_rxApe"><span class="c-img-border c-img-radius-large"></span><img src="https://t8.baidu.com/it/u=3757372338,948954995&amp;fm=218&amp;app=126&amp;size=f242,150&amp;n=0&amp;f=JPEG&amp;fmt=auto?s=9E8027C62A8E3ACC2C811D6F0300E010&amp;sec=1685552400&amp;t=7ddb36813d0819c46f9625dbe3b7523d" aria-hidden="false" alt="" aria-label="" style="width: 128px;height: 85px;"></div></div></a><!--531--></div><div class="c-span9 c-span-last" aria-hidden="false" aria-label=""><!--540--><!--541--><!--542--><!--543--><span class="c-color-gray2">2022年10月3日  </span><!--544--><!--545--><!--546--><!--547--><!--548--><!--549--><span class="content-right_8Zs40">而《手册》2018年十佳榜首的位置更是给了早已在法国实验短片界耕耘二十年之久,声望卓著的贝特朗·芒蒂格——这位法国“人工美学”新浪潮的领军者,直到去年才完成了自己长片处女作《...</span><!--550--><!--551--><div class="c-row source_1Vdff OP_LOG_LINK c-gap-top-xsmall "><a href="https://new.qq.com/omn/20221003/20221003A04VPZ00.html" target="_blank" class="siteLink_9TPP3" aria-hidden="false" tabindex="0" aria-label="" ac_redirectstatus="2"><!--555--><span class="c-color-gray" aria-hidden="true">腾讯网</span><!--556-->&nbsp;-&nbsp;new.qq.com</a><!--554--><div class="c-tools tools_47szj" id="tools_10594747828853034522_4" data-tools="{'title': &quot;火焰宣言:法国电影的“破坏分子”们_腾讯新闻&quot;,
            'url': &quot;http://www.baidu.com/link?url=nN68LcjwjmDD4kKVnFCknm3iP7QUAwyul44jLx6vAtAXIT8QMLygOZRbpb5e2ZHaeUiudmJK9TMD79_3LSBdka&quot;}" aria-hidden="true"><i class="c-icon icon_X09BS"></i></div><!--557--><!--558--><!--559--><!--560--><!--561--><!--562--><!--563--><!--564--><!--563--></div><!--552--><div class="tts-button_1V9FA tts tts-site_2MWX0" data-tts-id="b605bc69ec9fc62eb51e5a0050a73091" data-ext="{&quot;source&quot;:&quot;oh5&quot;,&quot;lid&quot;:&quot;8978cea80004086a&quot;,&quot;title&quot;:&quot;%E7%81%AB%E7%84%B0%E5%AE%A3%E8%A8%80%3A%E6%B3%95%E5%9B%BD%E7%94%B5%E5%BD%B1%E7%9A%84+%E2%80%9C%E7%A0%B4%E5%9D%8F%E5%88%86%E5%AD%90%E2%80%9D%E4%BB%AC_%E8%85%BE%E8%AE%AF%E6%96%B0%E9%97%BB&quot;,&quot;url&quot;:&quot;https%3A%2F%2Fnew.qq.com%2Fomn%2F20221003%2F20221003A04VPZ00.html&quot;}" data-tts-source-type="default" data-url="https://new.qq.com/omn/20221003/20221003A04VPZ00.html"><div class="play-tts_neB8h button-wrapper_oe2Vk play-tts"><i class="c-icon"></i><span class="tts-button-text_3ucDJ">播报</span></div><div class="pause-tts_17OBj button-wrapper_oe2Vk pause-tts"><i class="c-icon"></i><span class="tts-button-text_3ucDJ">暂停</span></div></div><!--565--><!--540--></div><!--529--></div><!--567--><!--568--><!--527--><!--526--></div></div><!--569--><div><!--572--><!--573--></div><!--570--></div>
        </div>
					        
				
		
						
	        
        
		

				

		
		                                                                                                            
                                                                                                                                                                                                                                                                                                
                                                                        							
        
        <div class="result c-container xpath-log new-pmd" srcid="1599" id="45" tpl="se_com_default" mu="http://yue.sogou.com/chapter/11539441321_378122478570571" data-op="{'y':'EFFB0FF3'}" data-click="{&quot;p1&quot;:45,&quot;rsv_bdr&quot;:&quot;&quot;,&quot;rsv_cd&quot;:&quot;&quot;,&quot;fm&quot;:&quot;as&quot;,&quot;p5&quot;:45}" data-cost="{&quot;renderCost&quot;:1,&quot;dataCost&quot;:1}" m-name="aladdin-san/app/se_com_default/result_76dcd8b" m-path="https://pss.bdstatic.com/r/www/cache/static/aladdin-san/app/se_com_default/result_76dcd8b" nr="1" ac_redirectstatus="0">
            <div class="c-container" data-click=""><div has-tts="true"><h3 class="c-title t t tts-title" data-favicon-t="http://yue.sogou.com/chapter/11539441321_378122478570571"><!--469--><!--470--><a class="
                " href="http://yue.sogou.com/chapter/11539441321_378122478570571" data-showurl-highlight="true" target="_blank" tabindex="0" data-click="{&quot;F&quot;:&quot;77A717EA&quot;,&quot;F1&quot;:&quot;9D73F1E4&quot;,&quot;F2&quot;:&quot;4CA6DE6A&quot;,&quot;F3&quot;:&quot;54E5243F&quot;,&quot;T&quot;:1685453358,&quot;y&quot;:&quot;EFFB0FF3&quot;}" aria-label="" ac_redirectstatus="2">多多看书 - 免费全本小说推荐,好看的小说都在这!</a><!--471--><!--472--></h3><!--468--><div style="margin-bottom: -4px;"><!--474--><!--475--><!--476--><!--477--><!--478--><!--479--></div><div><div class="c-gap-top-small"><!--482--><!--483--><!--484--><!--485--><!--486--><!--487--><span class="content-right_8Zs40">“嗯!我不懂你们人族的情感。看在你<em>小子</em>,对你师父是一片孝心,那我们现在就开始炼丹。”  “你小子按照本花大人说的一步一步做。”  柳叶绷着小脸蛋,不断点着头。  “嗯!”  ...</span><!--488--><!--489--><div class="c-row source_1Vdff OP_LOG_LINK c-gap-top-xsmall source_s_3aixw "><a href="http://yue.sogou.com/chapter/11539441321_378122478570571" target="_blank" class="siteLink_9TPP3" aria-hidden="false" tabindex="0" aria-label="" ac_redirectstatus="2"><!--493--><span class="c-color-gray" aria-hidden="true">多多看书</span><!--494-->&nbsp;-&nbsp;yue.sogou.com</a><!--492--><div class="c-tools tools_47szj" id="tools_6332108550306493734_5" data-tools="{'title': &quot;多多看书-免费全本小说推荐,好看的小说都在这!&quot;,
            'url': &quot;http://www.baidu.com/link?url=mDhA4HBNTWIchFHisqDNYc7moyYj0Xuor0QGZrua_wUPxq9kHjk5Gtu-JkzCsF3TZhLB8v6UNPRZhPG1tFcYTN1egSm57qz3aCQo1JTHiJC&quot;}" aria-hidden="true"><i class="c-icon icon_X09BS"></i></div><!--495--><!--496--><!--497--><!--498--><!--499--><!--500--><!--501--><!--502--><!--501--></div><!--490--><div class="tts-button_1V9FA tts tts-site_2MWX0" data-tts-id="e7a7bd6594ccb307020f4da8189fbac1" data-ext="{&quot;source&quot;:&quot;oh5&quot;,&quot;lid&quot;:&quot;8978cea80004086a&quot;,&quot;title&quot;:&quot;%E5%A4%9A%E5%A4%9A%E7%9C%8B%E4%B9%A6+-+%E5%85%8D%E8%B4%B9%E5%85%A8%E6%9C%AC%E5%B0%8F%E8%AF%B4%E6%8E%A8%E8%8D%90%2C%E5%A5%BD%E7%9C%8B%E7%9A%84%E5%B0%8F%E8%AF%B4%E9%83%BD%E5%9C%A8%E8%BF%99%21&quot;,&quot;url&quot;:&quot;http%3A%2F%2Fyue.sogou.com%2Fchapter%2F11539441321_378122478570571&quot;}" data-tts-source-type="default" data-url="http://yue.sogou.com/chapter/11539441321_378122478570571"><div class="play-tts_neB8h button-wrapper_oe2Vk play-tts"><i class="c-icon"></i><span class="tts-button-text_3ucDJ">播报</span></div><div class="pause-tts_17OBj button-wrapper_oe2Vk pause-tts"><i class="c-icon"></i><span class="tts-button-text_3ucDJ">暂停</span></div></div><!--503--></div><!--481--></div></div><!--505--><div><!--508--><!--509--></div><!--506--></div>
        </div>
					        
				
		
						
	        
        
		

				

		
		                                                                                                            
                                                                                                                                                                                                                                                                                                
                                                                        							
        
        <div class="result c-container xpath-log new-pmd" srcid="1599" id="46" tpl="se_com_default" mu="https://m.qidian.com/book/1014181276/636612058" data-op="{'y':'DFBF7DED'}" data-click="{&quot;p1&quot;:46,&quot;rsv_bdr&quot;:&quot;&quot;,&quot;rsv_cd&quot;:&quot;&quot;,&quot;fm&quot;:&quot;as&quot;,&quot;p5&quot;:46}" data-cost="{&quot;renderCost&quot;:1,&quot;dataCost&quot;:1}" m-name="aladdin-san/app/se_com_default/result_76dcd8b" m-path="https://pss.bdstatic.com/r/www/cache/static/aladdin-san/app/se_com_default/result_76dcd8b" nr="1" ac_redirectstatus="0">
            <div class="c-container" data-click=""><div has-tts="true"><h3 class="c-title t t tts-title" data-favicon-t="https://m.qidian.com/book/1014181276/636612058"><!--424--><!--425--><a class="
                " href="https://m.qidian.com/book/1014181276/636612058" data-showurl-highlight="true" target="_blank" tabindex="0" data-click="{&quot;F&quot;:&quot;77A717EA&quot;,&quot;F1&quot;:&quot;9D73F1E4&quot;,&quot;F2&quot;:&quot;4CA6DD6A&quot;,&quot;F3&quot;:&quot;54E5243F&quot;,&quot;T&quot;:1685453358,&quot;y&quot;:&quot;DFBF7DED&quot;}" aria-label="" ac_redirectstatus="2">精灵之短裤<em>小子</em>_第1214章冬之舞,冬日里的<em>火焰</em>祭!!在线阅读...</a><!--426--><!--427--></h3><!--423--><div style="margin-bottom: -4px;"><!--429--><!--430--><!--431--><!--432--><!--433--><!--434--></div><div><div class="c-gap-top-small"><!--437--><!--438--><!--439--><!--440--><!--441--><!--442--><span class="content-right_8Zs40">起点中文网提供精灵之短裤<em>小子</em>,第1214章冬之舞,冬日里的<em>火焰</em>祭!!在线阅读服务,想看精灵之短裤小子最新章节,欢迎关注起点中文网精灵之短裤小子频道,第一时间阅读精灵之短裤小...</span><!--443--><!--444--><div class="c-row source_1Vdff OP_LOG_LINK c-gap-top-xsmall source_s_3aixw "><a href="https://m.qidian.com/book/1014181276/636612058" target="_blank" class="siteLink_9TPP3" aria-hidden="false" tabindex="0" aria-label="" ac_redirectstatus="2"><!--448--><span class="c-color-gray" aria-hidden="true">起点中文网</span><!--449-->&nbsp;-&nbsp;m.qidian.com</a><!--447--><div class="c-tools tools_47szj" id="tools_15366192144572635438_6" data-tools="{'title': &quot;精灵之短裤小子_第1214章冬之舞,冬日里的火焰祭!!在线阅读-起点...&quot;,
            'url': &quot;http://www.baidu.com/link?url=mDhA4HBNTWIchFHisqDNYmCJ9e1ZhXnohU4GIou9eWFRkgRweDHRyzoWaUiVA6K0hl_c6UPrabbv7rLcAw9Lw27GnzQGbOEM0jjCXcCShbK&quot;}" aria-hidden="true"><i class="c-icon icon_X09BS"></i></div><!--450--><!--451--><!--452--><!--453--><!--454--><!--455--><!--456--><!--457--><!--456--></div><!--445--><div class="tts-button_1V9FA tts tts-site_2MWX0" data-tts-id="fe2623dd67c6f8104fc6faa9dfae51b6" data-ext="{&quot;source&quot;:&quot;oh5&quot;,&quot;lid&quot;:&quot;8978cea80004086a&quot;,&quot;title&quot;:&quot;%E7%B2%BE%E7%81%B5%E4%B9%8B%E7%9F%AD%E8%A3%A4%E5%B0%8F%E5%AD%90_%E7%AC%AC1214%E7%AB%A0%E5%86%AC%E4%B9%8B%E8%88%9E%2C%E5%86%AC%E6%97%A5%E9%87%8C%E7%9A%84%E7%81%AB%E7%84%B0%E7%A5%AD%21%21%E5%9C%A8%E7%BA%BF%E9%98%85%E8%AF%BB-%E8%B5%B7%E7%82%B9...&quot;,&quot;url&quot;:&quot;https%3A%2F%2Fvipreader.qidian.com%2Fchapter%2F1014181276%2F636612058&quot;}" data-tts-source-type="default" data-url="https://vipreader.qidian.com/chapter/1014181276/636612058"><div class="play-tts_neB8h button-wrapper_oe2Vk play-tts"><i class="c-icon"></i><span class="tts-button-text_3ucDJ">播报</span></div><div class="pause-tts_17OBj button-wrapper_oe2Vk pause-tts"><i class="c-icon"></i><span class="tts-button-text_3ucDJ">暂停</span></div></div><!--458--></div><!--436--></div></div><!--460--><div><!--463--><!--464--></div><!--461--></div>
        </div>
					        
				
		
						
	        
        
		

				

		
		                                                                                                            
                                                                                                                                                                                                                                                                                                
                                                                        							
        
        <div class="result c-container xpath-log new-pmd" srcid="1599" id="47" tpl="se_com_default" mu="https://news.17173.com/content/2012-07-20/20120720104226030.shtml" data-op="{'y':'97FFFFFB'}" data-click="{&quot;p1&quot;:47,&quot;rsv_bdr&quot;:&quot;&quot;,&quot;rsv_cd&quot;:&quot;&quot;,&quot;fm&quot;:&quot;as&quot;,&quot;p5&quot;:47}" data-cost="{&quot;renderCost&quot;:2,&quot;dataCost&quot;:1}" m-name="aladdin-san/app/se_com_default/result_76dcd8b" m-path="https://pss.bdstatic.com/r/www/cache/static/aladdin-san/app/se_com_default/result_76dcd8b" nr="1" ac_redirectstatus="0">
            <div class="c-container" data-click=""><div has-tts="true"><h3 class="c-title t t tts-title" data-favicon-t="https://news.17173.com/content/2012-07-20/20120720104226030.shtml"><!--360--><!--361--><a class="
                " href="https://news.17173.com/content/2012-07-20/20120720104226030.shtml" data-showurl-highlight="true" target="_blank" tabindex="0" data-click="{&quot;F&quot;:&quot;77A717EA&quot;,&quot;F1&quot;:&quot;9D73F1E4&quot;,&quot;F2&quot;:&quot;4CA6DE6A&quot;,&quot;F3&quot;:&quot;54E5243F&quot;,&quot;T&quot;:1685453358,&quot;y&quot;:&quot;97FFFFFB&quot;}" aria-label="" ac_redirectstatus="2">《起凡群雄逐鹿》新手必看 英雄成长全面知_网络游戏新闻_1...</a><!--362--><!--363--></h3><!--359--><div style="margin-bottom: -4px;"><!--365--><!--366--><!--367--><!--368--><!--369--><!--370--></div><div><!--373--><div class="c-row c-gap-top-middle" aria-hidden="false" aria-label=""><!--375--><div class="c-span3" aria-hidden="false" aria-label=""><!--377--><a href="https://news.17173.com/content/2012-07-20/20120720104226030.shtml" target="_blank" ac_redirectstatus="2"><div class="
        image-wrapper_39wYE
        
        
     c-gap-top-mini"><!--379--><!--380--><!--381--><!--382--><!--383--><!--384--><div class="c-img c-img-radius-large  c-img3 compatible_rxApe"><span class="c-img-border c-img-radius-large"></span><img src="https://t7.baidu.com/it/u=438382994,87145026&amp;fm=218&amp;app=126&amp;size=f242,150&amp;n=0&amp;f=JPEG&amp;fmt=auto?s=6322DC4F4EE7A04D40C4E03A0300E050&amp;sec=1685552400&amp;t=319242fbff9cc76ee1ca1fa9b53c1a70" aria-hidden="false" alt="" aria-label="" style="width: 128px;height: 85px;"></div></div></a><!--377--></div><div class="c-span9 c-span-last" aria-hidden="false" aria-label=""><!--386--><!--387--><!--388--><!--389--><span class="c-color-gray2">2012年7月20日  </span><!--390--><!--391--><!--392--><!--393--><!--394--><!--395--><span class="content-right_8Zs40">而团战时,使用鹰眼术的侦查技能,马岱可将对方的团队情况摸的一清二楚,敌进我退,敌退我进,森林好<em>小子</em>抑是恐怖的游击战队长。 疯狂<em>火焰</em>术士——贾诩 在三国战场上极具智慧的贾诩同样...</span><!--396--><!--397--><div class="c-row source_1Vdff OP_LOG_LINK c-gap-top-xsmall "><a href="https://news.17173.com/content/2012-07-20/20120720104226030.shtml" target="_blank" class="siteLink_9TPP3" aria-hidden="false" tabindex="0" aria-label="" ac_redirectstatus="2"><!--401--><span class="c-color-gray" aria-hidden="true">17173游戏网</span><!--402-->&nbsp;-&nbsp;news.17173.com</a><!--400--><div class="c-tools tools_47szj" id="tools_2233952844276516061_7" data-tools="{'title': &quot;《起凡群雄逐鹿》新手必看英雄成长全面知_网络游戏新闻_17173...&quot;,
            'url': &quot;http://www.baidu.com/link?url=lSK9sHBPKszCoaFDi-zl68eAGyTYr2hlTxyuvHjS1ZhrjgdMEhOVVEFQMthHKPvBkg9VsEuWmzBNAEUIEJBb0-hOxzNjW6NRkNohnuwwO27&quot;}" aria-hidden="true"><i class="c-icon icon_X09BS"></i></div><!--403--><!--404--><!--405--><!--406--><!--407--><!--408--><!--409--><!--410--><!--409--></div><!--398--><div class="tts-button_1V9FA tts tts-site_2MWX0" data-tts-id="eb40e35c097f2a7b59341cd9e161042b" data-ext="{&quot;source&quot;:&quot;oh5&quot;,&quot;lid&quot;:&quot;8978cea80004086a&quot;,&quot;title&quot;:&quot;%E3%80%8A%E8%B5%B7%E5%87%A1%E7%BE%A4%E9%9B%84%E9%80%90%E9%B9%BF%E3%80%8B%E6%96%B0%E6%89%8B%E5%BF%85%E7%9C%8B+%E8%8B%B1%E9%9B%84%E6%88%90%E9%95%BF%E5%85%A8%E9%9D%A2%E7%9F%A5_%E7%BD%91%E7%BB%9C%E6%B8%B8%E6%88%8F%E6%96%B0%E9%97%BB_17173...&quot;,&quot;url&quot;:&quot;https%3A%2F%2Fnews.17173.com%2Fcontent%2F2012-07-20%2F20120720104226030.shtml&quot;}" data-tts-source-type="default" data-url="https://news.17173.com/content/2012-07-20/20120720104226030.shtml"><div class="play-tts_neB8h button-wrapper_oe2Vk play-tts"><i class="c-icon"></i><span class="tts-button-text_3ucDJ">播报</span></div><div class="pause-tts_17OBj button-wrapper_oe2Vk pause-tts"><i class="c-icon"></i><span class="tts-button-text_3ucDJ">暂停</span></div></div><!--411--><!--386--></div><!--375--></div><!--413--><!--414--><!--373--><!--372--></div></div><!--415--><div><!--418--><!--419--></div><!--416--></div>
        </div>
					        
				
		
						
	        
        
		

				

		
		                                                                                                            
                                                                                                                                                                                                                                                                                                
                                                                        							
        
        <div class="result c-container xpath-log new-pmd" srcid="1599" id="48" tpl="se_com_default" mu="https://upimg.baike.so.com/doc/1277979-28273051.html" data-op="{'y':'CBB2FFFC'}" data-click="{&quot;p1&quot;:48,&quot;rsv_bdr&quot;:&quot;&quot;,&quot;rsv_cd&quot;:&quot;&quot;,&quot;fm&quot;:&quot;as&quot;,&quot;p5&quot;:48}" data-cost="{&quot;renderCost&quot;:1,&quot;dataCost&quot;:0}" m-name="aladdin-san/app/se_com_default/result_76dcd8b" m-path="https://pss.bdstatic.com/r/www/cache/static/aladdin-san/app/se_com_default/result_76dcd8b" nr="1" ac_redirectstatus="0">
            <div class="c-container" data-click=""><div has-tts="false"><h3 class="c-title t t tts-title" data-favicon-t="https://upimg.baike.so.com/doc/1277979-28273051.html"><!--316--><!--317--><a class="
                " href="https://upimg.baike.so.com/doc/1277979-28273051.html" data-showurl-highlight="true" target="_blank" tabindex="0" data-click="{&quot;F&quot;:&quot;77A717EA&quot;,&quot;F1&quot;:&quot;9D73F1E4&quot;,&quot;F2&quot;:&quot;4CA6DE6A&quot;,&quot;F3&quot;:&quot;54E5243F&quot;,&quot;T&quot;:1685453358,&quot;y&quot;:&quot;CBB2FFFC&quot;}" aria-label="" ac_redirectstatus="2">伏特加(动画《电击<em>小子</em>》中的角色)_360百科</a><!--318--><!--319--></h3><!--315--><div style="margin-bottom: -4px;"><!--321--><!--322--><!--323--><!--324--><!--325--><!--326--></div><div><div class="c-gap-top-small"><!--329--><!--330--><!--331--><span class="c-color-gray2">2017年9月13日  </span><!--332--><!--333--><!--334--><span class="content-right_8Zs40">伏特加- 动画《电击<em>小子</em>》中的角色免费编辑修改义项名 所属类别 : 词条暂无分类 伏特加,动画《电击小子》中的角色。天山双煞的老大,武功高强。 基本信息 中文...</span><!--335--><!--336--><div class="c-row source_1Vdff OP_LOG_LINK c-gap-top-xsmall source_s_3aixw "><a href="https://upimg.baike.so.com/doc/1277979-28273051.html" target="_blank" class="siteLink_9TPP3" aria-hidden="false" tabindex="0" aria-label="" ac_redirectstatus="2"><!--340--><span class="c-color-gray" aria-hidden="true">360百科</span><!--341-->&nbsp;-&nbsp;upimg.baike.so.com</a><!--339--><div class="c-tools tools_47szj" id="tools_1059633811478701866_8" data-tools="{'title': &quot;伏特加(动画《电击小子》中的角色)_360百科&quot;,
            'url': &quot;http://www.baidu.com/link?url=I_dMmIYdt8sZkX0RIWjBiidH9yD7DPOULZ1LCBrqgBOM4QwUbn_0KCn28WLd5hYV9SzR-wWiKbMpW_Rrx0esU_&quot;}" aria-hidden="true"><i class="c-icon icon_X09BS"></i></div><!--342--><!--343--><!--344--><!--345--><!--346--><!--347--><!--348--><!--349--><!--348--></div><!--337--><!--350--></div><!--328--></div></div><!--351--><div><!--354--><!--355--></div><!--352--></div>
        </div>
					        
				
		
						
	        
        
		

				

		
		                                                                                                            
                                                                                                                                                                                                                                                                                                
                                                                        							
        
        <div class="result c-container xpath-log new-pmd" srcid="1599" id="49" tpl="se_com_default" mu="https://www.muwuya.com/gonglue/1636343000181866.html" data-op="{'y':'7EDDAE9F'}" data-click="{&quot;p1&quot;:49,&quot;rsv_bdr&quot;:&quot;&quot;,&quot;rsv_cd&quot;:&quot;&quot;,&quot;fm&quot;:&quot;as&quot;,&quot;p5&quot;:49}" data-cost="{&quot;renderCost&quot;:2,&quot;dataCost&quot;:1}" m-name="aladdin-san/app/se_com_default/result_76dcd8b" m-path="https://pss.bdstatic.com/r/www/cache/static/aladdin-san/app/se_com_default/result_76dcd8b" nr="1" ac_redirectstatus="0">
            <div class="c-container" data-click=""><div has-tts="true"><h3 class="c-title t t tts-title" data-favicon-t="https://www.muwuya.com/gonglue/1636343000181866.html"><!--252--><!--253--><a class="
                " href="https://www.muwuya.com/gonglue/1636343000181866.html" data-showurl-highlight="true" target="_blank" tabindex="0" data-click="{&quot;F&quot;:&quot;77A717EA&quot;,&quot;F1&quot;:&quot;9D73F1E4&quot;,&quot;F2&quot;:&quot;4CA6DE6A&quot;,&quot;F3&quot;:&quot;54E5243F&quot;,&quot;T&quot;:1685453358,&quot;y&quot;:&quot;7EDDAE9F&quot;}" aria-label="" ac_redirectstatus="2">口袋妖怪银版攻略看这里!陪伴童年的那些掌机和游戏-木乌鸦</a><!--254--><!--255--></h3><!--251--><div style="margin-bottom: -4px;"><!--257--><!--258--><!--259--><!--260--><!--261--><!--262--></div><div><!--265--><div class="c-row c-gap-top-middle" aria-hidden="false" aria-label=""><!--267--><div class="c-span3" aria-hidden="false" aria-label=""><!--269--><a href="https://www.muwuya.com/gonglue/1636343000181866.html" target="_blank" ac_redirectstatus="2"><div class="
        image-wrapper_39wYE
        
        
     c-gap-top-mini"><!--271--><!--272--><!--273--><!--274--><!--275--><!--276--><div class="c-img c-img-radius-large  c-img3 compatible_rxApe"><span class="c-img-border c-img-radius-large"></span><img src="https://t8.baidu.com/it/u=707422801,344778481&amp;fm=218&amp;app=126&amp;size=f242,150&amp;n=0&amp;f=JPEG&amp;fmt=auto?s=C31212C5958B054944B1158E0300F042&amp;sec=1685552400&amp;t=fb90874b7b0856e958fb550e07f3c892" aria-hidden="false" alt="" aria-label="" style="width: 128px;height: 85px;"></div></div></a><!--269--></div><div class="c-span9 c-span-last" aria-hidden="false" aria-label=""><!--278--><!--279--><!--280--><!--281--><span class="c-color-gray2">2021年11月8日  </span><!--282--><!--283--><!--284--><!--285--><!--286--><!--287--><span class="content-right_8Zs40">解谜<em>小子</em>类似推箱子,地图中还有其他障碍,比如旋转奇形砖,必须保证空格够才可以旋转,游戏设计的不错,可玩性也很好。 20、空手道 这游戏巨难,没记错的话,我连一关都没过去,主要是打击...</span><!--288--><!--289--><div class="c-row source_1Vdff OP_LOG_LINK c-gap-top-xsmall "><a href="https://www.muwuya.com/gonglue/1636343000181866.html" target="_blank" class="siteLink_9TPP3" aria-hidden="false" tabindex="0" aria-label="" ac_redirectstatus="2"><!--293--><span class="c-color-gray" aria-hidden="true">木乌鸦</span><!--294-->&nbsp;-&nbsp;www.muwuya.com</a><!--292--><div class="c-tools tools_47szj" id="tools_15447087547055405467_9" data-tools="{'title': &quot;口袋妖怪银版攻略看这里!陪伴童年的那些掌机和游戏-木乌鸦&quot;,
            'url': &quot;http://www.baidu.com/link?url=I_dMmIYdt8sZkX0RIWjBikvT4U3ACX4SEYkVDI0DSpBLDzthJgPwKRKUYYEmYb871AVOFc-1hhjfVymucsLbU_&quot;}" aria-hidden="true"><i class="c-icon icon_X09BS"></i></div><!--295--><!--296--><!--297--><!--298--><!--299--><!--300--><!--301--><!--302--><!--301--></div><!--290--><div class="tts-button_1V9FA tts tts-site_2MWX0" data-tts-id="5b38dd8b872942337e40ce93118c977c" data-ext="{&quot;source&quot;:&quot;oh5&quot;,&quot;lid&quot;:&quot;8978cea80004086a&quot;,&quot;title&quot;:&quot;%E5%8F%A3%E8%A2%8B%E5%A6%96%E6%80%AA%E9%93%B6%E7%89%88%E6%94%BB%E7%95%A5%E7%9C%8B%E8%BF%99%E9%87%8C%21%E9%99%AA%E4%BC%B4%E7%AB%A5%E5%B9%B4%E7%9A%84%E9%82%A3%E4%BA%9B%E6%8E%8C%E6%9C%BA%E5%92%8C%E6%B8%B8%E6%88%8F-%E6%9C%A8%E4%B9%8C%E9%B8%A6&quot;,&quot;url&quot;:&quot;https%3A%2F%2Fwww.muwuya.com%2Fgonglue%2F1636343000181866.html&quot;}" data-tts-source-type="default" data-url="https://www.muwuya.com/gonglue/1636343000181866.html"><div class="play-tts_neB8h button-wrapper_oe2Vk play-tts"><i class="c-icon"></i><span class="tts-button-text_3ucDJ">播报</span></div><div class="pause-tts_17OBj button-wrapper_oe2Vk pause-tts"><i class="c-icon"></i><span class="tts-button-text_3ucDJ">暂停</span></div></div><!--303--><!--278--></div><!--267--></div><!--305--><!--306--><!--265--><!--264--></div></div><!--307--><div><!--310--><!--311--></div><!--308--></div>
        </div>
					        
				
		
						
	        
        
		

				

		
		                                                                                                            
                                                                                                                                                                                                                                                                                                
                                                                        							
        
        <div class="result c-container xpath-log new-pmd" srcid="1599" id="50" tpl="se_com_default" mu="http://sports.sina.com.cn/o/2006-01-04/09021971598.shtml" data-op="{'y':'BBFC9F6F'}" data-click="{&quot;p1&quot;:50,&quot;rsv_bdr&quot;:&quot;&quot;,&quot;rsv_cd&quot;:&quot;&quot;,&quot;fm&quot;:&quot;as&quot;,&quot;p5&quot;:50}" data-cost="{&quot;renderCost&quot;:1,&quot;dataCost&quot;:1}" m-name="aladdin-san/app/se_com_default/result_76dcd8b" m-path="https://pss.bdstatic.com/r/www/cache/static/aladdin-san/app/se_com_default/result_76dcd8b" nr="1" ac_redirectstatus="0">
            <div class="c-container" data-click=""><div has-tts="true"><h3 class="c-title t t tts-title" data-favicon-t="http://sports.sina.com.cn/o/2006-01-04/09021971598.shtml"><!--207--><!--208--><a class="
                " href="http://sports.sina.com.cn/o/2006-01-04/09021971598.shtml" data-showurl-highlight="true" target="_blank" tabindex="0" data-click="{&quot;F&quot;:&quot;77A717EA&quot;,&quot;F1&quot;:&quot;9D73F1E4&quot;,&quot;F2&quot;:&quot;4CA6DE6A&quot;,&quot;F3&quot;:&quot;54E5243F&quot;,&quot;T&quot;:1685453358,&quot;y&quot;:&quot;BBFC9F6F&quot;}" aria-label="" ac_redirectstatus="2">06体坛十部大片:世界杯地球遭遇足球 姚明巨人行动_综合体...</a><!--209--><!--210--></h3><!--206--><div style="margin-bottom: -4px;"><!--212--><!--213--><!--214--><!--215--><!--216--><!--217--></div><div><div class="c-gap-top-small"><!--220--><!--221--><!--222--><span class="c-color-gray2">2006年1月4日  </span><!--223--><!--224--><!--225--><span class="content-right_8Zs40">3.《青春的<em>火焰</em>》 剧情:女排世锦赛 上映时间、地点:10月16日日本 领衔主演:陈忠和 中国女排手中已经拥有2003年世界杯和2004年奥运会两个冠军头衔了,这次世锦赛...</span><!--226--><!--227--><div class="c-row source_1Vdff OP_LOG_LINK c-gap-top-xsmall source_s_3aixw "><a href="http://sports.sina.com.cn/o/2006-01-04/09021971598.shtml" target="_blank" class="siteLink_9TPP3" aria-hidden="false" tabindex="0" aria-label="" ac_redirectstatus="2"><!--231--><span class="c-color-gray" aria-hidden="true">新浪体育</span><!--232-->&nbsp;-&nbsp;sports.sina.com.cn</a><!--230--><div class="c-tools tools_47szj" id="tools_6028622878039224526_10" data-tools="{'title': &quot;06体坛十部大片:世界杯地球遭遇足球姚明巨人行动_综合体育_NIKE...&quot;,
            'url': &quot;http://www.baidu.com/link?url=mDhA4HBNTWIchFHisqDNYc2C49AzwibPBplpcUO64oHsnYhIDULdbSM9ili2jblo2gxdi20keTxZaY9UVQJDbCRVsCaomiCdhZmJ10-hUOq&quot;}" aria-hidden="true"><i class="c-icon icon_X09BS"></i></div><!--233--><!--234--><!--235--><!--236--><!--237--><!--238--><!--239--><!--240--><!--239--></div><!--228--><div class="tts-button_1V9FA tts tts-site_2MWX0" data-tts-id="b7581c05425e471b7e25dbdb4857ac7e" data-ext="{&quot;source&quot;:&quot;oh5&quot;,&quot;lid&quot;:&quot;8978cea80004086a&quot;,&quot;title&quot;:&quot;06%E4%BD%93%E5%9D%9B%E5%8D%81%E9%83%A8%E5%A4%A7%E7%89%87%3A%E4%B8%96%E7%95%8C%E6%9D%AF%E5%9C%B0%E7%90%83%E9%81%AD%E9%81%87%E8%B6%B3%E7%90%83+%E5%A7%9A%E6%98%8E%E5%B7%A8%E4%BA%BA%E8%A1%8C%E5%8A%A8_%E7%BB%BC%E5%90%88%E4%BD%93%E8%82%B2_NIKE...&quot;,&quot;url&quot;:&quot;http%3A%2F%2Fsports.sina.com.cn%2Fo%2F2006-01-04%2F09021971598.shtml&quot;}" data-tts-source-type="default" data-url="http://sports.sina.com.cn/o/2006-01-04/09021971598.shtml"><div class="play-tts_neB8h button-wrapper_oe2Vk play-tts"><i class="c-icon"></i><span class="tts-button-text_3ucDJ">播报</span></div><div class="pause-tts_17OBj button-wrapper_oe2Vk pause-tts"><i class="c-icon"></i><span class="tts-button-text_3ucDJ">暂停</span></div></div><!--241--></div><!--219--></div></div><!--243--><div><!--246--><!--247--></div><!--244--></div>
        </div>
`

    a.innerHTML = x

})();