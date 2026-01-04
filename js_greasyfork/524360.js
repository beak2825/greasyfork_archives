// ==UserScript==
// @name         妇幼辅助脚本
// @namespace    http://tampermonkey.net/
// @version      v1.0
// @description  妇幼系统自动化填写功能，有问题者请联系本人！
// @author       Andy陆锐佳
// @match        https://10.130.20.249:8661/fyweb/*
// @match        https://fybj.newhealth.com.cn:8661/*
// @icon         https://www.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524360/%E5%A6%87%E5%B9%BC%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/524360/%E5%A6%87%E5%B9%BC%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //添加按钮
    var buttonCount = 4
    var name = ['常规体检','高危儿专案','贫血专案','营养不良专案']

    for (var i = 0; i < buttonCount; i++) {
        var button = document.createElement('button');
        button.innerText = name[i]; // 设置按钮文本
        button.id = i + 'a'
        button.style.width = '100px'; // 设置宽度为100像素
        button.style.height = '25px'; // 设置高度为50像素
        document.body.appendChild(button);
        document.body.insertBefore(button, document.body.firstChild)
    }



    //let zd = document.querySelector('.ivu-input-wrapper.ivu-input-wrapper-default.ivu-input-type-textarea textarea[placeholder="请输入"]')



    //一般体检
    let button0 = document.getElementById('0a')


    // 为按钮添加点击事件监听器（一般体检）
    button0.addEventListener('click', function(){


        //展开其他指导
        let guidance = document.querySelectorAll('.guidance-hidden')
        guidance[1].style.display = 'block'


        let yueling = document.querySelectorAll('.ivu-select-selected-value') //定位月龄
        let guduzheng = document.getElementById('edit-examination-medical-5') //孤独症按钮
        let gdzspan = guduzheng.querySelectorAll('span') //孤独症列表


        let focus = new Event('focus')//文字聚焦
        let input = new Event('input')//文字聚焦
        let blur = new Event('blur')//文字聚焦




        let checkboxkexueweiyang = document.querySelectorAll('.ivu-checkbox-input') //所有勾选框


        let qitazhidao = document.querySelector('.ivu-input-wrapper.ivu-input-wrapper-default.ivu-input-type-textarea textarea[placeholder="请输入"]')//其他指导


        let gdzyouwu = document.querySelectorAll('.ivu-select-item') //孤独症的无和有，也包括其他小 Li，可以用在评价有无异常


        let ertongbiaoji = 0 //儿童标记
        let xuanpingjia = 0 //体格评价
        let pingjiayc = 0 //评价是否异常
        let biaojiquanwu = 0 //没有标记
        let chaozhongfeipan = 0 //第二个超重和肥胖

        let shuimian = document.querySelectorAll('.ivu-form-item-label')//总睡眠时间——标签，也可用于营养素和辅食添加
//---------确定是否高危儿--------
        let c7 = 0
        for(let i = 0;i<shuimian.length;i++){
            if(shuimian[i].textContent.includes("高危儿")){
                c7 = i
                break
            }
        }
        let parentgwe = shuimian[c7].parentNode
        let gwe = parentgwe.querySelector('span')

        let c8 = 0
        for(let i = 0;i<shuimian.length;i++){
            if(shuimian[i].textContent.includes("早产儿")){
                c8 = i
                break
            }
        }
        let parentzcr = shuimian[c8].parentNode
        let zcr = parentzcr.querySelector('span')

        let c9 = 0
        for(let i = 0;i<shuimian.length;i++){
            if(shuimian[i].textContent.includes("低出生体重")){
                c9 = i
                break
            }
        }
        let parentdtz = shuimian[c9].parentNode
        let dtz = parentdtz.querySelector('span')


        let highrisk = document.querySelectorAll('.highriskSpan')
        let highrisktext = ''
        if(highrisk.length === 2){
            highrisktext = highrisk[0].textContent + highrisk[1].textContent
        }else if(highrisk.length === 1){
            highrisktext = highrisk[0].textContent
        }


//---------确定是否高危儿--------


        //点击生成评价
        let shengchengpingjia = document.querySelectorAll('.ivu-btn.ivu-btn-success span')
        for(let i = 0; i < shengchengpingjia.length; i++){
            if(shengchengpingjia[i].textContent.includes('生成评价')){
                let scpj = shengchengpingjia[i].parentNode
                scpj.click()
                break
            }
        }

        //评价有无异常
        for(let i = 0; i < checkboxkexueweiyang.length; i++){
            if(checkboxkexueweiyang[i].labels[0].innerText.includes('无') && checkboxkexueweiyang[i+1].labels[0].innerText.includes('贫血') && checkboxkexueweiyang[i+2].labels[0].innerText.includes('肥胖') && checkboxkexueweiyang[i+3].labels[0].innerText.includes('低体重')){
                ertongbiaoji = i
                break
            }
        }
        for(let i = 0; i<gdzyouwu.length;i++){
            if(gdzyouwu[i].textContent.includes('正常') && gdzyouwu[i+1].textContent.includes('低体重') && gdzyouwu[i+2].textContent.includes('消瘦') && gdzyouwu[i+3].textContent.includes('生长迟缓') && gdzyouwu[i+4].textContent.includes('超重') ){
                xuanpingjia = i
                break
            }
        }
        for(let i = xuanpingjia; i<gdzyouwu.length;i++){
            if(gdzyouwu[i].textContent.includes('未见异常') && gdzyouwu[i+1].textContent.includes('异常')){
                pingjiayc = i
                break
            }
        }


        setTimeout(function(){

            if(checkboxkexueweiyang[ertongbiaoji+2].checked == true || checkboxkexueweiyang[ertongbiaoji+16].checked == true ){ //肥胖和超重

                gdzyouwu[xuanpingjia+4].click()
                gdzyouwu[pingjiayc+1].click()
          
            } else if(checkboxkexueweiyang[ertongbiaoji+3].checked == true ){ //低体重
                    gdzyouwu[xuanpingjia+1].click()
                    gdzyouwu[pingjiayc+1].click()

            }else if(checkboxkexueweiyang[ertongbiaoji+4].checked == true ){ //生长迟缓
                    gdzyouwu[xuanpingjia+3].click()
                    gdzyouwu[pingjiayc+1].click()

            }else if(checkboxkexueweiyang[ertongbiaoji+5].checked == true ){ //消瘦
                    gdzyouwu[xuanpingjia+2].click()
                    gdzyouwu[pingjiayc+1].click()
            }

            if(checkboxkexueweiyang[ertongbiaoji+2].checked == true){
                setTimeout(function(){
                    let chaozhongfeipanli = document.querySelectorAll('li')
                    for(let i = 1; i<chaozhongfeipanli.length;i++){
                        if(chaozhongfeipanli[i].textContent.includes('超重') && chaozhongfeipanli[i+1].textContent.includes('肥胖')){
                            chaozhongfeipan = i+1
                        }
                    }
                    chaozhongfeipanli[chaozhongfeipan].click()
                },100)
            }


        },300)


        setTimeout(function(){
            for(let i = ertongbiaoji; i <= ertongbiaoji + 18; i++){ //儿童标记全无
                if(checkboxkexueweiyang[i].checked !== true){
                    biaojiquanwu++
                }

                if(biaojiquanwu == 18){
                    setTimeout(function(){
                        checkboxkexueweiyang[ertongbiaoji].click()
                    },300)
                    setTimeout(function(){
                        gdzyouwu[xuanpingjia].click()
                    },200)
                    setTimeout(function(){
                        gdzyouwu[pingjiayc].click()
                    },100)
                    break
                }
            }
        },500)


        //勾选科学喂养

        let a = 0
        let b = 0
        for(let i = 0; i < checkboxkexueweiyang.length; i++){
            if(checkboxkexueweiyang[i].labels[0].innerText.includes('定期进行眼健康检查，发现异常应时就诊')){
                a = i
            }
            if(checkboxkexueweiyang[i].labels[0].innerText.includes('多互动交流，练习俯卧抬头、拉坐')){
                b = i
                break //获取了B值后直接结束
            }
        }
        //console.log(a)
        //console.log(b)
        setTimeout(function(){
            //全选科学喂养
            for(let i = a+1; i < b; i++){
                if(checkboxkexueweiyang[i].checked !== true){
                    setTimeout(function(){
                        checkboxkexueweiyang[i].click()
                    },200*(i-a+1)) //每一秒勾选一次
                }
            }
        },700)


        //其他指导必须勾选
        setTimeout(function(){
            if(checkboxkexueweiyang[b+5].checked !== true){
                setTimeout(function(){
                    checkboxkexueweiyang[b+5].click()//儿童定期体检后进行预防接种b+5
                },200)
            }

            if(checkboxkexueweiyang[b+8].checked !== true){
                setTimeout(function(){
                    checkboxkexueweiyang[b+8].click()//儿童须专人看护，不能脱离看护人的视野b+8
                },300)
            }

            if(checkboxkexueweiyang[b+9].checked !== true){
                setTimeout(function(){
                    checkboxkexueweiyang[b+9].click()//睡觉时，儿童嘴巴和鼻子在被子外面b+9
                },400)
            }

        },900)



        //中医饮食调养指导
        setTimeout(function(){
            for(let i = 0; i < checkboxkexueweiyang.length; i++){
                if(checkboxkexueweiyang[i].labels[0].innerText.includes('中医饮食调养指导')){
                    if(checkboxkexueweiyang[i-4].checked !== true){
                        setTimeout(function(){
                            checkboxkexueweiyang[i-4].click()
                        },200) //每一秒勾选一次 //深圳指导 - 饮食指导
                    }
                    for(let i1 = i; i1 <= i+2; i1++){
                        if(checkboxkexueweiyang[i1].checked !== true){
                            setTimeout(function(){
                                checkboxkexueweiyang[i1].click()
                            },300*(i1-i+1)) //每一秒勾选一次
                        }
                    }

                    //如果i + 2 = 捏脊，定位i - 3
                    //如果i + 2 = 三足里，定位 i - 2
                    //如果i + 2 = 四神聪，定位 i - 1
                    if(checkboxkexueweiyang[i+2].labels[0].innerText.includes('传授摩腹、捏脊方法')){
                        if(checkboxkexueweiyang[i-3].checked !== true){
                            setTimeout(function(){
                                checkboxkexueweiyang[i-3].click()
                            },1100) //每一秒勾选一次 //深圳指导 - 捏脊
                        }
                        break
                    }else if(checkboxkexueweiyang[i+2].labels[0].innerText.includes('按揉迎香穴、足三里穴方法')){
                        if(checkboxkexueweiyang[i-2].checked !== true){
                            setTimeout(function(){
                                checkboxkexueweiyang[i-2].click()
                            },1200) //每一秒勾选一次 //深圳指导 - 足三里
                        }
                        break
                    }else if(checkboxkexueweiyang[i+2].labels[0].innerText.includes('按揉四神聪穴方法')){
                        if(checkboxkexueweiyang[i-1].checked !== true){
                            setTimeout(function(){
                                checkboxkexueweiyang[i-1].click()
                            },1300) //每一秒勾选一次 //深圳指导 - 四神聪
                        }
                        break
                    }
                    break
                }
            }
        },1500)





        //选定月龄
        setTimeout(function(){
            for(let i = 0; i< yueling.length; i++){
                //判断月龄
                if (yueling[i].textContent.includes('满月龄')) {
                    qitazhidao.value = '1月：①继续母乳喂养,母乳不足时添加配方奶；母亲补钙每日1000-1200mg。②维生素AD 每天1粒,户外活动1-2小时/天(间断性),避免阳光照射眼睛 ,婴儿抚触，被动体操, 视觉训练、听觉训练、视听结合训练、俯卧抬头（空腹）。③眼保健：眼外观无异常，双眼红光反射正常，下次体检3月龄。'
                    qitazhidao.dispatchEvent(focus)
                    qitazhidao.dispatchEvent(input)
                    qitazhidao.dispatchEvent(blur)

                    if(checkboxkexueweiyang[b].checked !== true){
                        checkboxkexueweiyang[b].click() //多互动交流，练习俯卧抬头、拉坐
                    }

                    break
                }else if(yueling[i].textContent.includes('3月龄')){
                    qitazhidao.value = '①回应式喂养，按需喂养逐渐转为按时喂养，母乳不足时添加配方奶；母亲补钙每日1000-1200mg；②宝宝补充维生素AD 每天1粒，户外活动1小时（间断性，避免阳光直接照射皮肤及眼睛）； ③拉坐训练、抬头、主动翻身；主动抓握、看图说话、注视寻找、逗笑游戏训练，蛙式抱。④眼保健：眼外观无异常。下次体检时间：6个月龄。'
                    qitazhidao.dispatchEvent(focus)
                    qitazhidao.dispatchEvent(input)
                    qitazhidao.dispatchEvent(blur)

                    if(checkboxkexueweiyang[b+1].checked !== true){
                        checkboxkexueweiyang[b+1].click() //多互动交流，练习俯卧抬头、翻身
                    }

                    break
                }else if(yueling[i].textContent.includes('6月龄')){
                    qitazhidao.value = '①顺应喂养，坚持母乳喂养，不足时添加配方奶粉，奶：5-6次/天，800-1000ml/天，从铁强化米糊开始，逐步添加蛋黄、肝泥及猪肉泥、牛肉泥等动物性食品，用勺喂，补充营养包，辅食不加调味品；②继续补充维生素AD 每天1粒；③训练坐稳、爬行、手指捏东西、语言动作联系训练。晚上9点半前入睡，渐断夜奶 。④眼保健：眼外观无异常、双眼红光反射正常，下次体检8月龄。 '
                    qitazhidao.dispatchEvent(focus)
                    qitazhidao.dispatchEvent(input)
                    qitazhidao.dispatchEvent(blur)

                    if(checkboxkexueweiyang[b+2].checked !== true){
                        checkboxkexueweiyang[b+2].click() //多互动交流，练习独坐、抓握
                    }

                    if(checkboxkexueweiyang[b+16].checked !== true){
                        setTimeout(function(){
                            checkboxkexueweiyang[b+16].click()//可以使用磨牙饼干或磨牙棒
                        },200) //每一秒勾选一次
                    }

                    break
                }else if(yueling[i].textContent.includes('18月龄')){
                    qitazhidao.value = '①顺应喂养，按时喂养，鼓励自己进食。奶：500-600ml/天②主食3餐：均衡膳食，食物多样化，每天食物4种以上：蔬菜及藻类、新鲜水果、蛋类（1个/天）、鱼虾肉、瘦畜禽肉等、肝脏、豆腐适量③维生素AD 每天1粒，户外活动2小时以上④加强平衡训练，跑、跳、爬楼梯，加强语言训练，一种语言，父母语速要慢。给予讲故事、讲儿歌，练习搭积木、穿串珠，颜色、形状认知。⑤ 晚上9点半前入睡，每天总睡眠时间11.5-13个小时。⑥眼保健：眼外观无异常，本次孤独症筛查结果正常。下次体检2岁'
                    qitazhidao.dispatchEvent(focus)
                    qitazhidao.dispatchEvent(input)
                    qitazhidao.dispatchEvent(blur)

                    if(checkboxkexueweiyang[b+6].checked !== true){
                        setTimeout(function(){
                            checkboxkexueweiyang[b+6].click()//经常洗手，勤开窗通风
                        },150) //每一秒勾选一次
                    }

                    if(checkboxkexueweiyang[b+7].checked !== true){
                        setTimeout(function(){
                            checkboxkexueweiyang[b+7].click()//加强儿童体格锻炼，合理膳食，充足睡眠
                        },150*2) //每一秒勾选一次
                    }

                    if(checkboxkexueweiyang[b+17].checked !== true){
                        setTimeout(function(){
                            checkboxkexueweiyang[b+17].click()////建议儿童18个月后停止使用奶瓶
                        },150*3) //每一秒勾选一次
                    }

                    if(checkboxkexueweiyang[b+10].checked !== true){
                        setTimeout(function(){
                            checkboxkexueweiyang[b+10].click()////花生米瓜子豌豆等捣碎后喂给儿童
                        },150*4) //每一秒勾选一次
                    }
                    if(checkboxkexueweiyang[b+11].checked !== true){
                        setTimeout(function(){
                            checkboxkexueweiyang[b+11].click()////装有热水的容器、电源插座和药品等放在儿童接触不到的地方
                        },150*5) //每一秒勾选一次
                    }
                    if(checkboxkexueweiyang[b+12].checked !== true){
                        setTimeout(function(){
                            checkboxkexueweiyang[b+12].click()////酒精、汽油等放在儿童接触不到的地方
                        },150*6) //每一秒勾选一次
                    }
                    if(checkboxkexueweiyang[b+13].checked !== true){
                        setTimeout(function(){
                            checkboxkexueweiyang[b+13].click()////看护人陪同儿童在马路边和水边
                        },150*7) //每一秒勾选一次
                    }


                    //打开孤独症筛查
                   // setTimeout(function(){
                     //   for(let i = 0; i<gdzspan.length;i++){
                       //     if(gdzspan[i].className == 'ivu-checkbox-inner'){
                           //     setTimeout(function(){
                              //     gdzspan[i].click()
                            //    },300)
                          //  }
                      //  }},800)

                    break
                }else if(yueling[i].textContent.includes('12月龄')){
                    qitazhidao.value = '①奶类500-600ml 培养自主进食，主食3餐：均衡膳食，食物多样化，每天食物4种以上：蔬菜及藻类、新鲜水果、蛋类（1个/天）、鱼虾肉、瘦畜禽肉等、肝脏、豆腐适量 ②维生素AD 每天1粒 户外活动2小时以上 回避过敏食物，③多练习滚球、独走、搭积木、翻书、盖瓶盖。练习指家中的物品，指鼻子、眼睛、耳朵等身体部位，有意识地拍手欢迎，叫“爸爸”、“妈妈”等家庭成员。晚上9点半前入睡④眼保健：眼外观无异常，下次体检1岁半。'
                    qitazhidao.dispatchEvent(focus)
                    qitazhidao.dispatchEvent(input)
                    qitazhidao.dispatchEvent(blur)

                    if(checkboxkexueweiyang[b+4].checked !== true){
                        setTimeout(function(){
                            checkboxkexueweiyang[b+4].click()//多互动交流，练习扶站、独站、扶走、独走
                        },200)//每一秒勾选一次
                    }

                    if(checkboxkexueweiyang[b+6].checked !== true){
                        setTimeout(function(){
                            checkboxkexueweiyang[b+6].click()//经常洗手，勤开窗通风
                        },200*2) //每一秒勾选一次
                    }
                    if(checkboxkexueweiyang[b+7].checked !== true){
                        setTimeout(function(){
                            checkboxkexueweiyang[b+7].click()//加强儿童体格锻炼，合理膳食，充足睡眠
                        },200*3) //每一秒勾选一次
                    }
                    if(checkboxkexueweiyang[b+14].checked !== true){
                        setTimeout(function(){
                            checkboxkexueweiyang[b+14].click()//幼儿期尽量不用安抚奶嘴
                        },200*4) //每一秒勾选一次
                    }

                    if(checkboxkexueweiyang[b+10].checked !== true){
                        setTimeout(function(){
                            checkboxkexueweiyang[b+10].click()////花生米瓜子豌豆等捣碎后喂给儿童
                        },150*4) //每一秒勾选一次
                    }
                    if(checkboxkexueweiyang[b+11].checked !== true){
                        setTimeout(function(){
                            checkboxkexueweiyang[b+11].click()////装有热水的容器、电源插座和药品等放在儿童接触不到的地方
                        },150*5) //每一秒勾选一次
                    }
                    if(checkboxkexueweiyang[b+12].checked !== true){
                        setTimeout(function(){
                            checkboxkexueweiyang[b+12].click()////酒精、汽油等放在儿童接触不到的地方
                        },150*6) //每一秒勾选一次
                    }
                    if(checkboxkexueweiyang[b+13].checked !== true){
                        setTimeout(function(){
                            checkboxkexueweiyang[b+13].click()////看护人陪同儿童在马路边和水边
                        },150*7) //每一秒勾选一次
                    }
                  
                    break
                }else if(yueling[i].textContent.includes('8月龄')){
                    qitazhidao.value = '①奶4-5次/天，700-800ml/天，2餐其他末状食物、手指食物，每天食物4种以上：肉类、蛋、豆类和坚果、水果蔬菜等，辅食不加调味品；②继续补充维生素AD 每天1粒；③扶站、扶行、手膝爬行及拉起蹲下、手指捏东西、投物进容器等训练。晚上9点半前入睡，眼保健：眼外观无异常，下次体检12月龄  '
                    qitazhidao.dispatchEvent(focus)
                    qitazhidao.dispatchEvent(input)
                    qitazhidao.dispatchEvent(blur)

                    if(checkboxkexueweiyang[b+2].checked !== true){
                        checkboxkexueweiyang[b+3].click() //多互动交流，练习爬行、抓握
                    }

                    if(checkboxkexueweiyang[b+16].checked !== true){
                        setTimeout(function(){
                            checkboxkexueweiyang[b+16].click()//可以使用磨牙饼干或磨牙棒
                        },200) //每一秒勾选一次
                    }

                    break
                }else if(yueling[i].textContent.includes('24月龄')){
                    qitazhidao.value = '①维生素AD 每天1粒，每天奶量300-400毫升，饮水总量1500毫升左右，晒太阳1-2小时／天（间断性），②主食3餐：均衡膳食，食物多样化，每天食物4种以上：蔬菜及藻类、新鲜水果、蛋类（1个/天）、鱼虾肉、瘦畜禽肉等、肝脏、豆腐适量。③加强早教，防止意外伤害。模仿画画；练习双脚跳、单脚站立；培养自己洗手、脱穿衣和如厕等生活能力；学认颜色、形状、大小；多与其讲故事、念儿歌，叙述简单的事情；与小朋友做游戏，学会等待、顺序、分享、同情等社会规则。④晚上9:30前入睡。眼保健：眼外观无异常。下次体检2岁半'
                    qitazhidao.dispatchEvent(focus)
                    qitazhidao.dispatchEvent(input)
                    qitazhidao.dispatchEvent(blur)


                    if(checkboxkexueweiyang[b+6].checked !== true){
                        setTimeout(function(){
                            checkboxkexueweiyang[b+6].click()//经常洗手，勤开窗通风
                        },200) //每一秒勾选一次
                    }

                    if(checkboxkexueweiyang[b+7].checked !== true){
                        setTimeout(function(){
                            checkboxkexueweiyang[b+7].click()//加强儿童体格锻炼，合理膳食，充足睡眠
                        },200*2) //每一秒勾选一次
                    }

                    if(checkboxkexueweiyang[b+18].checked !== true){
                        setTimeout(function(){
                            checkboxkexueweiyang[b+18].click()//当多颗牙齿萌出后，家长可为幼儿每天刷牙2次。3岁以后，用 “画圈法”刷牙
                        },200*3) //每一秒勾选一次
                    }

                    if(checkboxkexueweiyang[b+10].checked !== true){
                        setTimeout(function(){
                            checkboxkexueweiyang[b+10].click()////花生米瓜子豌豆等捣碎后喂给儿童
                        },150*4) //每一秒勾选一次
                    }
                    if(checkboxkexueweiyang[b+11].checked !== true){
                        setTimeout(function(){
                            checkboxkexueweiyang[b+11].click()////装有热水的容器、电源插座和药品等放在儿童接触不到的地方
                        },150*5) //每一秒勾选一次
                    }
                    if(checkboxkexueweiyang[b+12].checked !== true){
                        setTimeout(function(){
                            checkboxkexueweiyang[b+12].click()////酒精、汽油等放在儿童接触不到的地方
                        },150*6) //每一秒勾选一次
                    }
                    if(checkboxkexueweiyang[b+13].checked !== true){
                        setTimeout(function(){
                            checkboxkexueweiyang[b+13].click()////看护人陪同儿童在马路边和水边
                        },150*7) //每一秒勾选一次
                    }

                    //打开孤独症筛查
                   // setTimeout(function(){
                       // for(let i = 0; i<gdzspan.length;i++){
                        //    if(gdzspan[i].className == 'ivu-checkbox-inner'){
                           //     setTimeout(function(){
                           //        gdzspan[i].click()
                           //     },300)
                        //    }
                      //  }
                  //  },800)

                    break
                }else if(yueling[i].textContent.includes('30月龄')){
                    qitazhidao.value = '①维生素AD 每天1粒，每天奶量300-400毫升，饮水总量1500毫升左右，晒太阳1-2小时／天（间断性）。②主食3餐：均衡膳食，食物多样化，每天食物4种以上：蔬菜及藻类、新鲜水果、蛋类（1个/天）、鱼虾肉、瘦畜禽肉等、肝脏、豆腐适量。③加强早教，模仿画画；练习双脚跳、单脚站立；培养自己洗手、脱穿衣和如厕等生活能力；学认颜色、形状、大小；多与其讲故事、念儿歌，叙述简单的事情；与小朋友做游戏，学会等待、顺序、分享、同情等社会规则。④防止意外伤害。加强体格锻炼，培养良好的生活行为习惯，晚上9点半前入睡，眼保健：眼外观无异常。下次体检3岁'
                    qitazhidao.dispatchEvent(focus)
                    qitazhidao.dispatchEvent(input)
                    qitazhidao.dispatchEvent(blur)

                    if(checkboxkexueweiyang[b+6].checked !== true){
                        setTimeout(function(){
                            checkboxkexueweiyang[b+6].click()//经常洗手，勤开窗通风
                        },200*2) //每一秒勾选一次
                    }

                    if(checkboxkexueweiyang[b+7].checked !== true){
                        setTimeout(function(){
                            checkboxkexueweiyang[b+7].click()//加强儿童体格锻炼，合理膳食，充足睡眠
                        },200*3) //每一秒勾选一次
                    }

                    if(checkboxkexueweiyang[b+18].checked !== true){
                        setTimeout(function(){
                            checkboxkexueweiyang[b+18].click()//当多颗牙齿萌出后，家长可为幼儿每天刷牙2次。3岁以后，用 “画圈法”刷牙
                        },200*4) //每一秒勾选一次
                    }

                    if(checkboxkexueweiyang[b+10].checked !== true){
                        setTimeout(function(){
                            checkboxkexueweiyang[b+10].click()////花生米瓜子豌豆等捣碎后喂给儿童
                        },150*4) //每一秒勾选一次
                    }
                    if(checkboxkexueweiyang[b+11].checked !== true){
                        setTimeout(function(){
                            checkboxkexueweiyang[b+11].click()////装有热水的容器、电源插座和药品等放在儿童接触不到的地方
                        },150*5) //每一秒勾选一次
                    }
                    if(checkboxkexueweiyang[b+12].checked !== true){
                        setTimeout(function(){
                            checkboxkexueweiyang[b+12].click()////酒精、汽油等放在儿童接触不到的地方
                        },150*6) //每一秒勾选一次
                    }
                    if(checkboxkexueweiyang[b+13].checked !== true){
                        setTimeout(function(){
                            checkboxkexueweiyang[b+13].click()////看护人陪同儿童在马路边和水边
                        },150*7) //每一秒勾选一次
                    }

                    break
                }else if(yueling[i].textContent.includes('3岁')){
                    qitazhidao.value = '3岁以上：维生素D 每天1粒，每天饮奶300-400毫升，饮水总量1500毫升左右，主食3餐：均衡膳食，每天食物4种以上：蔬菜及藻类、新鲜水、蛋类、鱼虾肉、瘦畜禽肉等、肝脏、豆腐适量、营养包。加强早教：模仿画画；单脚站立；培养自己洗手、脱穿衣和如厕等生活能力；学认颜色、形状、大小；多与其讲故事、念儿歌，叙述简单的事情；与小朋友做游戏，学会等待、顺序、分享、同情等社会规则；防止意外伤害。加强体格锻炼，培养良好的生活行为习惯，注意口腔清洁，预防龋齿。晚上9点半前入睡，眼保健：眼外观无异常。'
                    qitazhidao.dispatchEvent(focus)
                    qitazhidao.dispatchEvent(input)
                    qitazhidao.dispatchEvent(blur)

                    if(checkboxkexueweiyang[b+6].checked !== true){
                        setTimeout(function(){
                            checkboxkexueweiyang[b+6].click()//经常洗手，勤开窗通风
                        },200*2) //每一秒勾选一次
                    }

                    if(checkboxkexueweiyang[b+7].checked !== true){
                        setTimeout(function(){
                            checkboxkexueweiyang[b+7].click()//加强儿童体格锻炼，合理膳食，充足睡眠
                        },200*5) //每一秒勾选一次
                    }

                    if(checkboxkexueweiyang[b+18].checked !== true){
                        setTimeout(function(){
                            checkboxkexueweiyang[b+18].click()//当多颗牙齿萌出后，家长可为幼儿每天刷牙2次。3岁以后，用 “画圈法”刷牙
                        },200*3) //每一秒勾选一次
                    }
                    if(checkboxkexueweiyang[b+19].checked !== true){
                        setTimeout(function(){
                            checkboxkexueweiyang[b+19].click()//当多颗牙齿萌出后，家长可为幼儿每天刷牙2次。3岁以后，用 “画圈法”刷牙
                        },200*4) //每一秒勾选一次
                    }

                    if(checkboxkexueweiyang[b+10].checked !== true){
                        setTimeout(function(){
                            checkboxkexueweiyang[b+10].click()////花生米瓜子豌豆等捣碎后喂给儿童
                        },150*4) //每一秒勾选一次
                    }
                    if(checkboxkexueweiyang[b+11].checked !== true){
                        setTimeout(function(){
                            checkboxkexueweiyang[b+11].click()////装有热水的容器、电源插座和药品等放在儿童接触不到的地方
                        },150*5) //每一秒勾选一次
                    }
                    if(checkboxkexueweiyang[b+12].checked !== true){
                        setTimeout(function(){
                            checkboxkexueweiyang[b+12].click()////酒精、汽油等放在儿童接触不到的地方
                        },150*6) //每一秒勾选一次
                    }
                    if(checkboxkexueweiyang[b+13].checked !== true){
                        setTimeout(function(){
                            checkboxkexueweiyang[b+13].click()////看护人陪同儿童在马路边和水边
                        },150*7) //每一秒勾选一次
                    }
                    break
                }

            }

        },3000)


        //深圳指导 已选定月龄
        setTimeout(function(){
            for(let i = 0; i < checkboxkexueweiyang.length; i++){
                if(checkboxkexueweiyang[i].labels[0].innerText.includes('增加鱼肝油、日光浴空气浴')){

                    if(checkboxkexueweiyang[i].checked !== true){
                            checkboxkexueweiyang[i].click()//增加鱼肝油、日光浴空气浴
                    }

                    for(let i1 = 0; i1< yueling.length; i1++){

                        if(yueling[i1].textContent.includes('满月龄')) {
                            if(checkboxkexueweiyang[i+6].checked !== true){
                                setTimeout(function(){
                                    checkboxkexueweiyang[i+6].click()//坚持母乳喂养，不足时添加配方奶
                                },150) //每一秒勾选一次
                            }
                            if(checkboxkexueweiyang[i+7].checked !== true){
                                setTimeout(function(){
                                    checkboxkexueweiyang[i+7].click()//加强母婴交流
                                },300) //每一秒勾选一次
                            }
                            if(checkboxkexueweiyang[i+14].checked !== true){
                                setTimeout(function(){
                                    checkboxkexueweiyang[i+14].click()//多晒太阳、被动体操
                                },450) //每一秒勾选一次
                            }
                            if(checkboxkexueweiyang[i+17].checked !== true){
                                setTimeout(function(){
                                    checkboxkexueweiyang[i+17].click()//训练俯卧抬头
                                },600) //每一秒勾选一次
                            }
                            if(checkboxkexueweiyang[i+19].checked !== true){
                                setTimeout(function(){
                                    checkboxkexueweiyang[i+19].click()//中医饮食调养指导
                                },750) //每一秒勾选一次
                            }




                            console.log('满月龄')
                            break
                        }else if(yueling[i1].textContent.includes('3月龄')) {

                            if(checkboxkexueweiyang[i+6].checked !== true){
                                setTimeout(function(){
                                    checkboxkexueweiyang[i+6].click()//坚持母乳喂养，不足时添加配方奶
                                },150) //每一秒勾选一次
                            }
                            if(checkboxkexueweiyang[i+7].checked !== true){
                                setTimeout(function(){
                                    checkboxkexueweiyang[i+7].click()//加强母婴交流
                                },300) //每一秒勾选一次
                            }
                            if(checkboxkexueweiyang[i+14].checked !== true){
                                setTimeout(function(){
                                    checkboxkexueweiyang[i+14].click()//多晒太阳、被动体操
                                },450) //每一秒勾选一次
                            }
                            if(checkboxkexueweiyang[i+17].checked !== true){
                                setTimeout(function(){
                                    checkboxkexueweiyang[i+17].click()//训练俯卧抬头
                                },600) //每一秒勾选一次

                            if(checkboxkexueweiyang[i+19].checked !== true){
                                setTimeout(function(){
                                    checkboxkexueweiyang[i+19].click()//中医饮食调养指导
                                },750) //每一秒勾选一次
                            }


                                console.log('3月龄')
                            }
                            break
                        }else if(yueling[i1].textContent.includes('6月龄')) {
                            if(checkboxkexueweiyang[i+6].checked !== true){
                                setTimeout(function(){
                                    checkboxkexueweiyang[i+6].click()//坚持母乳喂养，不足时添加配方奶
                                },200) //每一秒勾选一次
                            }
                            if(checkboxkexueweiyang[i+7].checked !== true){
                                setTimeout(function(){
                                    checkboxkexueweiyang[i+7].click()//加强母婴交流
                                },400) //每一秒勾选一次
                            }
                            if(checkboxkexueweiyang[i+1].checked !== true){
                                setTimeout(function(){
                                    checkboxkexueweiyang[i+1].click()//逐渐添加蛋黄
                                },600) //每一秒勾选一次
                            }
                            console.log('6月龄')
                            break
                        }else if(yueling[i1].textContent.includes('18月龄')) {
                            if(checkboxkexueweiyang[i+2].checked !== true){
                                setTimeout(function(){
                                    checkboxkexueweiyang[i+2].click()//加强亲子交流
                                },200) //每一秒勾选一次
                            }
                            if(checkboxkexueweiyang[i+5].checked !== true){
                                setTimeout(function(){
                                    checkboxkexueweiyang[i+5].click()//注意膳食搭配，蛋白质和新鲜蔬菜供应
                                },400) //每一秒勾选一次
                            }
                            if(checkboxkexueweiyang[i+9].checked !== true){
                                setTimeout(function(){
                                    checkboxkexueweiyang[i+9].click()//注意膳食搭配，四肢协调运动
                                },600) //每一秒勾选一次
                            }
                            if(checkboxkexueweiyang[i+16].checked !== true){
                                setTimeout(function(){
                                    checkboxkexueweiyang[i+16].click()//正确指导幼儿刷牙
                                },800) //每一秒勾选一次
                            }
                            console.log('18月龄')
                            break
                        }else if(yueling[i1].textContent.includes('12月龄')) {
                            if(checkboxkexueweiyang[i+2].checked !== true){
                                setTimeout(function(){
                                    checkboxkexueweiyang[i+2].click()//加强亲子交流
                                },200) //每一秒勾选一次
                            }
                            if(checkboxkexueweiyang[i+5].checked !== true){
                                setTimeout(function(){
                                    checkboxkexueweiyang[i+5].click()//注意膳食搭配，蛋白质和新鲜蔬菜供应
                                },400) //每一秒勾选一次
                            }
                            if(checkboxkexueweiyang[i+8].checked !== true){
                                setTimeout(function(){
                                    checkboxkexueweiyang[i+8].click()//适量配方奶+独走
                                },600) //每一秒勾选一次
                            }
                            if(checkboxkexueweiyang[i+9].checked !== true){
                                setTimeout(function(){
                                    checkboxkexueweiyang[i+9].click()//注意膳食搭配，四肢协调运动
                                },800) //每一秒勾选一次
                            }
                            if(checkboxkexueweiyang[i+10].checked !== true){
                                setTimeout(function(){
                                    checkboxkexueweiyang[i+10].click()//饮食多样化，防治偏食挑食
                                },1000) //每一秒勾选一次
                            }
                            console.log('12月龄')
                            break
                        }else if(yueling[i1].textContent.includes('8月龄')) {
                            if(checkboxkexueweiyang[i+7].checked !== true){
                                setTimeout(function(){
                                    checkboxkexueweiyang[i+7].click()//加强母婴交流
                                },200) //每一秒勾选一次
                            }
                            if(checkboxkexueweiyang[i+6].checked !== true){
                                setTimeout(function(){
                                    checkboxkexueweiyang[i+6].click()//坚持母乳喂养，不足时添加配方奶
                                },400) //每一秒勾选一次
                            }
                            if(checkboxkexueweiyang[i+3].checked !== true){
                                setTimeout(function(){
                                    checkboxkexueweiyang[i+3].click()//逐渐添加菜泥，米粉等
                                },600) //每一秒勾选一次
                            }
                            console.log('8月龄')

                            break
                        }else if(yueling[i1].textContent.includes('24月龄')) {
                            if(checkboxkexueweiyang[i+2].checked !== true){
                                setTimeout(function(){
                                    checkboxkexueweiyang[i+2].click()//加强亲子交流
                                },200) //每一秒勾选一次
                            }
                            if(checkboxkexueweiyang[i+11].checked !== true){
                                setTimeout(function(){
                                    checkboxkexueweiyang[i+11].click()//注意口腔清洁
                                },200*2) //每一秒勾选一次
                            }
                            if(checkboxkexueweiyang[i+16].checked !== true){
                                setTimeout(function(){
                                    checkboxkexueweiyang[i+16].click()//正确指导幼儿刷牙
                                },200*3) //每一秒勾选一次
                            }
                            console.log('24月龄')

                            break
                        }else if(yueling[i1].textContent.includes('30月龄')) {
                            if(checkboxkexueweiyang[i+2].checked !== true){
                                setTimeout(function(){
                                    checkboxkexueweiyang[i+2].click()//加强亲子交流
                                },200) //每一秒勾选一次
                            }
                            if(checkboxkexueweiyang[i+11].checked !== true){
                                setTimeout(function(){
                                    checkboxkexueweiyang[i+11].click()//注意口腔清洁
                                },200*2) //每一秒勾选一次
                            }
                            if(checkboxkexueweiyang[i+13].checked !== true){
                                setTimeout(function(){
                                    checkboxkexueweiyang[i+13].click()//加强户外运动
                                },200*3) //每一秒勾选一次
                            }
                            if(checkboxkexueweiyang[i+16].checked !== true){
                                setTimeout(function(){
                                    checkboxkexueweiyang[i+16].click()//正确指导幼儿刷牙
                                },200*4) //每一秒勾选一次
                            }
                            console.log('30月龄')
                            break
                        }else if(yueling[i1].textContent.includes('3岁')) {
                            if(checkboxkexueweiyang[i+2].checked !== true){
                                setTimeout(function(){
                                    checkboxkexueweiyang[i+2].click()//加强亲子交流
                                },200) //每一秒勾选一次
                            }
                            if(checkboxkexueweiyang[i+11].checked !== true){
                                setTimeout(function(){
                                    checkboxkexueweiyang[i+11].click()//注意口腔清洁
                                },200*2) //每一秒勾选一次
                            }
                            if(checkboxkexueweiyang[i+13].checked !== true){
                                setTimeout(function(){
                                    checkboxkexueweiyang[i+13].click()//加强户外运动
                                },200*3) //每一秒勾选一次
                            }
                            if(checkboxkexueweiyang[i+16].checked !== true){
                                setTimeout(function(){
                                    checkboxkexueweiyang[i+16].click()//正确指导幼儿刷牙
                                },200*4) //每一秒勾选一次
                            }
                            console.log('3岁')
                            break
                        }

                    }
                }
            }},5000)


        //眼保健
        setTimeout(function(){
            let yanbaojian = document.getElementById('edit-examination-medical-6')
            let ybjspan = yanbaojian.querySelectorAll('span')
            for(let i = 0; i<ybjspan.length;i++){
                if(ybjspan[i].className == 'ivu-checkbox-inner'){
                    setTimeout(function(){
                        ybjspan[i].click()
                    },200) //每一秒勾选一次
                    break
                }
            }
        },7000)




        setTimeout(function(){
            let ybj1 = document.querySelectorAll('.ivu-checkbox-input') //这个是勾选出来后才出现的内容
            for(let i = 0; i <ybj1.length-1; i = i + 1){
                if(ybj1[i].labels[0].innerText.includes('开启基本公卫眼保健项目')){
                    if(ybj1[i].checked !== true){
                        ybj1[i].click()//开启基本公卫眼保健项目
                    }
                    break
                }
            }
        },10000)




               //孤独症‘有’‘无’
        setTimeout(function(){
            let gdzyouwu = document.querySelectorAll('li') //孤独症的无和有，也包括其他小 Li，可以用在评价有无异常
            for(let i = 0; i<gdzyouwu.length;i++){
                if(gdzyouwu[i].textContent.includes('无') && gdzyouwu[i+1].textContent.includes('有') && gdzyouwu[i+3].textContent.includes('无') && gdzyouwu[i+4].textContent.includes('有') && gdzyouwu[i+6].textContent.includes('无') && gdzyouwu[i+7].textContent.includes('有') && gdzyouwu[i+9].textContent.includes('无') && gdzyouwu[i+10].textContent.includes('有')){
                    setTimeout(function(){
                        gdzyouwu[i].click()
                    },100)
                    setTimeout(function(){
                        gdzyouwu[i+3].click()
                    },200)
                    setTimeout(function(){
                        gdzyouwu[i+6].click()
                    },300)
                    setTimeout(function(){
                        gdzyouwu[i+9].click()
                    },400)

                   //打开孤独症筛查
                    setTimeout(function(){
                        for(let i = 0; i<gdzspan.length;i++){
                            if(gdzspan[i].className == 'ivu-checkbox-inner'){
                                setTimeout(function(){
                                   gdzspan[i+1].click()
                                },200)
                            }
                        }},500)

                    break
                }else if(gdzyouwu[i].textContent.includes('无') && gdzyouwu[i+1].textContent.includes('有') && gdzyouwu[i+3].textContent.includes('无') && gdzyouwu[i+4].textContent.includes('有') && gdzyouwu[i+6].textContent.includes('无') && gdzyouwu[i+7].textContent.includes('有')){
                    setTimeout(function(){
                        gdzyouwu[i].click()
                    },100)
                    setTimeout(function(){
                        gdzyouwu[i+3].click()
                    },200)
                    setTimeout(function(){
                        gdzyouwu[i+6].click()
                    },300)

                    break
                }else if(gdzyouwu[i].textContent.includes('无') && gdzyouwu[i+1].textContent.includes('有') && gdzyouwu[i+3].textContent.includes('无') && gdzyouwu[i+4].textContent.includes('有')){
                    setTimeout(function(){
                        gdzyouwu[i].click()
                    },100)
                    setTimeout(function(){
                        gdzyouwu[i+3].click()
                    },200)
                    break
                }
            }
        },11000)





        //获取账号医生名字
        let userdiv = document.querySelector('.user')
        let use = userdiv.querySelectorAll('span')
        let yisheng = use[1].textContent

        //填写医生名字
        //let jianchayisheng = document.querySelector('.ivu-select-input[placeholder="检查医生"]')
        //jianchayisheng.click()
        setTimeout(function(){
            let liall = document.querySelectorAll('li')
            let ci = 0
            for(let i = 0;i<liall.length;i++){
                if(liall[i].textContent.includes(yisheng)){
                    ci++
                    setTimeout(function(){
                        liall[i].click()

                    },200*ci)

                }
            }
        },9000)


       //回到一般体检项目
        

        let c1 = 0
        for(let i = 0;i<shuimian.length;i++){
            if(shuimian[i].textContent.includes("服用维生素D")){
                c1 = i
                break
            }
        }
        let parentwd = shuimian[c1].parentNode
        let wd = parentwd.querySelectorAll('input')

        let c2 = 0
        for(let i = 0;i<shuimian.length;i++){
            if(shuimian[i].textContent.includes("户外活动")){
                c2 = i
                break
            }
        }
        let parenthd = shuimian[c2].parentNode
        let hd = parenthd.querySelectorAll('input')



        let litj = document.querySelectorAll('li')

        let c3 = 0
        for(let i = 0;i<litj.length;i++){
                if(litj[i].textContent.includes("本次") && litj[i+1].textContent.includes("近期检查") && litj[i+2].textContent.includes("拒绝检查")){
                    c3 = i //本次
                    break
                }
            }
        //辅食添加
        let c5 = 0
        for(let i = 0;i<litj.length;i++){
            if(litj[i].textContent.includes("已开始") && litj[i+1].textContent.includes("未开始") ){
                c5 = i //已开始
                break
            }
        }

        //喂养情况
        let c51 = 0
        for(let i = 0;i<litj.length;i++){
            if(litj[i].textContent.includes("良好") && litj[i+1].textContent.includes("需指导") ){
                c51 = i //已开始
                break
            }
        }


        //月龄
        let c4 = 0
        for(let i = 0;i<shuimian.length;i++){
            if(shuimian[i].textContent.includes("一般体检类型")){
                c4 = i
                break
            }
        }
        let parentyl = shuimian[c4].parentNode
        let yl = parentyl.querySelector('.ivu-select-selected-value')


        let c41 = 0
        for(let i = 0;i<shuimian.length;i++){
            if(shuimian[i].textContent.includes("体检阶段")){
                c41 = i
                break
            }
        }
        let parentyl1 = shuimian[c41].parentNode
        let yl1 = parentyl1.querySelector('.ivu-select-selected-value')




        let c6 = 0
        for(let i = 0;i<shuimian.length;i++){
            if(shuimian[i].textContent.includes('添加辅食次数')){
                c6 = i
                break
            }
        }
        let parentfs = shuimian[c6].parentNode
        let fs = parentfs.querySelectorAll('input')


        let c11 = 0
        for(let i = 0;i<litj.length;i++){
                if(litj[i].textContent.includes("闭合") && litj[i+1].textContent.includes("未闭")){
                    c11 = i //囟门闭合
                    break
                }
            }

        setTimeout(function(){
            let liybj = document.querySelectorAll('li')
            //满月龄眼保健操
            let c12 = 0
            for(let i = 0;i<liybj.length;i++){
                if(liybj[i].textContent.includes("出院后7天内眼保健") && liybj[i+1].textContent.includes("出生后28~30天眼保健") && liybj[i+2].textContent.includes("3月龄眼保健") ){
                    c12 = i //已开始
                    break
                }
            }
            setTimeout(function(){
                if(yl.textContent.includes('满月龄')) {
                    liybj[c12+1].click() //满月龄眼保健

                }
            },100)

            setTimeout(function(){
                if(yl1.textContent.includes('满月龄')) {
                    liybj[c12+1].click() //满月龄眼保健

                }
            },100)

        },7500)


        setTimeout(function(){


            wd[0].value = '400'
            wd[0].dispatchEvent(focus)
            wd[0].dispatchEvent(input)
            wd[0].dispatchEvent(blur)

            hd[0].value = '2'
            hd[0].dispatchEvent(focus)
            hd[0].dispatchEvent(input)
            hd[0].dispatchEvent(blur)




            setTimeout(function(){
                if(yl.textContent.includes('6月龄')) {
                    litj[c3].click()
                    litj[c5].click()//辅食已开始
                    litj[c11+1].click()//囟门未闭

                    fs[0].value = '2'
                    fs[0].dispatchEvent(focus)
                    fs[0].dispatchEvent(input)
                    fs[0].dispatchEvent(blur)

                }else if(yl.textContent.includes('18月龄')) {
                    litj[c3].click()
                    litj[c11].click()//囟门未闭

                }else if(yl.textContent.includes('8月龄')) {
                    litj[c3].click()
                    litj[c5].click()//辅食已开始
                    litj[c11+1].click()//囟门未闭



                    fs[0].value = '3'
                    fs[0].dispatchEvent(focus)
                    fs[0].dispatchEvent(input)
                    fs[0].dispatchEvent(blur)

                }else if(yl.textContent.includes('30月龄')) {
                    litj[c3].click()

                }else if(yl.textContent.includes('24月龄')) {
                    litj[c11].click()//囟门闭合

                }else if(yl.textContent.includes('12月龄')) {
                    litj[c11+1].click()//囟门未闭

                }else if(yl.textContent.includes('3月龄')) {
                    litj[c11+1].click()//囟门未闭
                    litj[c5+1].click()//辅食未开始

                    if(zcr.textContent.includes("是") || dtz.textContent.includes("是")){
                        wd[0].value = '800'
                        wd[0].dispatchEvent(focus)
                        wd[0].dispatchEvent(input)
                        wd[0].dispatchEvent(blur)
                    }

                    fs[0].value = '0'
                    fs[0].dispatchEvent(focus)
                    fs[0].dispatchEvent(input)
                    fs[0].dispatchEvent(blur)

                }else if(yl.textContent.includes('满月龄')) {
                    if(zcr.textContent.includes("是") || dtz.textContent.includes("是")){
                        wd[0].value = '800'
                        wd[0].dispatchEvent(focus)
                        wd[0].dispatchEvent(input)
                        wd[0].dispatchEvent(blur)
                    }


                    litj[c11+1].click()//囟门未闭
                    litj[c5+1].click()//辅食未开始
                    litj[c51+1].click()//喂养情况


                    hd[0].value = '0'
                    hd[0].dispatchEvent(focus)
                    hd[0].dispatchEvent(input)
                    hd[0].dispatchEvent(blur)

                    fs[0].value = '0'
                    fs[0].dispatchEvent(focus)
                    fs[0].dispatchEvent(input)
                    fs[0].dispatchEvent(blur)

                }
            },200)

            setTimeout(function(){
                if(yl1.textContent.includes('6月龄')) {
                    litj[c3].click()
                    litj[c5].click()//辅食已开始
                    litj[c11+1].click()//囟门未闭

                    fs[0].value = '2'
                    fs[0].dispatchEvent(focus)
                    fs[0].dispatchEvent(input)
                    fs[0].dispatchEvent(blur)

                }else if(yl1.textContent.includes('18月龄')) {
                    litj[c3].click()
                    litj[c11].click()//囟门未闭

                }else if(yl1.textContent.includes('8月龄')) {
                    litj[c3].click()
                    litj[c5].click()//辅食已开始
                    litj[c11+1].click()//囟门未闭



                    fs[0].value = '3'
                    fs[0].dispatchEvent(focus)
                    fs[0].dispatchEvent(input)
                    fs[0].dispatchEvent(blur)

                }else if(yl1.textContent.includes('30月龄')) {
                    litj[c3].click()

                }else if(yl1.textContent.includes('24月龄')) {
                    litj[c11].click()//囟门闭合

                }else if(yl1.textContent.includes('12月龄')) {
                    litj[c11+1].click()//囟门未闭

                }else if(yl1.textContent.includes('3月龄')) {
                    litj[c11+1].click()//囟门未闭
                    litj[c5+1].click()//辅食未开始

                    fs[0].value = '0'
                    fs[0].dispatchEvent(focus)
                    fs[0].dispatchEvent(input)
                    fs[0].dispatchEvent(blur)

                }else if(yl1.textContent.includes('满月龄')) {
                    litj[c11+1].click()//囟门未闭
                    litj[c5+1].click()//辅食未开始

                    fs[0].value = '0'
                    fs[0].dispatchEvent(focus)
                    fs[0].dispatchEvent(input)
                    fs[0].dispatchEvent(blur)

                }
            },200)




        },12000)


        //高危儿自动点击

        let button1 = document.getElementById('1a')

        setTimeout(function(){

            if(gwe.textContent.includes("是") || highrisktext.includes("II类")){
                setTimeout(function(){
                    if(yl.textContent.includes('满月龄') || yl.textContent.includes('3月龄') || yl.textContent.includes('6月龄') || yl.textContent.includes('12月龄') || yl.textContent.includes('8月龄')){
                        if(yl.textContent.includes('18月龄')){
                            console.log('过')
                        }else {
                            button1.click()
                        }
                    }
                },200)
                setTimeout(function(){
                    if(yl1.textContent.includes('满月龄') || yl1.textContent.includes('3月龄') || yl1.textContent.includes('6月龄') || yl1.textContent.includes('12月龄') || yl1.textContent.includes('8月龄')){
                        if(yl1.textContent.includes('18月龄')){
                            console.log('过')
                        }else {
                            button1.click()
                        }
                    }
                },200)

                //早产儿要到2岁
                setTimeout(function(){
                    if(zcr.textContent.includes("是")){
                        if(yl.textContent.includes('18月龄') || yl.textContent.includes('24月龄')){
                            button1.click()
                        }
                    }
                },200)
                setTimeout(function(){
                    if(zcr.textContent.includes("是")){
                        if(yl1.textContent.includes('18月龄') || yl1.textContent.includes('24月龄')){
                            button1.click()
                        }
                    }
                },200)

            }
        },15000)


    });//button0 一般体检




