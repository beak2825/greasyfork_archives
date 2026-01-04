// ==UserScript==
// @name         无限制阅读经济学人
// @namespace
// @version      3
// @description  让你无弹窗、无限制的阅读经济学人。
// @author       August
// @match        *.economist.com/*
// @require      https://cdn.bootcss.com/jquery/3.5.1/jquery.min.js
// @grant        本脚本仅供学习只用，如若他用，后果自行承担。
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/396846/%E6%97%A0%E9%99%90%E5%88%B6%E9%98%85%E8%AF%BB%E7%BB%8F%E6%B5%8E%E5%AD%A6%E4%BA%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/396846/%E6%97%A0%E9%99%90%E5%88%B6%E9%98%85%E8%AF%BB%E7%BB%8F%E6%B5%8E%E5%AD%A6%E4%BA%BA.meta.js
// ==/UserScript==
$(function() {
    'use strict';
    //let del = ['#_evidon_banner','#amp-regwall','#gpt-ad-slot-regwall','.related-articles','.layout-article-regwall','.ds-layout-grid.ds-layout-grid--edged.newsletter-signup']
    let del = ['.layout-sticky-rail-advert-wrapper','#tp-regwall','#AdBillboard','#gpt-ad-slot-right-rail-r0','#gpt-ad-slot-regwall','#gpt-ad-slot-regwall','.newsletter-signup','#_evidon_banner']

    //广告定时器,去除5个广告或10s后或找不到广告后关闭定时器
    let timer_times = 10
    let ad_times = 5
    let del_ad = false
    let timer1 =  setInterval(() => {
        del.forEach(item => {
            if ($(item)) {
                $(item).remove()
                ad_times--
                del_ad = true
            }
        })
        timer_times--
        if(ad_times == 0|| timer_times ==0 || del_ad == false){
            clearInterval(timer1)
            console.log('广告已关闭')
        }
    }, 1000)


    function addContent(jsonData){
        let para =''
        for(let ii = 0;ii<jsonData.length;ii++){
            switch(jsonData[ii].type){
                case 'text':
                    para += jsonData[ii].data
                    break
                case 'tag':
                    let attr = ''
                    Object.keys( jsonData[ii].attribs).forEach(function(key){
                        attr += ' '+key+'="'+jsonData[ii].attribs[key]+'"'
                    })
                    para += '<' + jsonData[ii].name + attr +'>' + addContent(jsonData[ii].children) + '</' + jsonData[ii].name + '>'
                    break
                default:
                    para += '<u>' + JSON.stringify(jsonData[ii]) + '</u>'
                    break
                }
        }
        return para
    }

    //选取文章元素
    let postQuery = "#content p.article__body-text";
    //选取文章内容Json
    let jsonData = '#__NEXT_DATA__'
    let nextData = $(jsonData)
    let parentNode = '.layout-article-body'

    let timer2 =  setInterval(() => {
        if($(postQuery).length<=2){
            if($(postQuery)){$(postQuery).remove();}//删除文章内容

            //重新填充内容
            if(nextData.length){
                //找出文章内容
                let data = JSON.parse(nextData[0].textContent).props.pageProps.content.text
                let figure_cal =false;
                //开始按规则填充
                let para = ''//新建段落
                for(let i=0;i<data.length;i++){
                    if(data[i].type=='tag'){
                        switch(data[i].name){
                            case 'p':
                                para += '<p class="article__body-text">'+addContent(data[i].children)+'</p>'
                                break;
                            case 'figure':
                                if(data[i].attribs.itemtype == 'https://schema.org/ImageObject')
                                {
                                    for(let ii = 0;ii<data[i].children.length;ii++){
                                        if(data[i].children[ii].name == 'img'){
                                            if(figure_cal){
                                                para+='</div>'
                                                figure_cal=false
                                            }
                                            para += '<div class="article__body-text-image"><figure><div><img src="'+ data[i].children[ii].attribs.src +'"'+'style="/*height:'+data[i].children[ii].attribs.height+'px;width:'+data[i].children[ii].attribs.width+'px*/"'+'></div></figure>'
                                            figure_cal=true
                                        }
                                    }
                                }
                                break;
                            case 'h2':
                                para += '<h2>'+addContent(data[i].children)+'</h2>'
                                break;
                            default:
                                para += '<'+data[i].name+'>'+addContent(data[i].children)+'</'+data[i].name+'>'+'>'
                                break;
                        }
                    }
                }
                if(figure_cal){
                    para+='</div>'
                    figure_cal=false
                }
                $(parentNode).append(para)
            }
            clearInterval(timer2)
            console.log("脚本运行完毕")
        }
    }, 1000)
})