//_______________________________________________________________________________________________________
//_______________________________________________________________________________________________________





    //高危儿
    let button1 = document.getElementById('1a')


    // 为按钮添加点击事件监听器（一般体检）
    button1.addEventListener('click', function(){




        let focus = new Event('focus')//文字聚焦
        let input = new Event('input')//文字聚焦
        let blur = new Event('blur')//文字聚焦


        let gaoweier = document.querySelectorAll('.ivu-checkbox-input') //所有勾选框


          //识别高危儿ger、早产儿zcr、低出生体重dtz
        let lbgwr = document.querySelectorAll('.ivu-form-item-label')


        let c1 = 0
        for(let i = 0;i<lbgwr.length;i++){
            if(lbgwr[i].textContent === "体重"){
                c1 = i
                break
            }
        }
        let tizhong = + lbgwr[c1].parentNode.querySelector('input').value




        let c7 = 0
        for(let i = 0;i<lbgwr.length;i++){
            if(lbgwr[i].textContent.includes("高危儿")){
                c7 = i
                break
            }
        }
        let parentgwe = lbgwr[c7].parentNode
        let gwe = parentgwe.querySelector('span')

        let c8 = 0
        for(let i = 0;i<lbgwr.length;i++){
            if(lbgwr[i].textContent.includes("早产儿")){
                c8 = i
                break
            }
        }
        let parentzcr = lbgwr[c8].parentNode
        let zcr = parentzcr.querySelector('span')

        let c9 = 0
        for(let i = 0;i<lbgwr.length;i++){
            if(lbgwr[i].textContent.includes("低出生体重")){
                c9 = i
                break
            }
        }
        let parentdtz = lbgwr[c9].parentNode
        let dtz = parentdtz.querySelector('span')





        //专案外上转
        let liall = document.querySelectorAll('li')
        for(let i = 0;i<liall.length;i++){
            if(liall[i].textContent.includes("否") && liall[i+1].textContent.includes("是")){
                liall[i+1].click() //是
                break
            }
        }

        //选择上转
        setTimeout(function(){
            let a1 = 0
            let lisz = document.querySelectorAll('li')
            for(let i = 0; i < lisz.length; i++){
                if(lisz[i].textContent.includes("高危儿童Ⅱ类") && lisz[i+1].textContent.includes("高危儿童Ⅲ类") && lisz[i+2].textContent.includes("其他")){
                    a1++
                    setTimeout(function(){
                        lisz[i].click() //是
                    },200*a1)
                }
            }
        },200)


        //选择龙岗区
        setTimeout(function(){
            let lilgq = document.querySelectorAll('li')
            let a2 = 0

            for(let i = 0; i < lilgq.length; i++){
                if(lilgq[i].textContent.includes("罗湖区") && lilgq[i+1].textContent.includes("福田区") && lilgq[i+2].textContent.includes("南山区") && lilgq[i+3].textContent.includes("宝安区") && lilgq[i+4].textContent.includes("龙岗区")){
                    a2++
                    setTimeout(function(){
                        lilgq[i+4].click() //是
                    },200*a2)
                }
            }


        },600)



        //勾选高危儿
        setTimeout(function(){
            let a3 = 0
            for(let i = 0; i < gaoweier.length; i++){
                if(gaoweier[i].labels[0].innerText.includes('高危儿') && gaoweier[i+1].labels[0].innerText.includes('贫血') && gaoweier[i+2].labels[0].innerText.includes('肥胖儿')){
                    a3++
                    if(gaoweier[i].checked !== true){
                        setTimeout(function(){
                            gaoweier[i].click()//勾选高危儿
                        },200*a3) //每一秒勾选一次
                    }

                }
            }
        },800)

//勾选后的内容
        //专案内上转——是

        setTimeout(function(){
            let lishangzhuanshi = document.querySelectorAll('li')
            let a5 = 0
            for(let i = 0;i<lishangzhuanshi.length;i++){
                if(lishangzhuanshi[i].textContent.includes("否") && lishangzhuanshi[i+1].textContent.includes("是")){
                    a5++
                    if(a5 == 2){
                        lishangzhuanshi[i+1].click() //是
                        break
                    }
                }
            }
        },2000)

        //专案内上转——上转
        setTimeout(function(){
            let lishangzhuan = document.querySelectorAll('li')
            for(let i = 0;i<lishangzhuan.length;i++){
                if(lishangzhuan[i].textContent.includes("上转") && lishangzhuan[i+1].textContent.includes("下转")){
                    lishangzhuan[i].click() //是
                    break
                }
            }
        },2200)

        setTimeout(function(){
            let likgj = document.querySelectorAll('li') //各类髋关节发育情况
            for(let i = 0;i<likgj.length;i++){
                if(likgj[i].textContent.includes("是") && likgj[i+1].textContent.includes("否") && likgj[i+3].textContent.includes("是") && likgj[i+4].textContent.includes("否") && likgj[i+6].textContent.includes("是") && likgj[i+7].textContent.includes("否") && likgj[i+9].textContent.includes("是") && likgj[i+10].textContent.includes("否") && likgj[i+12].textContent.includes("是") && likgj[i+13].textContent.includes("否")){
                    likgj[i+1].click()
                    likgj[i+3].click()
                    likgj[i+7].click()
                    likgj[i+10].click()
                    likgj[i+13].click()
                    likgj[i+16].click()
                    likgj[i+19].click()

                    break
                }
            }
        },2500)



        //勾选就诊医生
        setTimeout(function(){
            let userdiv = document.querySelector('.user')
            let use = userdiv.querySelectorAll('span')
            let yisheng = use[1].textContent
            let liyisheng = document.querySelectorAll('li')
            let a4 = 0
            for(let i = 0;i<liyisheng.length;i++){
                if(liyisheng[i].textContent.includes(yisheng)){
                    a4++
                    setTimeout(function(){
                        liyisheng[i].click()
                    },200*a4)

                }
            }
        },2800)



        //按照月龄填写和勾选内容
        setTimeout(function(){
            let yueling = document.querySelectorAll('.ivu-select-selected-value') //定位月龄

            let span10 = document.querySelectorAll('.ivu-col.ivu-col-span-10') //喂养与病史
            let weiyang3 = span10[3].querySelector('.ivu-input.ivu-input-default[placeholder="请输入"]') //喂养与病史-喂养方式-输入数值
            let weiyang4 = span10[4].querySelector('.ivu-input.ivu-input-default[placeholder="请输入"]') //喂养与病史-人工喂养种类-输入数值


            let lisz = document.querySelectorAll('li')
            let a6 = 0 //纯母乳、混合、人工
            let a7 = 0 //喂养奶粉
            let a71 = 0 //下次复诊时间
            //找到母乳喂养的选项，第二个
            for(let i = 0; i < lisz.length; i++){
                if(lisz[i].textContent.includes("纯母乳") && lisz[i+1].textContent.includes("混合") && lisz[i+2].textContent.includes("人工")){
                    console.log(i) //是
                    a6 = i
                }
            } //每次都是有2个，而且是第二个，可以通过第一个，来判定第二个，没有第一个时，都是人工
            for(let i = 0; i < lisz.length; i++){
                if(lisz[i].textContent.includes("早产奶") && lisz[i+1].textContent.includes("普通奶") && lisz[i+2].textContent.includes("水解蛋白")){
                    console.log(i) //是
                    a7 = i
                    break
                }
            }

            for(let i = 0; i < lisz.length; i++){
                if(lisz[i].textContent.includes("2周后") && lisz[i+1].textContent.includes("1个月后") && lisz[i+2].textContent.includes("2个月后") && lisz[i+3].textContent.includes("3个月后")){
                    console.log(i) //是
                    a71 = i
                    break
                }
            }


            let shuimian = document.querySelectorAll('.ivu-form-item-label')//总睡眠时间——标签，也可用于营养素和辅食添加
//---------------
            let a8 = 0
            for(let i = 0;i<shuimian.length;i++){
                if(shuimian[i].textContent.includes("总睡眠时间")){
                    a8 = i
                    break
                }
            }
            let parentsm = shuimian[a8].parentNode
            let smsj = parentsm.querySelector('.ivu-input.ivu-input-default[placeholder="请输入"]')//总睡眠时间——填空


//---------------

            let a9 = 0
            for(let i = 0;i<shuimian.length;i++){
                if(shuimian[i].textContent.includes("营养素")){
                    a9 = i
                    break
                }
            }
            let parentyys = shuimian[a9].parentNode
            let yys = parentyys.querySelectorAll('input')//0：维生素D；1：维生素A；2：钙；3：铁；4：锌；5：DNA


//---------------
            let a10 = 0
            for(let i = 0;i<shuimian.length;i++){
                if(shuimian[i].textContent.includes("辅食添加")){
                    a10 = i
                    break
                }
            }
            let parentfstj = shuimian[a10].parentNode
            let fstj = parentfstj.querySelectorAll('input')//0谷类;1蔬菜类;2水果类;3蛋类;4禽畜类;5鱼虾类;6豆制品;7动物肝血;


//---------------
            let a11 = 0
            for(let i = 0;i<shuimian.length;i++){
                if(shuimian[i].textContent.includes("听力筛查结果")){
                    a11 = i
                    break
                }
            }
            let parenttlsc = shuimian[a11].parentNode
            let tlsc = parenttlsc.querySelectorAll('input')//2行为测听法

//---------------
            let a12 = 0
            for(let i = 0;i<shuimian.length;i++){
                if(shuimian[i].textContent.includes("其他喂养方面指导")){
                    a12 = i
                    break
                }
            }
            let parentqtwy = shuimian[a12].parentNode
            let qtwy = parentqtwy.querySelector('.ivu-input[placeholder="请输入"]')


//---------------


            let a13 = 0
            for(let i = 0;i<shuimian.length;i++){
                if(shuimian[i].textContent.includes("其他神经发育行为指导")){
                    a13 = i
                    break
                }
            }
            let parentqtsj = shuimian[a13].parentNode
            let qtsj = parentqtsj.querySelector('.ivu-input[placeholder="请输入"]')

//---------------
            let a14 = 0
            for(let i = 0;i<shuimian.length;i++){
                if(shuimian[i].textContent.includes("早期发展促进")){
                    a14 = i
                    break
                }
            }
            let parentzqfz = shuimian[a14].parentNode
            let zqfz = parentzqfz.querySelectorAll('input')//0满月龄内;1满月龄;2：3个月;3：6个月;4：9个月;5：1岁;6：2-3岁


//---------------
            let a15 = 0
            for(let i = 0;i<shuimian.length;i++){
                if(shuimian[i].textContent.includes("乳类强化喂养")){
                    a15 = i
                    break
                }
            }
            let parentrlqh = shuimian[a15].parentNode
            let rlqh = parentrlqh.querySelectorAll('input')

//---------------

            let a16 = 0
            for(let i = 0;i<shuimian.length;i++){
                if(shuimian[i].textContent.includes("乳类非强化喂养")){
                    a16 = i
                    break
                }
            }
            let parentrlfqh = shuimian[a16].parentNode
            let rlfqh = parentrlfqh.querySelectorAll('input')

//---------------

            let a17 = 0
            for(let i = 0;i<shuimian.length;i++){
                if(shuimian[i].textContent.includes("食物转换")){
                    a17 = i
                    break
                }
            }
            let parentswzh = shuimian[a17].parentNode
            let swzh = parentswzh.querySelectorAll('input')

//---------------

            let a18 = 0
            for(let i = 0;i<shuimian.length;i++){
                if(shuimian[i].textContent.includes("营养素补充")){
                    a18 = i
                    break
                }
            }
            let parentyysbc = shuimian[a18].parentNode
            let yysbc = parentyysbc.querySelectorAll('input')


 //---------------实际月龄和矫正月龄
            setTimeout(function(){
                let id3 = document.getElementById('edit-examination-medical-3')
                let gwryl = id3.querySelectorAll('.ivu-form-item-label')//矫正月龄、实际月龄、体检阶段
                let f1 = 0
                for(let i = 0;i<gwryl.length;i++){
                    if(gwryl[i].textContent === "矫正年龄"){
                        f1 = i
                        break
                    }
                }
                let jzll = gwryl[f1].parentNode.querySelectorAll('input')
                let jzllsz = + jzll[0].value

                let f2 = 0
                for(let i = 0;i<gwryl.length;i++){
                    if(gwryl[i].textContent === "实际月龄"){
                        f2 = i
                        break
                    }
                }
                let sjyl = gwryl[f2].parentNode.querySelectorAll('input')
                let sjylsz = + sjyl[0].value


                let litjjd = document.querySelectorAll('li')


                setTimeout(function(){
                    for(let i = 0; i < litjjd.length; i++){
                        if(litjjd[i].textContent.includes("1月龄") && litjjd[i+1].textContent.includes("2-4月龄") && litjjd[i+2].textContent.includes("5-7月龄") && litjjd[i+3].textContent.includes("8-10月龄")){

                            if(sjylsz == 1 ){
                                litjjd[i].click()
                            }else if(sjylsz == 2 || sjylsz == 3 || sjylsz == 4 ){
                                litjjd[i+1].click()
                            }else if(sjylsz == 5 || sjylsz == 6 || sjylsz == 7 ){
                                litjjd[i+2].click()
                            }else if(sjylsz == 8 || sjylsz == 9 || sjylsz == 10 ){
                                litjjd[i+3].click()
                            }else if(sjylsz == 11 || sjylsz == 12 || sjylsz == 13 || sjylsz == 14){
                                litjjd[i+4].click()
                            }else if(sjylsz == 15 || sjylsz == 16 || sjylsz == 17 ){
                                litjjd[i+5].click()
                            }else if(sjylsz == 18 || sjylsz == 19 || sjylsz == 20 || sjylsz == 21 || sjylsz == 22 ){
                                litjjd[i+6].click()
                            }else if(sjylsz == 23 || sjylsz == 24){
                                litjjd[i+7].click()
                            }
                            break
                        }
                    }
                },150)



                setTimeout(function(){


                    if(jzllsz == 0){
                        if(sjylsz == 0 ){
                            zqfz[0].click()
                        }else if(sjylsz == 1 || sjylsz == 2 ){
                            zqfz[1].click()
                        }else if(sjylsz == 3 || sjylsz == 4 || sjylsz == 5){
                            zqfz[2].click()
                        }else if(sjylsz == 6 || sjylsz == 7 || sjylsz == 8 ){
                            zqfz[3].click()
                        }else if(sjylsz == 9 || sjylsz == 10 || sjylsz == 11 ){
                            zqfz[4].click()
                        }else if(sjylsz >= 12 ){
                            zqfz[5].click()
                        }else if(sjylsz >=24 ){
                            zqfz[6].click()
                        }



                    }else if(jzllsz == 1 || jzllsz == 2){
                        zqfz[1].click()
                    }else if(jzllsz == 3 || jzllsz == 4 || jzllsz == 5){
                        zqfz[2].click()
                    }else if(jzllsz == 6 || jzllsz == 7 || jzllsz == 8){
                        zqfz[3].click()
                    }else if(jzllsz == 9 || jzllsz == 10 || jzllsz == 11){
                        zqfz[4].click()
                    }else if(jzllsz >= 12 ){
                        zqfz[5].click()
                    }else if(jzllsz >=24 ){
                        zqfz[6].click()
                    }
                },300)



            },200)



            //---------------

            setTimeout(function(){
                for(let i = 0; i< yueling.length; i++){
                    if (yueling[i].textContent.includes('满月龄')) {
                        lisz[a6].click()
                        lisz[a71+1].click()


                        smsj.value = '18' //总睡眠时间
                        smsj.dispatchEvent(focus)
                        smsj.dispatchEvent(input)
                        smsj.dispatchEvent(blur)

                        weiyang3.value = '8' //喂养次数
                        weiyang3.dispatchEvent(focus)
                        weiyang3.dispatchEvent(input)
                        weiyang3.dispatchEvent(blur)
                        if(zcr.textContent.includes("是") || dtz.textContent.includes("是")){
                            qtwy.value = '坚持母乳喂养，不足时添加强化铁配方奶。补充VitD800U/天、日光浴1小时/天，补充DHA100mg/天,补铁2mg/kg.天。'
                        }else {
                            qtwy.value = '坚持母乳喂养，不足时添加配方奶。补充VitD400U/天、DHA100mg/天、日光浴1小时/天。'
                        }

                        qtsj.value = '做婴儿抚触及被动体操，多给予视听觉刺激，6个月前每月体检1次。'
                        qtwy.dispatchEvent(focus)
                        qtwy.dispatchEvent(input)
                        qtwy.dispatchEvent(blur)
                        qtsj.dispatchEvent(focus)
                        qtsj.dispatchEvent(input)
                        qtsj.dispatchEvent(blur)

                        if(yys[0].checked !== true){
                            setTimeout(function(){
                                yys[0].click()//维生素D
                            },150*1) //每一秒勾选一次
                        }

                        if(yys[1].checked !== true){
                            setTimeout(function(){
                                yys[1].click()//维生素A
                            },150*2) //每一秒勾选一次
                        }

                        setTimeout(function(){
                            tlsc[2].click()//行为测听法
                        },150*3)

                        //setTimeout(function(){
                        //  zqfz[1].click()//早期发展促进
                        // },150*4)


                        if(rlfqh[0].checked !== true){
                            setTimeout(function(){
                                rlfqh[0].click()//乳类非强化——母乳喂养
                            },150*5)
                        }

                        if(yysbc[0].checked !== true){
                            setTimeout(function(){
                                yysbc[0].click()//营养素补充——维生素D
                            },150*6)
                        }

                        if(zcr.textContent.includes("是") || dtz.textContent.includes("是")){
                            if(yysbc[1].checked !== true){
                                setTimeout(function(){
                                    yysbc[1].click()//营养素补充——铁元素
                                },150*7)
                            }
                        }

                        break
                    }else if (yueling[i].textContent.includes('3月龄')) {
                        lisz[a6].click()
                        lisz[a71+1].click()

                        smsj.value = '16' //总睡眠时间
                        smsj.dispatchEvent(focus)
                        smsj.dispatchEvent(input)
                        smsj.dispatchEvent(blur)

                        weiyang3.value = '8' //喂养次数
                        weiyang3.dispatchEvent(focus)
                        weiyang3.dispatchEvent(input)
                        weiyang3.dispatchEvent(blur)

                        if(zcr.textContent.includes("是") || dtz.textContent.includes("是")){
                            qtwy.value = '坚持母乳喂养，不足时添加强化铁配方奶。补充VitD800U/天、DHA100mg/天、补铁2mg/kg.天、日光浴1小时/天。'

                        }else {
                            qtwy.value = '坚持母乳喂养，不足时添加配方奶。补充VitD400U/天、DHA100mg/天、日光浴1小时/天。'
                        }

                        qtsj.value = '做婴儿抚触及被动体操，多给予视听觉刺激，训练拉坐、俯卧抬头及被动翻身，给予平衡及手握持训练。复查智力发育。'
                        qtwy.dispatchEvent(focus)
                        qtwy.dispatchEvent(input)
                        qtwy.dispatchEvent(blur)
                        qtsj.dispatchEvent(focus)
                        qtsj.dispatchEvent(input)
                        qtsj.dispatchEvent(blur)

                        if(yys[0].checked !== true){
                            setTimeout(function(){
                                yys[0].click()//维生素D
                            },150*1) //每一秒勾选一次
                        }

                        if(yys[1].checked !== true){
                            setTimeout(function(){
                                yys[1].click()//维生素A
                            },150*2) //每一秒勾选一次
                        }

                        setTimeout(function(){
                            tlsc[2].click()//行为测听法
                        },150*3)

                        // setTimeout(function(){
                        //    zqfz[2].click()//早期发展促进
                        //  },150*4)

                        if(rlfqh[0].checked !== true){
                            setTimeout(function(){
                                rlfqh[0].click()//乳类非强化——母乳喂养
                            },150*5)
                        }

                        if(yysbc[0].checked !== true){
                            setTimeout(function(){
                                yysbc[0].click()//营养素补充——维生素D
                            },150*6)
                        }

                        if(zcr.textContent.includes("是") || dtz.textContent.includes("是")){
                            if(yysbc[1].checked !== true){
                                setTimeout(function(){
                                    yysbc[1].click()//营养素补充——铁元素
                                },150*7)
                            }
                        }


                        break
                    }else if (yueling[i].textContent.includes('6月龄')) {
                        lisz[a6].click()
                        lisz[a71+2].click()

                        smsj.value = '13' //总睡眠时间
                        smsj.dispatchEvent(focus)
                        smsj.dispatchEvent(input)
                        smsj.dispatchEvent(blur)

                        weiyang3.value = '7' //喂养次数
                        weiyang3.dispatchEvent(focus)
                        weiyang3.dispatchEvent(input)
                        weiyang3.dispatchEvent(blur)

                        //weiyang4.value = '800' //喂养毫升
                        // weiyang4.dispatchEvent(focus)
                        // weiyang4.dispatchEvent(input)
                        //  weiyang4.dispatchEvent(blur)

                        if(zcr.textContent.includes("是") || dtz.textContent.includes("是")){
                        qtwy.value = '坚持母乳喂养，不足时添加强化铁配方奶，补充营养包。添加辅食：逐渐添加米汤、米糊、菜泥、果泥及蛋黄泥等。补充VitD400U/天、DHA100mg/天、补铁2mg/kg.天、日光浴1小时/天。'
                        }else{
                            qtwy.value = '坚持母乳喂养，不足时添加配方奶，补充营养包。添加辅食：逐渐添加米汤、米糊、菜泥、果泥及蛋黄泥等。补充VitD400U/天、DHA100mg/天、日光浴1小时/天。'
                        }


                        qtsj.value = '训练翻身、拉坐、靠坐及前倾坐，给予平衡及跳跃训练，给予看图说话及注视、寻找、躲猫猫及逗笑训练，练习玩具传手及抓取小东西，复查智力发育。'
                        qtwy.dispatchEvent(focus)
                        qtwy.dispatchEvent(input)
                        qtwy.dispatchEvent(blur)
                        qtsj.dispatchEvent(focus)
                        qtsj.dispatchEvent(input)
                        qtsj.dispatchEvent(blur)

                        if(yys[0].checked !== true){
                            setTimeout(function(){
                                yys[0].click()//维生素D
                            },150*1) //每一秒勾选一次
                        }

                        if(yys[1].checked !== true){
                            setTimeout(function(){
                                yys[1].click()//维生素A
                            },150*2) //每一秒勾选一次
                        }


                        if(fstj[0].checked !== true){
                            setTimeout(function(){
                                fstj[0].click()//谷物
                            },150*3) //每一秒勾选一次
                        }

                        if(fstj[1].checked !== true){
                            setTimeout(function(){
                                fstj[1].click()//蔬菜类
                            },150*4) //每一秒勾选一次
                        }

                        if(fstj[3].checked !== true){
                            setTimeout(function(){
                                fstj[3].click()//蛋类
                            },150*5) //每一秒勾选一次
                        }

                        setTimeout(function(){
                            tlsc[2].click() //行为测听法
                        },150*6)

                        // setTimeout(function(){
                        //     zqfz[3].click()//早期发展促进
                        // },150*7)

                        if(rlfqh[0].checked !== true){
                            setTimeout(function(){
                                rlfqh[0].click()//乳类非强化——母乳喂养
                            },150*8)
                        }

                        if(yysbc[0].checked !== true){
                            setTimeout(function(){
                                yysbc[0].click()//营养素补充——维生素D
                            },150*9)
                        }

                        if(zcr.textContent.includes("是") || dtz.textContent.includes("是")){
                            if(yysbc[1].checked !== true){
                                setTimeout(function(){
                                    yysbc[1].click()//营养素补充——铁元素
                                },150*10)
                            }
                        }

                        if(swzh[0].checked !== true){
                            setTimeout(function(){
                                swzh[0].click()//食物转换——强化铁米粉
                            },150*11)
                        }





                        break
                    }else if (yueling[i].textContent.includes('18月龄')) {
                        lisz[a6+2].click()
                        lisz[a7+1].click()
                        lisz[a71+3].click()

                        smsj.value = '11' //总睡眠时间
                        smsj.dispatchEvent(focus)
                        smsj.dispatchEvent(input)
                        smsj.dispatchEvent(blur)

                        weiyang3.value = '3' //喂养次数
                        weiyang3.dispatchEvent(focus)
                        weiyang3.dispatchEvent(input)
                        weiyang3.dispatchEvent(blur)

                        weiyang4.value = '600' //喂养毫升
                        weiyang4.dispatchEvent(focus)
                        weiyang4.dispatchEvent(input)
                        weiyang4.dispatchEvent(blur)

                        qtwy.value = '补充VitD400U/天、奶：500ml--600 ml /天，软饭，馒头，面条，鸡蛋1个，碎块蔬菜，肉类食品，肝脏（50-75g/月）、豆腐 水果、营养包'
                        qtsj.value = '给予讲故事、讲儿歌，练习搭积木、穿串珠，颜色、形状认知。'
                        qtwy.dispatchEvent(focus)
                        qtwy.dispatchEvent(input)
                        qtwy.dispatchEvent(blur)
                        qtsj.dispatchEvent(focus)
                        qtsj.dispatchEvent(input)
                        qtsj.dispatchEvent(blur)

                        if(yys[0].checked !== true){
                            setTimeout(function(){
                                yys[0].click()//维生素D
                            },150*1) //每一秒勾选一次
                        }

                        if(yys[1].checked !== true){
                            setTimeout(function(){
                                yys[1].click()//维生素A
                            },150*2) //每一秒勾选一次
                        }

                        if(fstj[0].checked !== true){
                            setTimeout(function(){
                                fstj[0].click()//谷物
                            },150*3) //每一秒勾选一次
                        }

                        if(fstj[1].checked !== true){
                            setTimeout(function(){
                                fstj[1].click()//蔬菜类
                            },150*4) //每一秒勾选一次
                        }

                        if(fstj[3].checked !== true){
                            setTimeout(function(){
                                fstj[3].click()//蛋类
                            },150*5) //每一秒勾选一次
                        }

                        if(fstj[2].checked !== true){
                            setTimeout(function(){
                                fstj[2].click()//水果类
                            },150*6) //每一秒勾选一次
                        }

                        if(fstj[7].checked !== true){
                            setTimeout(function(){
                                fstj[7].click()//动物肝血
                            },150*7) //每一秒勾选一次
                        }

                        if(fstj[6].checked !== true){
                            setTimeout(function(){
                                fstj[6].click()//动物肝血
                            },150*8) //每一秒勾选一次
                        }

                        if(fstj[4].checked !== true){
                            setTimeout(function(){
                                fstj[4].click()//动物肝血
                            },150*9) //每一秒勾选一次
                        }

                        if(fstj[5].checked !== true){
                            setTimeout(function(){
                                fstj[5].click()//动物肝血
                            },150*10) //每一秒勾选一次
                        }

                        setTimeout(function(){
                            tlsc[2].click() //行为测听法
                        },150*11)

                        // setTimeout(function(){
                        //      zqfz[5].click()//早期发展促进
                        //  },150*12)


                        if(yysbc[0].checked !== true){
                            setTimeout(function(){
                                yysbc[0].click()//营养素补充——维生素D
                            },150*13)
                        }


                        if(swzh[3].checked !== true){
                            setTimeout(function(){
                                swzh[3].click()//食物转换——面条
                            },150*15)
                        }

                        if(swzh[4].checked !== true){
                            setTimeout(function(){
                                swzh[4].click()//食物转换——软饭
                            },150*16)
                        }

                        if(swzh[5].checked !== true){
                            setTimeout(function(){
                                swzh[5].click()//食物转换——肉泥
                            },150*17)
                        }

                        if(rlfqh[1].checked !== true){
                            setTimeout(function(){
                                rlfqh[1].click()//乳类非强化——奶粉喂养
                            },150*18)
                        }




                        break
                    }else if (yueling[i].textContent.includes('12月龄')) {
                        lisz[a6+2].click()
                        lisz[a7+1].click()
                        lisz[a71+3].click()

                        smsj.value = '12' //总睡眠时间
                        smsj.dispatchEvent(focus)
                        smsj.dispatchEvent(input)
                        smsj.dispatchEvent(blur)

                        weiyang3.value = '4' //喂养次数
                        weiyang3.dispatchEvent(focus)
                        weiyang3.dispatchEvent(input)
                        weiyang3.dispatchEvent(blur)

                        weiyang4.value = '600' //喂养毫升
                        weiyang4.dispatchEvent(focus)
                        weiyang4.dispatchEvent(input)
                        weiyang4.dispatchEvent(blur)

                        qtwy.value = '坚持母乳喂养，不足时添加配方奶，补充营养包。补充VitD400U/天、补钙、DHA100mg/天、补铁1mg/kg.天、日光浴1-2小时/天。'
                        qtsj.value = '训练扶行、独站、蹲起、单脚踢球及行走，给予模仿说单字、指认五官及指认图画、实物训练，开、关盒盖、积木对击训练。'
                        qtwy.dispatchEvent(focus)
                        qtwy.dispatchEvent(input)
                        qtwy.dispatchEvent(blur)
                        qtsj.dispatchEvent(focus)
                        qtsj.dispatchEvent(input)
                        qtsj.dispatchEvent(blur)

                        if(yys[0].checked !== true){
                            setTimeout(function(){
                                yys[0].click()//维生素D
                            },150*1) //每一秒勾选一次
                        }

                        if(yys[1].checked !== true){
                            setTimeout(function(){
                                yys[1].click()//维生素A
                            },150*2) //每一秒勾选一次
                        }

                        if(fstj[0].checked !== true){
                            setTimeout(function(){
                                fstj[0].click()//谷物
                            },150*3) //每一秒勾选一次
                        }

                        if(fstj[1].checked !== true){
                            setTimeout(function(){
                                fstj[1].click()//蔬菜类
                            },150*4) //每一秒勾选一次
                        }

                        if(fstj[3].checked !== true){
                            setTimeout(function(){
                                fstj[3].click()//蛋类
                            },150*5) //每一秒勾选一次
                        }

                        if(fstj[2].checked !== true){
                            setTimeout(function(){
                                fstj[2].click()//水果类
                            },150*6) //每一秒勾选一次
                        }

                        if(fstj[7].checked !== true){
                            setTimeout(function(){
                                fstj[7].click()//动物肝血
                            },150*7) //每一秒勾选一次
                        }

                        if(fstj[6].checked !== true){
                            setTimeout(function(){
                                fstj[6].click()//动物肝血
                            },150*8) //每一秒勾选一次
                        }

                        if(fstj[4].checked !== true){
                            setTimeout(function(){
                                fstj[4].click()//动物肝血
                            },150*9) //每一秒勾选一次
                        }

                        if(fstj[5].checked !== true){
                            setTimeout(function(){
                                fstj[5].click()//动物肝血
                            },150*10) //每一秒勾选一次
                        }

                        setTimeout(function(){
                            tlsc[2].click() //行为测听法
                        },150*11)

                        // setTimeout(function(){
                        //      zqfz[5].click()//早期发展促进
                        //   },150*12)


                        if(yysbc[0].checked !== true){
                            setTimeout(function(){
                                yysbc[0].click()//营养素补充——维生素D
                            },150*13)
                        }
                        if(zcr.textContent.includes("是") || dtz.textContent.includes("是")){
                            if(yysbc[1].checked !== true){
                                setTimeout(function(){
                                    yysbc[1].click()//营养素补充——铁元素
                                },150*14)
                            }
                        }

                        if(swzh[3].checked !== true){
                            setTimeout(function(){
                                swzh[3].click()//食物转换——面条
                            },150*15)
                        }

                        if(swzh[4].checked !== true){
                            setTimeout(function(){
                                swzh[4].click()//食物转换——软饭
                            },150*16)
                        }

                        if(swzh[5].checked !== true){
                            setTimeout(function(){
                                swzh[5].click()//食物转换——肉泥
                            },150*17)
                        }

                        if(rlfqh[1].checked !== true){
                            setTimeout(function(){
                                rlfqh[1].click()//乳类非强化——奶粉喂养
                            },150*18)
                        }

                        break

                    }else if (yueling[i].textContent.includes('8月龄')) {
                        lisz[a6+1].click()
                        lisz[a7+1].click()
                        lisz[a71+2].click()

                        smsj.value = '12' //总睡眠时间
                        smsj.dispatchEvent(focus)
                        smsj.dispatchEvent(input)
                        smsj.dispatchEvent(blur)

                        weiyang3.value = '6' //喂养次数
                        weiyang3.dispatchEvent(focus)
                        weiyang3.dispatchEvent(input)
                        weiyang3.dispatchEvent(blur)

                        weiyang4.value = '800' //喂养毫升
                        weiyang4.dispatchEvent(focus)
                        weiyang4.dispatchEvent(input)
                        weiyang4.dispatchEvent(blur)

                        qtwy.value = '坚持母乳喂养，不足时添加配方奶，补充营养包。添加辅食：逐渐添加稠粥、肉末、肝泥、鱼泥、豆腐、全蛋等辅食。补充VitD400U/天、补钙、DHA100mg/天、补铁1mg/kg.天、日光浴1-2小时/天。 '
                        qtsj.value = '训练坐稳、爬行，给予侧翻坐起、弯腰拾物、主动迈步训练，给予寻找玩具及拿起、放下玩具、手指捏东西、语言动作联系训练。  '
                        qtwy.dispatchEvent(focus)
                        qtwy.dispatchEvent(input)
                        qtwy.dispatchEvent(blur)
                        qtsj.dispatchEvent(focus)
                        qtsj.dispatchEvent(input)
                        qtsj.dispatchEvent(blur)

                        if(yys[0].checked !== true){
                            setTimeout(function(){
                                yys[0].click()//维生素D
                            },150*1) //每一秒勾选一次
                        }

                        if(yys[1].checked !== true){
                            setTimeout(function(){
                                yys[1].click()//维生素A
                            },150*2) //每一秒勾选一次
                        }

                        if(fstj[0].checked !== true){
                            setTimeout(function(){
                                fstj[0].click()//谷物
                            },150*3) //每一秒勾选一次
                        }

                        if(fstj[1].checked !== true){
                            setTimeout(function(){
                                fstj[1].click()//蔬菜类
                            },150*4) //每一秒勾选一次
                        }

                        if(fstj[3].checked !== true){
                            setTimeout(function(){
                                fstj[3].click()//蛋类
                            },150*5) //每一秒勾选一次
                        }

                        if(fstj[2].checked !== true){
                            setTimeout(function(){
                                fstj[2].click()//水果类
                            },150*6) //每一秒勾选一次
                        }

                        if(fstj[7].checked !== true){
                            setTimeout(function(){
                                fstj[7].click()//动物肝血
                            },150*7) //每一秒勾选一次
                        }

                        if(fstj[6].checked !== true){
                            setTimeout(function(){
                                fstj[6].click()//鱼虾类
                            },150*8) //每一秒勾选一次
                        }

                        setTimeout(function(){
                            tlsc[2].click() //行为测听法
                        },150*11)

                        //  setTimeout(function(){
                        //    zqfz[3].click()//早期发展促进
                        // },150*12)

                        if(yysbc[0].checked !== true){
                            setTimeout(function(){
                                yysbc[0].click()//营养素补充——维生素D
                            },150*13)
                        }

                        if(zcr.textContent.includes("是") || dtz.textContent.includes("是")){
                            if(yysbc[1].checked !== true){
                                setTimeout(function(){
                                    yysbc[1].click()//营养素补充——铁元素
                                },150*14)
                            }
                        }

                        if(swzh[0].checked !== true){
                            setTimeout(function(){
                                swzh[0].click()//食物转换——强化铁米粉
                            },150*15)
                        }

                        if(swzh[1].checked !== true){
                            setTimeout(function(){
                                swzh[1].click()//食物转换——水果
                            },150*16)
                        }

                        if(swzh[2].checked !== true){
                            setTimeout(function(){
                                swzh[2].click()//食物转换——粥
                            },150*17)
                        }

                        if(rlfqh[1].checked !== true){
                            setTimeout(function(){
                                rlfqh[1].click()//乳类非强化——奶粉喂养
                            },150*18)
                        }
                        if(rlfqh[0].checked !== true){
                            setTimeout(function(){
                                rlfqh[0].click()//乳类非强化——母乳喂养
                            },150*19)
                        }

                        break
                    }else if (yueling[i].textContent.includes('24月龄')) {
                        lisz[a6+2].click()
                        lisz[a7+1].click()
                        lisz[a71+4].click()

                        smsj.value = '10' //总睡眠时间
                        smsj.dispatchEvent(focus)
                        smsj.dispatchEvent(input)
                        smsj.dispatchEvent(blur)

                        weiyang3.value = '3' //喂养次数
                        weiyang3.dispatchEvent(focus)
                        weiyang3.dispatchEvent(input)
                        weiyang3.dispatchEvent(blur)

                        weiyang4.value = '400' //喂养毫升
                        weiyang4.dispatchEvent(focus)
                        weiyang4.dispatchEvent(input)
                        weiyang4.dispatchEvent(blur)

                        qtwy.value = '补充VitD400U/天、奶：500ml--600 ml /天，软饭，馒头，面条，鸡蛋1个，碎块蔬菜，肉类食品，肝脏（50-75g/月）、豆腐 水果、营养包'
                        qtsj.value = '给予讲故事、讲儿歌，练习搭积木、穿串珠，颜色、形状认知。'
                        qtwy.dispatchEvent(focus)
                        qtwy.dispatchEvent(input)
                        qtwy.dispatchEvent(blur)
                        qtsj.dispatchEvent(focus)
                        qtsj.dispatchEvent(input)
                        qtsj.dispatchEvent(blur)

                        if(yys[0].checked !== true){
                            setTimeout(function(){
                                yys[0].click()//维生素D
                            },150*1) //每一秒勾选一次
                        }

                        if(yys[1].checked !== true){
                            setTimeout(function(){
                                yys[1].click()//维生素A
                            },150*2) //每一秒勾选一次
                        }

                        if(fstj[0].checked !== true){
                            setTimeout(function(){
                                fstj[0].click()//谷物
                            },150*3) //每一秒勾选一次
                        }

                        if(fstj[1].checked !== true){
                            setTimeout(function(){
                                fstj[1].click()//蔬菜类
                            },150*4) //每一秒勾选一次
                        }

                        if(fstj[3].checked !== true){
                            setTimeout(function(){
                                fstj[3].click()//蛋类
                            },150*5) //每一秒勾选一次
                        }

                        if(fstj[2].checked !== true){
                            setTimeout(function(){
                                fstj[2].click()//水果类
                            },150*6) //每一秒勾选一次
                        }

                        if(fstj[7].checked !== true){
                            setTimeout(function(){
                                fstj[7].click()//动物肝血
                            },150*7) //每一秒勾选一次
                        }

                        if(fstj[6].checked !== true){
                            setTimeout(function(){
                                fstj[6].click()//豆制品
                            },150*8) //每一秒勾选一次
                        }

                        if(fstj[4].checked !== true){
                            setTimeout(function(){
                                fstj[4].click()//禽畜类
                            },150*9) //每一秒勾选一次
                        }

                        if(fstj[5].checked !== true){
                            setTimeout(function(){
                                fstj[5].click()//鱼虾类
                            },150*10) //每一秒勾选一次
                        }

                        setTimeout(function(){
                            tlsc[2].click() //行为测听法
                        },150*11)

                        //  setTimeout(function(){
                        //     zqfz[6].click()//早期发展促进
                        // },150*12)

                        if(yysbc[0].checked !== true){
                            setTimeout(function(){
                                yysbc[0].click()//营养素补充——维生素D
                            },150*13)
                        }

                        if(swzh[3].checked !== true){
                            setTimeout(function(){
                                swzh[3].click()//食物转换——面条
                            },150*15)
                        }

                        if(swzh[4].checked !== true){
                            setTimeout(function(){
                                swzh[4].click()//食物转换——软饭
                            },150*16)
                        }

                        if(swzh[5].checked !== true){
                            setTimeout(function(){
                                swzh[5].click()//食物转换——肉泥
                            },150*17)
                        }

                        if(rlfqh[1].checked !== true){
                            setTimeout(function(){
                                rlfqh[1].click()//乳类非强化——奶粉喂养
                            },150*18)
                        }

                        break
                    }
                }
            },700)

        },3000)



        //按照月龄填写和勾选内容
        setTimeout(function(){


            let lisz = document.querySelectorAll('li')
            let b1 = 0 //行为测听法
            //找到母乳喂养的选项，第二个
            for(let i = 0; i < lisz.length; i++){
                if(lisz[i].textContent.includes("未见异常") && lisz[i+1].textContent.includes("异常") ){
                    b1 = i
                }
            } //每次都是有2个，而且是第二个，可以通过第一个，来判定第二个，没有第一个时，都是人工

            lisz[b1].click()//行为测听法——未见异常

            //---------------


            let shuimian = document.querySelectorAll('.ivu-form-item-label')//总睡眠时间——标签，也可用于营养素和辅食添加
            //---------------
            let b2 = 0
            for(let i = 0;i<shuimian.length;i++){
                if(shuimian[i].textContent.includes("营养素")){
                    b2 = i
                    break
                }
            }
            let parentyys = shuimian[b2].parentNode
            let yys = parentyys.querySelectorAll('.ivu-input.ivu-input-default[placeholder="请输入"]')//营养素——填空

            //---------------
            let b3 = 0
            for(let i = 0;i<shuimian.length;i++){
                if(shuimian[i].textContent.includes("辅食添加")){
                    b3 = i
                    break
                }
            }
            let parentfstj = shuimian[b3].parentNode
            let fstj = parentfstj.querySelectorAll('.ivu-input.ivu-input-default[placeholder="请输入"]')//辅食添加——填空

            //---------------
            let b4 = 0
            for(let i = 0;i<shuimian.length;i++){
                if(shuimian[i].textContent.includes("营养素补充")){
                    b4 = i
                    break
                }
            }
            let parentyysbc = shuimian[b4].parentNode
            let yysbc = parentyysbc.querySelectorAll('.ivu-input.ivu-input-default[placeholder="请输入"]')//营养素补充——填空

            //---------------
            let b5 = 0
            for(let i = 0;i<shuimian.length;i++){
                if(shuimian[i].textContent.includes("乳类非强化喂养")){
                    b5 = i
                    break
                }
            }
            let parentrlfqh = shuimian[b5].parentNode
            let rlfqh = parentrlfqh.querySelectorAll('.ivu-input.ivu-input-default[placeholder="请输入"]')//营养素补充——填空







            //---------------

            let yueling = document.querySelectorAll('.ivu-select-selected-value') //定位月龄

            for(let i = 0; i< yueling.length; i++){
                if (yueling[i].textContent.includes('满月龄')) {
                    setTimeout(function(){
                        if(zcr.textContent.includes("是") || dtz.textContent.includes("是")){
                            yys[0].value = '800'
                            yys[0].dispatchEvent(focus)
                            yys[0].dispatchEvent(input)
                            yys[0].dispatchEvent(blur)
                        }else{
                            yys[0].value = '400'
                            yys[0].dispatchEvent(focus)
                            yys[0].dispatchEvent(input)
                            yys[0].dispatchEvent(blur)
                        }


                        yys[1].value = '1500'
                        yys[1].dispatchEvent(focus)
                        yys[1].dispatchEvent(input)
                        yys[1].dispatchEvent(blur)


                        if(zcr.textContent.includes("是") || dtz.textContent.includes("是")){
                            yysbc[0].value = '800'
                            yysbc[0].dispatchEvent(focus)
                            yysbc[0].dispatchEvent(input)
                            yysbc[0].dispatchEvent(blur)

                            if(tizhong*2 >= 15){
                                yysbc[1].value = Math.floor(15)
                                yysbc[1].dispatchEvent(focus)
                                yysbc[1].dispatchEvent(input)
                                yysbc[1].dispatchEvent(blur)
                            }else {
                                yysbc[1].value = Math.round(tizhong*2)
                                yysbc[1].dispatchEvent(focus)
                                yysbc[1].dispatchEvent(input)
                                yysbc[1].dispatchEvent(blur)
                            }


                        }else{
                            yysbc[0].value = '400'
                            yysbc[0].dispatchEvent(focus)
                            yysbc[0].dispatchEvent(input)
                            yysbc[0].dispatchEvent(blur)
                        }

                    },1000)
                    break

                }else if (yueling[i].textContent.includes('3月龄')) {
                    setTimeout(function(){
                        if(zcr.textContent.includes("是") || dtz.textContent.includes("是")){
                            yys[0].value = '800'
                            yys[0].dispatchEvent(focus)
                            yys[0].dispatchEvent(input)
                            yys[0].dispatchEvent(blur)
                        }else{
                            yys[0].value = '400'
                            yys[0].dispatchEvent(focus)
                            yys[0].dispatchEvent(input)
                            yys[0].dispatchEvent(blur)
                        }

                        yys[1].value = '1500'
                        yys[1].dispatchEvent(focus)
                        yys[1].dispatchEvent(input)
                        yys[1].dispatchEvent(blur)

                        if(zcr.textContent.includes("是") || dtz.textContent.includes("是")){
                            yysbc[0].value = '800'
                            yysbc[0].dispatchEvent(focus)
                            yysbc[0].dispatchEvent(input)
                            yysbc[0].dispatchEvent(blur)

                            if(tizhong*2 >= 15){
                                yysbc[1].value = Math.floor(15)
                                yysbc[1].dispatchEvent(focus)
                                yysbc[1].dispatchEvent(input)
                                yysbc[1].dispatchEvent(blur)
                            }else {
                                yysbc[1].value = Math.round(tizhong*2)
                                yysbc[1].dispatchEvent(focus)
                                yysbc[1].dispatchEvent(input)
                                yysbc[1].dispatchEvent(blur)
                            }

                        }else{
                            yysbc[0].value = '400'
                            yysbc[0].dispatchEvent(focus)
                            yysbc[0].dispatchEvent(input)
                            yysbc[0].dispatchEvent(blur)
                        }
           
                    },1000)
                    break

                }else if (yueling[i].textContent.includes('6月龄')) {
                    setTimeout(function(){
                        yys[0].value = '400'
                        yys[0].dispatchEvent(focus)
                        yys[0].dispatchEvent(input)
                        yys[0].dispatchEvent(blur)

                        yys[1].value = '1500'
                        yys[1].dispatchEvent(focus)
                        yys[1].dispatchEvent(input)
                        yys[1].dispatchEvent(blur)

                        yysbc[0].value = '400'
                        yysbc[0].dispatchEvent(focus)
                        yysbc[0].dispatchEvent(input)
                        yysbc[0].dispatchEvent(blur)

                        if(zcr.textContent.includes("是") || dtz.textContent.includes("是")){
                            if(tizhong*2 >= 15){
                                yysbc[1].value = Math.floor(15)
                                yysbc[1].dispatchEvent(focus)
                                yysbc[1].dispatchEvent(input)
                                yysbc[1].dispatchEvent(blur)
                            }else {
                                yysbc[1].value = Math.round(tizhong*2)
                                yysbc[1].dispatchEvent(focus)
                                yysbc[1].dispatchEvent(input)
                                yysbc[1].dispatchEvent(blur)
                            }
                        }

                        fstj[0].value = '6'
                        fstj[1].value = '6'
                        fstj[2].value = '6'

                        fstj[0].dispatchEvent(focus)
                        fstj[0].dispatchEvent(input)
                        fstj[0].dispatchEvent(blur)
                        fstj[1].dispatchEvent(focus)
                        fstj[1].dispatchEvent(input)
                        fstj[1].dispatchEvent(blur)
                        fstj[2].dispatchEvent(focus)
                        fstj[2].dispatchEvent(input)
                        fstj[2].dispatchEvent(blur)
                    },1000)
                    break

                }else if (yueling[i].textContent.includes('18月龄')) {
                    setTimeout(function(){


                        yys[0].value = '400'
                        yys[0].dispatchEvent(focus)
                        yys[0].dispatchEvent(input)
                        yys[0].dispatchEvent(blur)

                        yys[1].value = '1500'
                        yys[1].dispatchEvent(focus)
                        yys[1].dispatchEvent(input)
                        yys[1].dispatchEvent(blur)

                        yysbc[0].value = '400'
                        yysbc[0].dispatchEvent(focus)
                        yysbc[0].dispatchEvent(input)
                        yysbc[0].dispatchEvent(blur)

                        fstj[0].value = '6'
                        fstj[1].value = '6'
                        fstj[2].value = '7'
                        fstj[3].value = '6'
                        fstj[4].value = '9'
                        fstj[5].value = '10'
                        fstj[6].value = '8'
                        fstj[7].value = '7'

                        fstj[0].dispatchEvent(focus)
                        fstj[0].dispatchEvent(input)
                        fstj[0].dispatchEvent(blur)
                        fstj[1].dispatchEvent(focus)
                        fstj[1].dispatchEvent(input)
                        fstj[1].dispatchEvent(blur)
                        fstj[2].dispatchEvent(focus)
                        fstj[2].dispatchEvent(input)
                        fstj[2].dispatchEvent(blur)
                        fstj[3].dispatchEvent(focus)
                        fstj[3].dispatchEvent(input)
                        fstj[3].dispatchEvent(blur)
                        fstj[4].dispatchEvent(focus)
                        fstj[4].dispatchEvent(input)
                        fstj[4].dispatchEvent(blur)
                        fstj[5].dispatchEvent(focus)
                        fstj[5].dispatchEvent(input)
                        fstj[5].dispatchEvent(blur)
                        fstj[6].dispatchEvent(focus)
                        fstj[6].dispatchEvent(input)
                        fstj[6].dispatchEvent(blur)
                        fstj[7].dispatchEvent(focus)
                        fstj[7].dispatchEvent(input)
                        fstj[7].dispatchEvent(blur)

                        rlfqh[0].value = '600'
                        rlfqh[0].dispatchEvent(focus)
                        rlfqh[0].dispatchEvent(input)
                        rlfqh[0].dispatchEvent(blur)

                    },1000)
                    break

                }else if (yueling[i].textContent.includes('12月龄')) {
                    setTimeout(function(){


                        yys[0].value = '400'
                        yys[0].dispatchEvent(focus)
                        yys[0].dispatchEvent(input)
                        yys[0].dispatchEvent(blur)

                        yys[1].value = '1500'
                        yys[1].dispatchEvent(focus)
                        yys[1].dispatchEvent(input)
                        yys[1].dispatchEvent(blur)

                        yysbc[0].value = '400'
                        yysbc[0].dispatchEvent(focus)
                        yysbc[0].dispatchEvent(input)
                        yysbc[0].dispatchEvent(blur)

                        if(zcr.textContent.includes("是") || dtz.textContent.includes("是")){
                            if(tizhong >= 15){
                                yysbc[1].value = Math.floor(15)
                                yysbc[1].dispatchEvent(focus)
                                yysbc[1].dispatchEvent(input)
                                yysbc[1].dispatchEvent(blur)
                            }else {
                                yysbc[1].value = Math.round(tizhong)
                                yysbc[1].dispatchEvent(focus)
                                yysbc[1].dispatchEvent(input)
                                yysbc[1].dispatchEvent(blur)
                            }
                        }


                        fstj[0].value = '6'
                        fstj[1].value = '6'
                        fstj[2].value = '7'
                        fstj[3].value = '6'
                        fstj[4].value = '9'
                        fstj[5].value = '10'
                        fstj[6].value = '8'
                        fstj[7].value = '7'

                        fstj[0].dispatchEvent(focus)
                        fstj[0].dispatchEvent(input)
                        fstj[0].dispatchEvent(blur)
                        fstj[1].dispatchEvent(focus)
                        fstj[1].dispatchEvent(input)
                        fstj[1].dispatchEvent(blur)
                        fstj[2].dispatchEvent(focus)
                        fstj[2].dispatchEvent(input)
                        fstj[2].dispatchEvent(blur)
                        fstj[3].dispatchEvent(focus)
                        fstj[3].dispatchEvent(input)
                        fstj[3].dispatchEvent(blur)
                        fstj[4].dispatchEvent(focus)
                        fstj[4].dispatchEvent(input)
                        fstj[4].dispatchEvent(blur)
                        fstj[5].dispatchEvent(focus)
                        fstj[5].dispatchEvent(input)
                        fstj[5].dispatchEvent(blur)
                        fstj[6].dispatchEvent(focus)
                        fstj[6].dispatchEvent(input)
                        fstj[6].dispatchEvent(blur)
                        fstj[7].dispatchEvent(focus)
                        fstj[7].dispatchEvent(input)
                        fstj[7].dispatchEvent(blur)

                        rlfqh[0].value = '600'
                        rlfqh[0].dispatchEvent(focus)
                        rlfqh[0].dispatchEvent(input)
                        rlfqh[0].dispatchEvent(blur)
                    },1000)
                    break
                }else if (yueling[i].textContent.includes('8月龄')) {
                    setTimeout(function(){
                        yys[0].value = '400'
                        yys[0].dispatchEvent(focus)
                        yys[0].dispatchEvent(input)
                        yys[0].dispatchEvent(blur)

                        yys[1].value = '1500'
                        yys[1].dispatchEvent(focus)
                        yys[1].dispatchEvent(input)
                        yys[1].dispatchEvent(blur)

                        yysbc[0].value = '400'
                        yysbc[0].dispatchEvent(focus)
                        yysbc[0].dispatchEvent(input)
                        yysbc[0].dispatchEvent(blur)

                        if(zcr.textContent.includes("是") || dtz.textContent.includes("是")){
                            if(tizhong >= 15){
                                yysbc[1].value = Math.floor(15)
                                yysbc[1].dispatchEvent(focus)
                                yysbc[1].dispatchEvent(input)
                                yysbc[1].dispatchEvent(blur)
                            }else {
                                yysbc[1].value = Math.round(tizhong)
                                yysbc[1].dispatchEvent(focus)
                                yysbc[1].dispatchEvent(input)
                                yysbc[1].dispatchEvent(blur)
                            }
                        }

                        fstj[0].value = '6'
                        fstj[1].value = '6'
                        fstj[2].value = '7'
                        fstj[3].value = '6'
                        fstj[4].value = '8'
                        fstj[5].value = '7'

                        fstj[0].dispatchEvent(focus)
                        fstj[0].dispatchEvent(input)
                        fstj[0].dispatchEvent(blur)
                        fstj[1].dispatchEvent(focus)
                        fstj[1].dispatchEvent(input)
                        fstj[1].dispatchEvent(blur)
                        fstj[2].dispatchEvent(focus)
                        fstj[2].dispatchEvent(input)
                        fstj[2].dispatchEvent(blur)
                        fstj[3].dispatchEvent(focus)
                        fstj[3].dispatchEvent(input)
                        fstj[3].dispatchEvent(blur)
                        fstj[4].dispatchEvent(focus)
                        fstj[4].dispatchEvent(input)
                        fstj[4].dispatchEvent(blur)
                        fstj[5].dispatchEvent(focus)
                        fstj[5].dispatchEvent(input)
                        fstj[5].dispatchEvent(blur)

                        rlfqh[0].value = '800'
                        rlfqh[0].dispatchEvent(focus)
                        rlfqh[0].dispatchEvent(input)
                        rlfqh[0].dispatchEvent(blur)
                    },1000)
                    break
                }else if (yueling[i].textContent.includes('24月龄')) {
                    setTimeout(function(){
                        yys[0].value = '400'
                        yys[0].dispatchEvent(focus)
                        yys[0].dispatchEvent(input)
                        yys[0].dispatchEvent(blur)

                        yys[1].value = '1500'
                        yys[1].dispatchEvent(focus)
                        yys[1].dispatchEvent(input)
                        yys[1].dispatchEvent(blur)

                        yysbc[0].value = '400'
                        yysbc[0].dispatchEvent(focus)
                        yysbc[0].dispatchEvent(input)
                        yysbc[0].dispatchEvent(blur)

                        fstj[0].value = '6'
                        fstj[1].value = '6'
                        fstj[2].value = '7'
                        fstj[3].value = '6'
                        fstj[4].value = '9'
                        fstj[5].value = '10'
                        fstj[6].value = '8'
                        fstj[7].value = '7'

                        fstj[0].dispatchEvent(focus)
                        fstj[0].dispatchEvent(input)
                        fstj[0].dispatchEvent(blur)
                        fstj[1].dispatchEvent(focus)
                        fstj[1].dispatchEvent(input)
                        fstj[1].dispatchEvent(blur)
                        fstj[2].dispatchEvent(focus)
                        fstj[2].dispatchEvent(input)
                        fstj[2].dispatchEvent(blur)
                        fstj[3].dispatchEvent(focus)
                        fstj[3].dispatchEvent(input)
                        fstj[3].dispatchEvent(blur)
                        fstj[4].dispatchEvent(focus)
                        fstj[4].dispatchEvent(input)
                        fstj[4].dispatchEvent(blur)
                        fstj[5].dispatchEvent(focus)
                        fstj[5].dispatchEvent(input)
                        fstj[5].dispatchEvent(blur)
                        fstj[6].dispatchEvent(focus)
                        fstj[6].dispatchEvent(input)
                        fstj[6].dispatchEvent(blur)
                        fstj[7].dispatchEvent(focus)
                        fstj[7].dispatchEvent(input)
                        fstj[7].dispatchEvent(blur)

                        rlfqh[0].value = '400'
                        rlfqh[0].dispatchEvent(focus)
                        rlfqh[0].dispatchEvent(input)
                        rlfqh[0].dispatchEvent(blur)
                    },1000)
                    break
                }
            }

        },7500)

        //选择医院(专案外)
        setTimeout(function(){
            let lizzyy = document.querySelectorAll('.ivu-form-item-label')
            let jigou = document.querySelectorAll('.ivu-tooltip-rel')
            let d5 = 0
            for(let i = 0;i<lizzyy.length;i++){
                if(lizzyy[i].textContent.includes("转诊医院")){
                    d5 = i
                    break
                }
            }
            let zzyy =lizzyy[d5].parentNode.parentNode.nextElementSibling.querySelector('span')
            zzyy.click()
            setTimeout(function(){
                let liyy = document.querySelectorAll('li')
                let d4 = 0

                for(let i = 0; i < liyy.length; i++){
                    if(liyy[i].textContent.includes("深圳市龙岗区妇幼保健院") && liyy[i+1].textContent.includes("深圳市龙岗中心医院") && liyy[i+2].textContent.includes("深圳市第三人民医院") && liyy[i+3].textContent.includes("深圳市龙岗区人民医院") && liyy[i+4].textContent.includes("深圳市龙岗区第二人民医院")){
                        //d4++
                        //if(d4 == 2 ){
                        if(jigou[0].textContent.includes('华侨新村') || jigou[0].textContent.includes('安良') || jigou[0].textContent.includes('大康') || jigou[0].textContent.includes('红棉') || jigou[0].textContent.includes('信义') || jigou[0].textContent.includes('东城') || jigou[0].textContent.includes('六约') || jigou[0].textContent.includes('保安') || jigou[0].textContent.includes('天颂') || jigou[0].textContent.includes('银信') || jigou[0].textContent.includes('怡锦') || jigou[0].textContent.includes('乐城') || jigou[0].textContent.includes('四联') || jigou[0].textContent.includes('西坑') ){
                            liyy[i+5].click() //i = 深圳市龙岗区妇幼保健院；i+5 = 深圳市龙岗中心医院；
                        }else {
                            liyy[i].click()
                        }
                        break
                        //}
                    }
                }
            },1000)
        },9000)


    })//button1 高危儿专案










//_______________________________________________________________________________________________________
//_______________________________________________________________________________________________________








//贫血专案
    let button2 = document.getElementById('2a')


    // 为按钮添加点击事件监听器（一般体检）
    button2.addEventListener('click', function(){

        let focus = new Event('focus')//文字聚焦
        let input = new Event('input')//文字聚焦
        let blur = new Event('blur')//文字聚焦
        let jigou = document.querySelectorAll('.ivu-tooltip-rel')

        let yueling = document.querySelectorAll('.ivu-select-selected-value') //定位月龄
        let pingxue = document.querySelectorAll('.ivu-checkbox-input') //所有勾选框
        let shuimian = document.querySelectorAll('.ivu-form-item-label')//总睡眠时间——标签，也可用于营养素和辅食添加
        let liall = document.querySelectorAll('li')

        let yybl = document.querySelectorAll('.ivu-form-item-label')//营养不良
        let yl0 = 0
        for(let i = 0;i<yybl.length;i++){
            if(yybl[i].textContent.includes("一般体检类型")){
                yl0 = i
                break
            }
        }
        let parentyl = yybl[yl0].parentNode
        let yl = parentyl.querySelector('.ivu-select-selected-value') //定位月龄的值

        let yl00 = 0
        for(let i = 0;i<yybl.length;i++){
            if(yybl[i].textContent.includes("体检阶段")){
                yl00 = i
                break
            }
        }
        let parentyl0 = yybl[yl00].parentNode
        let yla = parentyl0.querySelector('.ivu-select-selected-value') //定位月龄的值



        let c8 = 0
        for(let i = 0;i<shuimian.length;i++){
            if(shuimian[i].textContent.includes("早产儿")){
                c8 = i
                break
            }
        }
        let parentzcr = shuimian[c8].parentNode
        let zcr = parentzcr.querySelector('span')



        let c10 = 0
        for(let i = 0;i<shuimian.length;i++){
            if(shuimian[i].textContent.includes("血红蛋白")){
                c10 = i
                break
            }
        }
        let parentxhdb = shuimian[c10].parentNode.parentNode.querySelectorAll('input')
        let xhdb = String(parentxhdb[1].value) //血红蛋白数值
        let xhdbsz = + parentxhdb[1].value


        //勾选贫血
        for(let i = 0; i <pingxue.length; i++){
            if(pingxue[i].labels[0].innerText.includes('高危儿') && pingxue[i+1].labels[0].innerText.includes('贫血') && pingxue[i+2].labels[0].innerText.includes('肥胖儿')){
                if(pingxue[i].checked !== true){
                    setTimeout(function(){
                        pingxue[i+1].click()//勾选贫血
                    },i*2) //每一秒勾选一次
                }

            }
        }



        let id3 = document.getElementById('edit-examination-medical-3')
        let zayybl = id3.querySelectorAll('.ivu-form-item-label')//病史、症状、体征、复诊时间
        let zayybl0 = id3.querySelectorAll('.layout-title-left') //指导意见




        //专案内通用情况
        setTimeout(function(){


            let f1 = 0
            for(let i = 0;i<zayybl.length;i++){
                if(zayybl[i].textContent === "出生史"){
                        f1 = i
                        break
                }
            }
            let css = zayybl[f1].parentNode.querySelectorAll('input')

            if(zcr.textContent.includes("是")){
                if(css[1].checked !== true){
                    setTimeout(function(){
                        css[1].click()
                    },100)
                }

            }else {
                if(css[0].checked !== true){
                    setTimeout(function(){
                        css[0].click()
                    },100)
                }
            }



            let f2 = 0
            for(let i = 0;i<zayybl.length;i++){
                if(zayybl[i].textContent === "家族史"){
                        f2 = i
                        break
                }
            }
            let jzs = zayybl[f2].parentNode.querySelectorAll('input')

            if(jzs[0].checked !== true){
                setTimeout(function(){
                    jzs[0].click()
                },200)
            }


            let f3 = 0
            for(let i = 0;i<zayybl.length;i++){
                if(zayybl[i].textContent === "其他病史"){
                        f3 = i
                        break
                }
            }
            let qtbs = zayybl[f3].parentNode.querySelectorAll('input')

            if(qtbs[0].checked !== true){
                setTimeout(function(){
                    qtbs[0].click()
                },300)
            }


            let f4 = 0
            for(let i = 0;i<zayybl0.length;i++){
                if(zayybl0[i].textContent === "喂养史"){
                        f4 = i
                        break
                }
            }
            let wys = zayybl0[f4].parentNode.querySelectorAll('input')

            setTimeout(function(){
                if (yl.textContent.includes('6月龄')){

                    wys[0].value = '6'
                    wys[0].dispatchEvent(focus)
                    wys[0].dispatchEvent(input)
                    wys[0].dispatchEvent(blur)

                }else if (yl.textContent.includes('8月龄') || yl.textContent.includes('18月龄') || yl.textContent.includes('12月龄') || yl.textContent.includes('24月龄') || yl.textContent.includes('30月龄') || yl.textContent.includes('3岁')){
                    wys[0].value = '6'
                    wys[0].dispatchEvent(focus)
                    wys[0].dispatchEvent(input)
                    wys[0].dispatchEvent(blur)

                    wys[1].value = '8'
                    wys[1].dispatchEvent(focus)
                    wys[1].dispatchEvent(input)
                    wys[1].dispatchEvent(blur)

                    wys[2].value = '8'
                    wys[2].dispatchEvent(focus)
                    wys[2].dispatchEvent(input)
                    wys[2].dispatchEvent(blur)

                    wys[3].value = '7'
                    wys[3].dispatchEvent(focus)
                    wys[3].dispatchEvent(input)
                    wys[3].dispatchEvent(blur)
                }
            },50)

            setTimeout(function(){
                if (yla.textContent.includes('6月龄')){

                    wys[0].value = '6'
                    wys[0].dispatchEvent(focus)
                    wys[0].dispatchEvent(input)
                    wys[0].dispatchEvent(blur)

                }else if (yla.textContent.includes('8月龄') || yla.textContent.includes('18月龄') || yla.textContent.includes('12月龄') || yla.textContent.includes('24月龄') || yla.textContent.includes('30月龄') || yla.textContent.includes('3岁')){
                    wys[0].value = '6'
                    wys[0].dispatchEvent(focus)
                    wys[0].dispatchEvent(input)
                    wys[0].dispatchEvent(blur)

                    wys[1].value = '8'
                    wys[1].dispatchEvent(focus)
                    wys[1].dispatchEvent(input)
                    wys[1].dispatchEvent(blur)

                    wys[2].value = '8'
                    wys[2].dispatchEvent(focus)
                    wys[2].dispatchEvent(input)
                    wys[2].dispatchEvent(blur)

                    wys[3].value = '7'
                    wys[3].dispatchEvent(focus)
                    wys[3].dispatchEvent(input)
                    wys[3].dispatchEvent(blur)
                }
            },50)



             let f5 = 0
            for(let i = 0;i<zayybl.length;i++){
                if(zayybl[i].textContent === "症状"){
                        f5 = i
                        break
                }
            }
            let zhengzhuan = zayybl[f5].parentNode.querySelectorAll('input')



             let f6 = 0
            for(let i = 0;i<zayybl.length;i++){
                if(zayybl[i].textContent === "体征"){
                        f6 = i
                        break
                }
            }
            let tizheng = zayybl[f6].parentNode.querySelectorAll('input')



            let sj1 = Math.floor(Math.random() * 3)//症状随机0-3
            //let sj2 = Math.floor(Math.random() * 2)//症状随机0-3

            if(zhengzhuan[sj1].checked !== true){
                setTimeout(function(){
                    zhengzhuan[sj1].click()
                },400)
            }

            if(tizheng[0].checked !== true){
                setTimeout(function(){
                    tizheng[0].click()
                },500)
            }


            let f7 = 0
            for(let i = 0;i<zayybl0.length;i++){
                if(zayybl0[i].textContent === "药物治疗"){
                        f7 = i
                        break
                }
            }
            let ywzl = zayybl0[f7].parentNode.querySelectorAll('input')

            if(ywzl[0].checked !== true){
                setTimeout(function(){
                    ywzl[0].click()
                },600)
            }


            let f8 = 0
            for(let i = 0;i<zayybl.length;i++){
                if(zayybl[i].textContent === "饮食调整"){
                    f8 = i
                    break
                }
            }
            let ystz = zayybl[f8].parentNode.querySelectorAll('input')

            setTimeout(function(){
                if (yl.textContent.includes('满月龄') || yl.textContent.includes('3月龄')){
                    if(ystz[0].checked !== true){
                        setTimeout(function(){
                            ystz[0].click()
                        },700)

                    }

                }else if (yl.textContent.includes('6月龄') || yl.textContent.includes('8月龄') || yl.textContent.includes('18月龄') || yl.textContent.includes('12月龄') || yl.textContent.includes('24月龄') || yl.textContent.includes('30月龄') || yl.textContent.includes('3岁')){
                    if(ystz[1].checked !== true){
                        setTimeout(function(){
                            ystz[1].click()
                        },700)
                    }
                    if(ystz[2].checked !== true){
                        setTimeout(function(){
                            ystz[2].click()
                        },800)
                    }
                    if(ystz[3].checked !== true){
                        setTimeout(function(){
                            ystz[3].click()
                        },900)
                    }


                }
            },50)

            setTimeout(function(){
                if (yla.textContent.includes('满月龄') || yla.textContent.includes('3月龄')){
                    if(ystz[0].checked !== true){
                        setTimeout(function(){
                            ystz[0].click()
                        },700)

                    }

                }else if(yla.textContent.includes('6月龄') || yla.textContent.includes('8月龄') || yla.textContent.includes('18月龄') || yla.textContent.includes('12月龄') || yla.textContent.includes('24月龄') || yla.textContent.includes('30月龄') || yla.textContent.includes('3岁')){
                    if(ystz[1].checked !== true){
                        setTimeout(function(){
                            ystz[1].click()
                        },700)
                    }
                    if(ystz[2].checked !== true){
                        setTimeout(function(){
                            ystz[2].click()
                        },800)
                    }
                    if(ystz[3].checked !== true){
                        setTimeout(function(){
                            ystz[3].click()
                        },900)
                    }


                }
            },50)





            let f9 = 0
            for(let i = 0;i<zayybl.length;i++){
                if(zayybl[i].textContent === "复诊时间"){
                    f9 = i
                    break
                }
            }
            let fzsj = zayybl[f9].parentNode.querySelectorAll('input')
            if(fzsj[2].checked !== true){
                setTimeout(function(){
                    fzsj[2].click()
                },1000)
            }


           // setTimeout(function(){

                //if(xhdb > 90){
                   // if (yl.textContent.includes('满月龄') || yl.textContent.includes('3月龄')){

                      //  if(fzsj[2].checked !== true){
                      //      setTimeout(function(){
                     //           fzsj[2].click()
                     //       },800)
                     //   }


                   // }else if (yl.textContent.includes('6月龄')){

                    //    if(fzsj[3].checked !== true){
                    //        setTimeout(function(){
                    //            fzsj[3].click()
                    //        },1000)
                   //     }


                   // }else if(yl.textContent.includes('8月龄') || yl.textContent.includes('12月龄') || yl.textContent.includes('18月龄') || yl.textContent.includes('24月龄') || yl.textContent.includes('30月龄') || yl.textContent.includes('3岁')){
                    //    if(fzsj[4].checked !== true){
                     //       setTimeout(function(){
                     //           fzsj[4].click()
                    //        },1000)
                   //     }

                 //   }
             //   }

        //    },50)


            //setTimeout(function(){
               /// if (yla.textContent.includes('满月龄') || yla.textContent.includes('3月龄')){

                  //  if(fzsj[2].checked !== true){
                    //    setTimeout(function(){
                    //        fzsj[2].click()
                    //    },800)
                  //  }


              //  }else if (yla.textContent.includes('6月龄')){

               //     if(fzsj[3].checked !== true){
                    //    setTimeout(function(){
                    //        fzsj[3].click()
                    //    },1000)
                  //  }


               // }else if(yla.textContent.includes('8月龄') || yla.textContent.includes('12月龄') || yla.textContent.includes('18月龄') || yla.textContent.includes('24月龄') || yla.textContent.includes('30月龄') || yla.textContent.includes('3岁')){
                  //  if(fzsj[4].checked !== true){
                     //   setTimeout(function(){
                    //        fzsj[4].click()
                   //     },1000)
                 //   }

             //   }



          //  },50)




            let f10 = 0
            for(let i = 0;i<zayybl0.length;i++){
                if(zayybl0[i].textContent === "转诊"){
                    f10 = i
                    break
                }
            }
            let zhuanzhen = zayybl0[f10].parentNode.querySelectorAll('input')
            if(zhuanzhen[0].checked !== true){
                    setTimeout(function(){
                        zhuanzhen[0].click()
                    },1100)
                }

            let f11 = 0
            for(let i = 0;i<zayybl.length;i++){
                if(zayybl[i].textContent === "其他指导意见"){
                    f11 = i
                    break
                }
            }
            let qtzdyj = zayybl[f11].parentNode.querySelectorAll('input')

            if(qtzdyj[0].checked !== true){
                    setTimeout(function(){
                        qtzdyj[0].click()
                    },1200)
                }

            setTimeout(function(){
                let liall = document.querySelectorAll('li')
                let f12 = 0
                for(let i = 0;i<liall.length;i++){
                    if(liall[i].textContent.includes("未专管") && liall[i+1].textContent.includes("已专管")){
                        liall[i+1].click()
                        break

                    }
                }
            },1400)


            //return Math.floor(Math.random() * (max - min + 1)) + min

            let mcv = String((Math.floor(Math.random() * (100 - 50 + 1)) + 50 + Math.random()).toFixed(1)) //100-50
            let mch = String((Math.floor(Math.random() * (34 - 15 + 1)) + 15 + Math.random()).toFixed(1)) //34-15
            let mchc = String((Math.floor(Math.random() * (360 - 300 + 1)) + 300 + Math.random()).toFixed(1)) //360-300

            let f13 = 0
            for(let i = 0;i<zayybl0.length;i++){
                if(zayybl0[i].textContent === "检查结果"){
                        f13 = i
                        break
                }
            }
            let jcjg = zayybl0[f13].parentNode.querySelectorAll('input')
            setTimeout(function(){
                jcjg[0].value = xhdb
                jcjg[0].dispatchEvent(focus)
                jcjg[0].dispatchEvent(input)
                jcjg[0].dispatchEvent(blur)

            },1600)

            setTimeout(function(){
                jcjg[1].value = mcv
                jcjg[1].dispatchEvent(focus)
                jcjg[1].dispatchEvent(input)
                jcjg[1].dispatchEvent(blur)

                jcjg[2].value = mch
                jcjg[2].dispatchEvent(focus)
                jcjg[2].dispatchEvent(input)
                jcjg[2].dispatchEvent(blur)

                jcjg[3].value = mchc
                jcjg[3].dispatchEvent(focus)
                jcjg[3].dispatchEvent(input)
                jcjg[3].dispatchEvent(blur)

            },1700)




        },200)//专案内通用情况



        //重度贫血儿童

        setTimeout(function(){

            if(xhdbsz <110){
                //贫血原因
                for(let i = 0;i<liall.length;i++){
                    if(liall[i].textContent.includes("贫血(原因待查)") && liall[i+1].textContent.includes("营养性缺铁性贫血") && liall[i+2].textContent.includes("地中海贫血")){
                        liall[i].click() //是
                        break
                    }
                }
                //先默认轻度贫血
                for(let i = 0;i<liall.length;i++){
                    if(liall[i].textContent.includes("轻度贫血") && liall[i+1].textContent.includes("中度贫血") && liall[i+2].textContent.includes("重度贫血")){
                        liall[i].click() //是
                        break
                    }
                }


                if(xhdbsz < 60){
                    //专案外上转
                    for(let i = 0;i<liall.length;i++){
                        if(liall[i].textContent.includes("否") && liall[i+1].textContent.includes("是")){
                            liall[i+1].click() //是
                            break
                        }
                    }
                    //选择上转
                    setTimeout(function(){
                        let d1 = 0
                        let lisz = document.querySelectorAll('li')
                        for(let i = 0; i < lisz.length; i++){
                            if(lisz[i].textContent.includes("高危儿童Ⅱ类") && lisz[i+1].textContent.includes("高危儿童Ⅲ类") && lisz[i+2].textContent.includes("其他")){
                                d1++
                                setTimeout(function(){
                                    lisz[i+2].click() //是
                                },200*d1)
                            }
                        }
                    },200)

                    //其他转诊原因
                    setTimeout(function(){
                        let qtzzli = document.querySelectorAll('.ivu-form-item-label')


                        let d2 = 0
                        for(let i = 0;i<qtzzli.length;i++){
                            if(qtzzli[i].textContent.includes("其他转诊原因")){
                                d2 = i
                                break
                            }
                        }
                        let parentqtzz = qtzzli[d2].parentNode
                        let qtzz = parentqtzz.querySelector('.ivu-input.ivu-input-default[placeholder="请输入"]')

                        qtzz.value = '重度贫血'
                        qtzz.dispatchEvent(focus)
                        qtzz.dispatchEvent(input)
                        qtzz.dispatchEvent(blur)

                    },600)

                    //选择龙岗区
                    setTimeout(function(){
                        let lilgq = document.querySelectorAll('li')
                        let d3 = 0

                        for(let i = 0; i < lilgq.length; i++){
                            if(lilgq[i].textContent.includes("罗湖区") && lilgq[i+1].textContent.includes("福田区") && lilgq[i+2].textContent.includes("南山区") && lilgq[i+3].textContent.includes("宝安区") && lilgq[i+4].textContent.includes("龙岗区")){
                                d3++
                                setTimeout(function(){
                                    lilgq[i+4].click() //是
                                },200*d3)
                            }
                        }

                    },300)

                    //选择医院(专案外)
                    setTimeout(function(){
                        let lizzyy = document.querySelectorAll('.ivu-form-item-label')
                        let d5 = 0
                        for(let i = 0;i<lizzyy.length;i++){
                            if(lizzyy[i].textContent.includes("转诊医院")){
                                d5 = i
                                break
                            }
                        }
                        let zzyy =lizzyy[d5].parentNode.parentNode.nextElementSibling.querySelector('span')
                        zzyy.click()
                        setTimeout(function(){
                            let liyy = document.querySelectorAll('li')
                            let d4 = 0

                            for(let i = 0; i < liyy.length; i++){
                                if(liyy[i].textContent.includes("深圳市龙岗区妇幼保健院") && liyy[i+1].textContent.includes("深圳市龙岗中心医院") && liyy[i+2].textContent.includes("深圳市第三人民医院") && liyy[i+3].textContent.includes("深圳市龙岗区人民医院") && liyy[i+4].textContent.includes("深圳市龙岗区第二人民医院")){
                                    d4++
                                    if(d4 == 2 ){
                                        if(jigou[0].textContent.includes('华侨新村') || jigou[0].textContent.includes('安良') || jigou[0].textContent.includes('大康') || jigou[0].textContent.includes('红棉') || jigou[0].textContent.includes('信义') || jigou[0].textContent.includes('东城') || jigou[0].textContent.includes('六约') || jigou[0].textContent.includes('保安') || jigou[0].textContent.includes('天颂') || jigou[0].textContent.includes('银信') || jigou[0].textContent.includes('怡锦') || jigou[0].textContent.includes('乐城') || jigou[0].textContent.includes('四联') || jigou[0].textContent.includes('西坑') ){
                                            liyy[i+5].click() //i = 深圳市龙岗区妇幼保健院；i+5 = 深圳市龙岗中心医院；
                                        }else {
                                            liyy[i].click()
                                        }
                                        break
                                    }
                                }
                            }
                        },1000)

                    },2000)//等最后再算时间

                    let f10 = 0
                    for(let i = 0;i<zayybl0.length;i++){
                        if(zayybl0[i].textContent === "转诊"){
                            f10 = i
                            break
                        }
                    }
                    let zhuanzhen = zayybl0[f10].parentNode.querySelectorAll('input')
                    if(zhuanzhen[1].checked !== true){
                        setTimeout(function(){
                            zhuanzhen[1].click()
                        },1100)
                    }


                    //重度贫血
                    for(let i = 0;i<liall.length;i++){
                        if(liall[i].textContent.includes("轻度贫血") && liall[i+1].textContent.includes("中度贫血") && liall[i+2].textContent.includes("重度贫血")){
                            liall[i+2].click() //是
                            break
                        }
                    }


                }else if(xhdbsz < 90){//xhdbsz > 60

                    //中度贫血
                    for(let i = 0;i<liall.length;i++){
                        if(liall[i].textContent.includes("轻度贫血") && liall[i+1].textContent.includes("中度贫血") && liall[i+2].textContent.includes("重度贫血")){
                            liall[i+1].click() //是
                            break
                        }
                    }


                }



            }else if(xhdbsz >= 110){//xhdbsz < 110

                let d11 = 0
                for(let i = 0;i<liall.length;i++){
                    if(liall[i].textContent.includes("未结案") && liall[i+1].textContent.includes("已结案")){
                        liall[i+1].click()
                        break
                    }
                }

                setTimeout(function(){
                    let liall = document.querySelectorAll('li')
                    let d11 = 0
                    for(let i = 0;i<liall.length;i++){
                        if(liall[i].textContent.includes("已治愈") && liall[i+1].textContent.includes("已失访") && liall[i+2].textContent.includes("离开深圳")){
                            liall[i].click()
                            break
                        }
                    }
                },1000)




            }//xhdbsz >= 110


        },2000)//专案内通用情况













    })//button2 贫血专案




//_______________________________________________________________________________________________________
//_______________________________________________________________________________________________________













    //营养不良专案
    let button4 = document.getElementById('3a') //P1-P3 <P1


    // 为按钮添加点击事件监听器（一般体检）
    button4.addEventListener('click', function(){

        let focus = new Event('focus')//文字聚焦
        let input = new Event('input')//文字聚焦
        let blur = new Event('blur')//文字聚焦

        let jigou = document.querySelectorAll('.ivu-tooltip-rel')


        //识别高危儿ger、早产儿zcr、低出生体重dtz
        let shuimian = document.querySelectorAll('.ivu-form-item-label')//总睡眠时间——标签，也可用于营养素和辅食添加

        let c7 = 0
        for(let i = 0;i<shuimian.length;i++){
            if(shuimian[i].textContent.includes("高危儿")){
                c7 = i
                break
            }
        }
        let parentgwe = shuimian[c7].parentNode
        let gwe = parentgwe.querySelector('span')

        let c8 = 0
        for(let i = 0;i<shuimian.length;i++){
            if(shuimian[i].textContent.includes("早产儿")){
                c8 = i
                break
            }
        }
        let parentzcr = shuimian[c8].parentNode
        let zcr = parentzcr.querySelector('span')

        let c9 = 0
        for(let i = 0;i<shuimian.length;i++){
            if(shuimian[i].textContent.includes("低出生体重")){
                c9 = i
                break
            }
        }
        let parentdtz = shuimian[c9].parentNode
        let dtz = parentdtz.querySelector('span')








        let yingyangbuliang = document.querySelectorAll('.ivu-checkbox-input') //所有勾选框

        //勾选营养不良
        for(let i = 0; i < yingyangbuliang.length; i++){
            if(yingyangbuliang[i].labels[0].innerText.includes('高危儿') && yingyangbuliang[i+1].labels[0].innerText.includes('贫血') && yingyangbuliang[i+2].labels[0].innerText.includes('肥胖儿')){
                if(yingyangbuliang[i].checked !== true){
                    setTimeout(function(){
                        yingyangbuliang[i+3].click()//勾选营养不良
                    },i*2) //每一秒勾选一次
                }

            }
        }


        //营养不良专案总体
        let yybl = document.querySelectorAll('.ivu-form-item-label')//营养不良
        let yl0 = 0
        for(let i = 0;i<yybl.length;i++){
            if(yybl[i].textContent.includes("一般体检类型")){
                yl0 = i
                break
            }
        }
        let parentyl = yybl[yl0].parentNode
        let yl = parentyl.querySelector('.ivu-select-selected-value') //定位月龄的值

        let yl00 = 0
        for(let i = 0;i<yybl.length;i++){
            if(yybl[i].textContent.includes("体检阶段")){
                yl00 = i
                break
            }
        }
        let parentyl0 = yybl[yl00].parentNode
        let yla = parentyl0.querySelector('.ivu-select-selected-value') //定位月龄的值


        let c1 = 0
        for(let i = 0;i<yybl.length;i++){
            if(yybl[i].textContent === "体重"){
                c1 = i
                break
            }
        }
        let tizhong = yybl[c1].parentNode.parentNode.nextElementSibling.querySelector('span').textContent

        let c2 = 0
        for(let i = 0;i<yybl.length;i++){
            if(yybl[i].textContent === "身高"){
                c2 = i
                break
            }
        }
        let shengao = yybl[c2].parentNode.parentNode.nextElementSibling.querySelector('span').textContent

        let c3 = 0
        for(let i = 0;i<yybl.length;i++){
            if(yybl[i].textContent === "体重/身高"){
                c3 = i
                break
            }
        }
        let BMI = yybl[c3].nextElementSibling.querySelector('span').textContent




        //专案内通用情况
        setTimeout(function(){
            let id3 = document.getElementById('edit-examination-medical-3')
            let zayybl = id3.querySelectorAll('.ivu-form-item-label')//病史、症状、体征、复诊时间
            let zayybl0 = id3.querySelectorAll('.layout-title-left') //指导意见



            let e1 = 0
            let f1 = 0
            for(let i = 0;i<zayybl.length;i++){
                if(zayybl[i].textContent === "其他病史"){
                    e1++
                    if(e1 == 3){
                        f1 = i
                        break
                    }
                }
            }
            let qtbs = zayybl[f1].parentNode.querySelectorAll('input')
            if(qtbs[0].checked !== true){
                setTimeout(function(){
                    qtbs[0].click()
                },100)
            }



            let e2 = 0
            let f2 = 0
            for(let i = 0;i<zayybl.length;i++){
                if(zayybl[i].textContent === "出生史"){
                    e2++
                    if(e2 == 2){
                        f2 = i
                        break
                    }
                }
            }
            let css = zayybl[f2].parentNode.querySelectorAll('input')

            if(zcr.textContent.includes("是") && dtz.textContent.includes("是")){
                if(css[1].checked !== true){
                    setTimeout(function(){
                        css[1].click()
                    },200)
                }
                if(css[2].checked !== true){
                    setTimeout(function(){
                        css[2].click()
                    },300)
                }
            }else if(zcr.textContent.includes("是")){
                if(css[1].checked !== true){
                    setTimeout(function(){
                        css[1].click()
                    },200)
                }
            }else if(zcr.textContent.includes("是")){
                if(css[2].checked !== true){
                    setTimeout(function(){
                        css[2].click()
                    },300)
                }
            }else {
                if(css[0].checked !== true){
                    setTimeout(function(){
                        css[0].click()
                    },200)
                }
            }




            let e3 = 0
            let f3 = 0
            for(let i = 0;i<zayybl.length;i++){
                if(zayybl[i].textContent === "喂养史"){
                    e3++
                    if(e3 == 2){
                        f3 = i
                        break
                    }
                }
            }
            let wys = zayybl[f3].parentNode.querySelectorAll('input')
            if(wys[0].checked !== true){
                setTimeout(function(){
                    wys[0].click()
                },300)
            }


            let sj1 = Math.floor(Math.random() * 4)//症状随机0-3
            let sj2 = Math.floor(Math.random() * 4)//症状随机0-3

            let e4 = 0
            let f4 = 0
            for(let i = 0;i<zayybl.length;i++){
                if(zayybl[i].textContent === "症状"){
                    e4++
                    if(e4 == 2){
                        f4 = i
                        break
                    }
                }
            }
            let zhengzhuang = zayybl[f4].parentNode.querySelectorAll('input')
                setTimeout(function(){
                    zhengzhuang[sj1].click()
                },400)

            let e5 = 0
            let f5 = 0
            for(let i = 0;i<zayybl.length;i++){
                if(zayybl[i].textContent === "体征"){
                    e5++
                    if(e5 == 2){
                        f5 = i
                        break
                    }
                }
            }
            let tizheng = zayybl[f5].parentNode.querySelectorAll('input')
            setTimeout(function(){
                tizheng[sj2].click()
            },500)


            let e6 = 0
            let f6 = 0
            for(let i = 0;i<zayybl0.length;i++){
                if(zayybl0[i].textContent === "喂养指导"){
                    f6 = i
                    break
                }
            }
            let weiyangzhidao = zayybl0[f6].parentNode.querySelectorAll('input')



            setTimeout(function(){
                if(yl.textContent.includes('满月龄') || yl.textContent.includes('3月龄')){
                    if(weiyangzhidao[0].checked !== true){
                        setTimeout(function(){

                            weiyangzhidao[0].click()
                        },100)
                    }

                    if(weiyangzhidao[4].checked !== true){
                        setTimeout(function(){
                            weiyangzhidao[4].click()
                        },200)
                    }
                }else if(yl.textContent.includes('6月龄')){
                    if(weiyangzhidao[0].checked !== true){
                        setTimeout(function(){
                            weiyangzhidao[0].click()
                        },100)
                    }
                    if(weiyangzhidao[1].checked !== true){
                        setTimeout(function(){
                            weiyangzhidao[1].click()
                        },200)
                    }
                    if(weiyangzhidao[4].checked !== true){
                        setTimeout(function(){
                            weiyangzhidao[4].click()
                        },300)
                    }

                }else if(yl.textContent.includes('18月龄')){

                    for(let i = 2;i<weiyangzhidao.length;i++){
                        if(weiyangzhidao[i].checked !== true){
                            setTimeout(function(){
                                weiyangzhidao[i].click()
                            },100*(i+1))
                        }
                    }

                }else if(yl.textContent.includes('8月龄')){

                    for(let i = 0;i<weiyangzhidao.length;i++){
                        if(weiyangzhidao[i].checked !== true){
                            setTimeout(function(){
                                weiyangzhidao[i].click()
                            },100*(i+1))
                        }
                    }
                }else if(yl.textContent.includes('12月龄')){

                    for(let i = 1;i<weiyangzhidao.length;i++){
                        if(weiyangzhidao[i].checked !== true){
                            setTimeout(function(){
                                weiyangzhidao[i].click()
                            },100*(i+1))
                        }
                    }
                }else if(yl.textContent.includes('24月龄') || yl.textContent.includes('30月龄') || yl.textContent.includes('3岁')){
                    for(let i = 2;i<weiyangzhidao.length;i++){
                        if(weiyangzhidao[i].checked !== true){
                            setTimeout(function(){
                                weiyangzhidao[i].click()
                            },100*(i+1))
                        }
                    }
                }


            },600)

            setTimeout(function(){
                if(yla.textContent.includes('满月龄') || yla.textContent.includes('3月龄')){
                    if(weiyangzhidao[0].checked !== true){
                        setTimeout(function(){
                            weiyangzhidao[0].click()
                        },100)
                    }
                    if(weiyangzhidao[4].checked !== true){
                        setTimeout(function(){
                            weiyangzhidao[4].click()
                        },200)
                    }

                }else if(yla.textContent.includes('6月龄')){
                    if(weiyangzhidao[0].checked !== true){
                        setTimeout(function(){
                            weiyangzhidao[0].click()
                        },100)
                    }
                    if(weiyangzhidao[0].checked !== true){
                        setTimeout(function(){
                            weiyangzhidao[1].click()
                        },200)
                    }
                    if(weiyangzhidao[4].checked !== true){
                        setTimeout(function(){
                            weiyangzhidao[4].click()
                        },300)
                    }

                }else if(yla.textContent.includes('18月龄')){

                    for(let i = 2;i<weiyangzhidao.length;i++){
                        if(weiyangzhidao[i].checked !== true){
                            setTimeout(function(){
                                weiyangzhidao[i].click()
                            },100*(i+1))
                        }
                    }

                }else if(yla.textContent.includes('8月龄')){

                    for(let i = 0;i<weiyangzhidao.length;i++){
                        if(weiyangzhidao[i].checked !== true){
                            setTimeout(function(){
                                weiyangzhidao[i].click()
                            },100*(i+1))
                        }
                    }
                }else if(yla.textContent.includes('12月龄')){

                    for(let i = 1;i<weiyangzhidao.length;i++){
                        if(weiyangzhidao[i].checked !== true){
                            setTimeout(function(){
                                weiyangzhidao[i].click()
                            },100*(i+1))
                        }
                    }
                }else if(yla.textContent.includes('24月龄') || yla.textContent.includes('30月龄') || yla.textContent.includes('3岁')){
                    for(let i = 2;i<weiyangzhidao.length;i++){
                        if(weiyangzhidao[i].checked !== true){
                            setTimeout(function(){
                                weiyangzhidao[i].click()
                            },100*(i+1))
                        }
                    }
                }
            },600)


            let e7 = 0
            let f7 = 0
            for(let i = 0;i<zayybl0.length;i++){
                if(zayybl0[i].textContent === "药物治疗"){
                    e7++
                    if(e7 == 2){
                        f7 = i
                        break
                    }
                }
            }

            let yaowuzhiliao = zayybl0[f7].parentNode.querySelectorAll('input')
            if(yaowuzhiliao[0].checked !== true){
                setTimeout(function(){
                    yaowuzhiliao[0].click()
                },900)
            }

            let e8 = 0
            let f8 = 0
            for(let i = 0;i<zayybl.length;i++){
                if(zayybl[i].textContent === "复诊时间"){
                    e8++
                    if(e8 == 3){
                        f8 = i
                        break
                    }
                }
            }

            let fuzhenshijian = zayybl[f8].parentNode.querySelectorAll('input')
            if(fuzhenshijian[2].checked !== true){
                setTimeout(function(){
                    fuzhenshijian[2].click()
                },1000)
            }

            let e9 = 0
            let f9 = 0
            for(let i = 0;i<zayybl.length;i++){
                if(zayybl[i].textContent === "其他指导意见"){
                    e9++
                    if(e9 == 3){
                        f9 = i
                        break
                    }
                }
            }

            let qitazhidaoyijian = zayybl[f9].parentNode.querySelectorAll('input')
            if(qitazhidaoyijian[0].checked !== true){
                setTimeout(function(){
                    qitazhidaoyijian[0].click()
                },1100)
            }


            setTimeout(function(){
                let liyy = document.querySelectorAll('li')
                let d4 = 0

                for(let i = 0; i < liyy.length; i++){
                    if(liyy[i].textContent.includes("未专管") && liyy[i+1].textContent.includes("已专管")){
                        d4++
                        if(d4 == 3 ){
                            liyy[i+1].click() //已专管
                            break
                        }
                    }
                }
            },1200)

            setTimeout(function(){
                let d10 = 0
                let e10 = 0
                for(let i = 0;i<zayybl0.length;i++){
                    if(zayybl0[i].textContent === "转诊"){
                        d10++
                        if(d10 == 3){
                            e10 = i
                            break
                        }
                    }
                }
                let zhuanzhen0 = zayybl0[e10].parentNode.querySelectorAll('input')
                let zhuanzhenyiyuan = zayybl0[e10].parentNode.querySelectorAll('.ivu-select-placeholder')

                if(zhuanzhen0[0].checked !== true){

                    zhuanzhen0[0].click()//勾选重度营养不良

                }
            },1300)


        },500)//专案内通用情况






        //中重度营养不良、结案
        setTimeout(function(){
            let id3 = document.getElementById('edit-examination-medical-3')
            let zayybl = id3.querySelectorAll('.ivu-form-item-label')//病史、症状、体征、复诊时间
            let zayybl0 = id3.querySelectorAll('.layout-title-left') //指导意见、转诊
            let liall = document.querySelectorAll('li')


            if(tizhong === '<P1' || tizhong === 'P1-P3' || tizhong === 'P1' || shengao === '<P1' || shengao === 'P1-P3' || shengao === 'P1' || BMI === '<P1' || BMI === 'P1-P3' || BMI === 'P1'){


                if(tizhong == '<P1' || shengao == '<P1' || BMI == '<P1' ){
                    //专案外上转
                    
                    for(let i = 0;i<liall.length;i++){
                        if(liall[i].textContent.includes("否") && liall[i+1].textContent.includes("是")){
                            liall[i+1].click() //是
                            break
                        }
                    }

                    //选择上转
                    setTimeout(function(){
                        let d1 = 0
                        let lisz = document.querySelectorAll('li')
                        for(let i = 0; i < lisz.length; i++){
                            if(lisz[i].textContent.includes("高危儿童Ⅱ类") && lisz[i+1].textContent.includes("高危儿童Ⅲ类") && lisz[i+2].textContent.includes("其他")){
                                d1++
                                setTimeout(function(){
                                    lisz[i+2].click() //是
                                },200*d1)
                            }
                        }
                    },200)


                    //其他转诊原因
                    setTimeout(function(){


                        let qtzzli = document.querySelectorAll('.ivu-form-item-label')


                        let d2 = 0
                        for(let i = 0;i<qtzzli.length;i++){
                            if(qtzzli[i].textContent.includes("其他转诊原因")){
                                d2 = i
                                break
                            }
                        }
                        let parentqtzz = qtzzli[d2].parentNode
                        let qtzz = parentqtzz.querySelector('.ivu-input.ivu-input-default[placeholder="请输入"]')

                        qtzz.value = '重度营养不良'
                        qtzz[0].dispatchEvent(focus)
                        qtzz[0].dispatchEvent(input)
                        qtzz[0].dispatchEvent(blur)

                    },600)

                    //选择龙岗区
                    setTimeout(function(){
                        let lilgq = document.querySelectorAll('li')
                        let d3 = 0

                        for(let i = 0; i < lilgq.length; i++){
                            if(lilgq[i].textContent.includes("罗湖区") && lilgq[i+1].textContent.includes("福田区") && lilgq[i+2].textContent.includes("南山区") && lilgq[i+3].textContent.includes("宝安区") && lilgq[i+4].textContent.includes("龙岗区")){
                                d3++
                                setTimeout(function(){
                                    lilgq[i+4].click() //是
                                },200*d3)
                            }
                        }

                    },300)

                    //选择医院(专案外)
                    setTimeout(function(){
                        let lizzyy = document.querySelectorAll('.ivu-form-item-label')


                        let d5 = 0
                        for(let i = 0;i<lizzyy.length;i++){
                            if(lizzyy[i].textContent.includes("转诊医院")){
                                d5 = i
                                break
                            }
                        }
                        let zzyy =lizzyy[d5].parentNode.parentNode.nextElementSibling.querySelector('span')

                        zzyy.click()

                        setTimeout(function(){
                            let liyy = document.querySelectorAll('li')
                            let d4 = 0

                            for(let i = 0; i < liyy.length; i++){
                                if(liyy[i].textContent.includes("深圳市龙岗区妇幼保健院") && liyy[i+1].textContent.includes("深圳市龙岗中心医院") && liyy[i+2].textContent.includes("深圳市第三人民医院") && liyy[i+3].textContent.includes("深圳市龙岗区人民医院") && liyy[i+4].textContent.includes("深圳市龙岗区第二人民医院")){
                                    d4++
                                    if(d4 == 2 ){
                                       if(jigou[0].textContent.includes('华侨新村') || jigou[0].textContent.includes('安良') || jigou[0].textContent.includes('大康') || jigou[0].textContent.includes('红棉') || jigou[0].textContent.includes('信义') || jigou[0].textContent.includes('东城') || jigou[0].textContent.includes('六约') || jigou[0].textContent.includes('保安') || jigou[0].textContent.includes('天颂') || jigou[0].textContent.includes('银信') || jigou[0].textContent.includes('怡锦') || jigou[0].textContent.includes('乐城') || jigou[0].textContent.includes('四联') || jigou[0].textContent.includes('西坑') ){
                                            liyy[i+5].click() //i = 深圳市龙岗区妇幼保健院；i+5 = 深圳市龙岗中心医院；
                                        }else {
                                            liyy[i].click()
                                        }
                                        break
                                    }
                                }
                            }
                        },1000)

                    },2000)//等最后再算时间



                    //转诊 —— 专案内
                    let d5 = 0
                    let e5 = 0
                    for(let i = 0;i<zayybl0.length;i++){
                        if(zayybl0[i].textContent === "转诊"){
                            d5++
                            if(d5 == 3){
                                e5 = i
                                break
                            }
                        }
                    }
                    let zhuanzhen0 = zayybl0[e5].parentNode.querySelectorAll('input')
                    let zhuanzhenyiyuan = zayybl0[e5].parentNode.querySelectorAll('.ivu-select-placeholder')
                    if(zhuanzhen0[3].checked !== true){
                        setTimeout(function(){
                            zhuanzhen0[3].click()//勾选重度营养不良
                        },700)
                    }

                   // setTimeout(function(){
                      //  zhuanzhenyiyuan[0].click()//点击转诊医院
                   // },7000)

                  //  setTimeout(function(){
                      //  let liyy = document.querySelectorAll('li')
                      //  let d4 = 0

                      //  for(let i = 0; i < liyy.length; i++){
                      //      if(liyy[i].textContent.includes("深圳市龙岗区妇幼保健院") && liyy[i+1].textContent.includes("深圳市龙岗中心医院") && liyy[i+2].textContent.includes("深圳市第三人民医院") && liyy[i+3].textContent.includes("深圳市龙岗区人民医院") && liyy[i+4].textContent.includes("深圳市龙岗区第二人民医院")){

                       //             liyy[i+5].click() //i = 深圳市龙岗区妇幼保健院；i+5 = 深圳市龙岗中心医院；
                          //          break

                         //   }
                       // }
                 //   },9000)


                    //结论
                    let d10 = 0
                    for(let i = 0;i<zayybl.length;i++){
                        if(zayybl[i].textContent === "结论"){
                            d10 = i
                            break
                        }
                    }
                    let jielun = zayybl[d10].parentNode.querySelectorAll('input')

                    setTimeout(function(){
                        if(BMI == '<P1'){

                            jielun[1].click()

                        }else if(tizhong == '<P1'){
                            jielun[0].click()
                        }else if(shengao == '<P1'){
                            jielun[2].click()
                        }

                    },800)


                    let d11 = 0
                    for(let i = 0;i<liall.length;i++){
                        if(liall[i].textContent.includes("轻度") && liall[i+1].textContent.includes("中度") && liall[i+2].textContent.includes("重度")){
                            d11++
                            if(d11 == 2){
                                setTimeout(function(){
                                    liall[i+2].click()
                                },900)
                                break
                            }
                        }
                    }





                }else if(tizhong === 'P1-P3' || tizhong === 'P1' || shengao === 'P1-P3' || shengao === 'P1' || BMI === 'P1-P3' || BMI === 'P1'){ //非重度营养不良（既只有中度营养不良）

                    //结论
                    let d10 = 0
                    for(let i = 0;i<zayybl.length;i++){
                        if(zayybl[i].textContent === "结论"){
                            d10 = i
                            break
                        }
                    }
                    let jielun = zayybl[d10].parentNode.querySelectorAll('input')

                    setTimeout(function(){
                        if(BMI == 'P1'){
                            jielun[1].click()
                        }else if(tizhong == 'P1'){
                            jielun[0].click()
                        }else if(shengao == 'P1'){
                            jielun[2].click()
                        }else if(BMI == 'P1-P3'){
                            jielun[1].click()
                        }else if(tizhong == 'P1-P3'){
                            jielun[0].click()
                        }else if(shengao == 'P1-P3'){
                            jielun[2].click()
                        }

                    },100)


                    let d11 = 0
                    for(let i = 0;i<liall.length;i++){
                        if(liall[i].textContent.includes("轻度") && liall[i+1].textContent.includes("中度") && liall[i+2].textContent.includes("重度")){
                            d11++
                            if(d11 == 2){
                                setTimeout(function(){
                                    liall[i+1].click()
                                },200)
                                break
                            }
                        }
                    }


                } //非重度营养不良（既只有中度营养不良）


            }else { //结案 非<P1 或 P1 或 P1-P3

                let d11 = 0
                for(let i = 0;i<liall.length;i++){
                    if(liall[i].textContent.includes("未结案") && liall[i+1].textContent.includes("已结案")){
                        d11++
                        if(d11 == 3){
                            setTimeout(function(){
                                liall[i+1].click()
                            },100)
                            break
                        }
                    }
                }

                setTimeout(function(){
                    let liall = document.querySelectorAll('li')
                    let d11 = 0
                    for(let i = 0;i<liall.length;i++){
                        if(liall[i].textContent.includes("已治愈") && liall[i+1].textContent.includes("已失访") && liall[i+2].textContent.includes("离开深圳")){
                            liall[i].click()
                            break
                        }
                    }
                },1000)


            }

        },3500)//中重度营养不良、结案









    })//button4 营养不良专案






//_______________________________________________________________________________________________________
//_______________________________________________________________________________________________________


})();