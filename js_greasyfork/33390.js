// ==UserScript==
// @name         Automatically Check Promotion Details (no scope check)
// @version      1.0.1
// @description  Automatically check promotion details according to title contents
// @author       anyouzy
// @include      /^http://tool-bcg.bwe.io/editor/promo.php\?(site=cs\w{2}&)?action=add*/
// @grant        none
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/33390/Automatically%20Check%20Promotion%20Details%20%28no%20scope%20check%29.user.js
// @updateURL https://update.greasyfork.org/scripts/33390/Automatically%20Check%20Promotion%20Details%20%28no%20scope%20check%29.meta.js
// ==/UserScript==

(function() {
    class AutoCheck
    {
        constructor(scope,title,checkBoxes,originalCurrency)
        {
            this.scope = scope;
            this.title = title;
            this.matchRes = '';
            this.checkBoxes = checkBoxes;
            this.len = checkBoxes.length;
            this.originalCurrency = originalCurrency;
            this.sitewide = false;//辅助clearance
            this.sitewideChecked = this.percentChecked = this.moneyChecked = this.clearanceChecked = this.fsChecked = this.rebateChecked =this.rewardChecked = this.ftChecked = this.fdChecked =this.fgChecked= this.fsamChecked = this.bngnChecked = this.fromChecked = false;
            this.lastCurrency = '';
            this.lastNumber = '';
            //this.initScopeCheck();
            this.initPromoCheck();
        }
        /*initScopeCheck()
        {
            this.scope[2].checked = true;
            this.sitewideCheck();
        }*/
        sitewideCheck()
        {
            let s = this.title.value;
            if(!s||s.match(/(new customer)|student/gi))return;
            //|\d+%?\s(\w+\s)+\D+\s?\d+\+?(\s(?!on)|$|,)
            this.matchRes = s.match(/ on \D+\s?\d+\+?|sitewide|site wide|site-wide|storewide|store wide|store-wide|(whole|entire) (site|store)|everything|(all|every|each|any|your|your first|first|1st|all of your|entire|one|\d+) (order(s?)|next order|purchase(s?)|next purchase|product(s?)|merchandise|item(s?)|brand(s?))|(((when (spend|spending|you spend)|with (order(s?)|purchase(s?)) of) \D+\s?\d+\+?)|with \D+\d+\+?(\s(order(s?)|purchase(s?)))+)($|\s(?!on))/gi);
            if(this.matchRes===null)
            {
                this.sitewideChecked = false;
                this.scope[0].checked = false;
                //this.scope[2].checked = true;
            }
            else
            {
                if(!this.sitewideChecked)
                {
                    this.sitewideChecked = true;
                    this.scope[0].checked = true;
                    //this.checkBoxes[3].checked = false;
                }
            }

        }
        promoDetailCheck(index,regRule,flag,FnSuccess=function(){},FnFail=function(){},specialCheck=false)
        {
            let s = this.title.value;
            if(!s)return;
            this.matchRes = s.match(regRule);
            switch(specialCheck)
            {
                case 1:
                    if(this.matchRes===null)
                    {
                        this.checkBoxes[index].checked = false;
                        FnFail();
                    }
                    else
                    {
                        FnSuccess();
                    }
                    break;
                default:
                    if(this.matchRes===null)
                    {
                        flag = false;
                        this.checkBoxes[index].checked = false;
                        FnFail();
                    }
                    else
                    {
                        if(!flag)
                        {
                            flag  = true;
                            this.checkBoxes[index].checked = true;
                            FnSuccess();
                        }
                    }
                    break;
            }
        }
        fsCheck()
        {
            let regRule = /((free|complimentary)+(.*)?(shipping|ship|shipment|fs|s&h|delivery|postage|p&p|click|carriage|freight)|((\$|€|£|Rs|RS\.|¥|₦|CHF|USD|CAD|GBP|POUND|RMB|AUD|INR|EUR|US$|CA$|AU$)\s?0 ship))/gi;
            this.promoDetailCheck(0,regRule,this.fsChecked);
        }
        getCurrency(currency)
        {
            switch(currency)
            {
                case '$':
                case 'usd':
                case 'cad':
                case 'aud':
                case 'us$':
                case 'ca$':
                case 'au$':
                    currency = 'dollar';
                    break;
                case '£':
                case 'gbp':
                case 'pound':
                    currency = 'pound';
                    break;
                case '€':
                case 'eur':
                    currency = 'euro';
                    break;
                case 'rmb':
                case '¥':
                case 'cny':
                    currency = 'rmb';
                    break;
                case 'rs':
                case 'inr':
                case 'rs.':
                    currency = 'rupee';
                    break;
                case '₦':
                    currency = 'naira';
                    break;
                case 'chf':
                    currency = 'chf';
                    break;
            }
            return currency;
        }
        moneyCheckWithoutSave()
        {
            let regRule = /(((\$|€|£|Rs|RS\.|¥|₦|CHF|USD|CAD|GBP|POUND|RMB|AUD|INR|EUR|US$|CA$|AU$)\s?)(\d+|\d+\.\d+|(\d{1,3},)?\d{1,3},\d{3})\+?|(\d+|\d+\.\d+|(\d{1,3},)?\d{1,3},\d{3})\+?\s?(\$|€|£|Rs|RS\.|¥|₦|CHF|USD|CAD|GBP|POUND|RMB|AUD|INR|EUR|US$|CA$|AU$))\s(off|discounts?|savings?|(\w+\s)+(g ift cards?|gift certificates?|vouchers?|gift vouchers?))(\s|$)/gi;
            this.promoDetailCheck(1,regRule,this.moneyChecked,()=>{
                let currencySymbol = this.getCurrency((RegExp.$3||RegExp.$8).toLowerCase());
                let currencyNumber = (RegExp.$4||RegExp.$6).includes(',')? (RegExp.$4||RegExp.$6).replace(/,/gi,''): (RegExp.$4||RegExp.$6);

                this.checkBoxes[1].parentElement.nextElementSibling.value = currencySymbol ;
                this.checkBoxes[1].parentElement.nextElementSibling.nextElementSibling.value = currencyNumber;
            },()=>{
                this.checkBoxes[1].parentElement.nextElementSibling.value = this.originalCurrency;
                this.checkBoxes[1].parentElement.nextElementSibling.nextElementSibling.value ='';
            });
        }
        moneyCheckWithSave()
        {
            let regRule = /save\s(up to |over |more than |at least )?(((\$|€|£|Rs|RS\.|¥|₦|CHF|USD|CAD|GBP|POUND|RMB|AUD|INR|EUR|US$|CA$|AU$)\s?)(\d+|\d+\.\d+|(\d{1,3},)?\d{1,3},\d{3})\+?|(\d+|\d+\.\d+|(\d{1,3},)?\d{1,3},\d{3})\+?\s?(\$|€|£|Rs|RS\.|¥|₦|CHF|USD|CAD|GBP|POUND|RMB|AUD|INR|EUR|US$|CA$|AU$))(\s|$)/gi;
            this.promoDetailCheck(1,regRule,this.moneyChecked,()=>{
                let currencySymbol = this.getCurrency((RegExp.$4||RegExp.$9).toLowerCase());
                let currencyNumber = (RegExp.$5||RegExp.$7).includes(',')? (RegExp.$5||RegExp.$7).replace(/,/gi,''): (RegExp.$5||RegExp.$7);

                this.checkBoxes[1].parentElement.nextElementSibling.value = currencySymbol ;
                this.checkBoxes[1].parentElement.nextElementSibling.nextElementSibling.value = currencyNumber;
            },()=>{
                this.checkBoxes[1].parentElement.nextElementSibling.value = this.originalCurrency;
                this.checkBoxes[1].parentElement.nextElementSibling.nextElementSibling.value ='';
            });
        }
        moneyCheck()
        {
            let s = this.title.value;
            if(!s)return;
            if(s.includes('save '))
            {
                this.moneyCheckWithSave();
            }
            else
            {
                this.moneyCheckWithoutSave();
            }
      }
        percentCheck()
        {
            let regRule = /(save\s(up to |at least |more than |over )?(\d+|\d+\.\d+)%(\s|$))|((\d+|\d+\.\d+)%\s(off|discount(s?)|saving(s?))(\s|$))/gi;
            this.promoDetailCheck(2,regRule,this.percentChecked,()=>{
                let percentNumber = RegExp.$3 || RegExp.$6;
                this.checkBoxes[2].parentElement.nextElementSibling.value = percentNumber;
            },()=>{
                this.checkBoxes[2].parentElement.nextElementSibling.value = '';
            });
        }
        clearanceCheck()
        {
            this.sitewide = document.querySelector('input[value=SITE_WIDE]').checked;
            if(this.sitewide)return;
            let regRule = /\s?(clearan|closeout|sale|reduced|outlet|reductions?)\s?/gi;
            this.promoDetailCheck(3,regRule,this.clearanceChecked);
        }
        bngnCheck()
        {
            let regRule = /buy one,? get one free|bogof|bogo fr|(^\d+|\s\d+) for \d+|(^\d+|\s\d+) for the price of \d+|buy \d+\s?,? get \d+ fr|buy \d+ [^,]+, get \d+ free/gi;
            this.promoDetailCheck(4,regRule,this.bngnChecked);
        }
        fgCheck()
        {
            //let regRule = /\s?free\s(gift|gifts)?(?!shipping|ship|shipment|delivery|click|download|trial|(\w+\s)*sample|\D+\s?\d+\+?\s(\w+\s)+(gift card|gift certificate|voucher|gift voucher))/gi;
            let regRule = /\s?(free|complimentary)\s(gift|gifts)/gi;
            this.promoDetailCheck(5,regRule,this.fgChecked,()=>{
                this.checkBoxes[5].checked = true;
            },function(){},true);
        }

        fsamCheck()
        {
            let regRule = /\s?(free|complimentary)\s(\w+\s)*sample/gi;
            this.promoDetailCheck(6,regRule,this.fgChecked,()=>{
                this.checkBoxes[6].checked = true;
            },function(){},true);
        }
        fdCheck()
        {
            let regRule = /(free|complimentary)+(.*)?\sdownload/gi;
            this.promoDetailCheck(7,regRule,this.fdChecked);
        }
        ftCheck()
        {
            let regRule = /(free|complimentary)+(.*)?\strial/gi;
            this.promoDetailCheck(8,regRule,this.ftChecked);
        }
        rebateCheck()
        {
            let regRule = /\srebates?(\s|$)/gi;
            this.promoDetailCheck(9,regRule,this.rebateChecked);
        }
        rewardCheck()
        {
            let regRule = /\s(reward|bonus|cashback|cash back|point)s?(\s|$)/gi;
            this.promoDetailCheck(10,regRule,this.rewardChecked);
        }
        otherCheck()
        {
            let s = this.title.value;
            if(!s)
            {
                this.checkBoxes[11].checked = false;
                return;
            }
            let isAnyoneChecked = false;
            for(let i=0; i<this.len; i++)
            {
                if(i===11)continue;
                if(this.checkBoxes[i].checked)
                {
                    isAnyoneChecked = true;
                    this.checkBoxes[11].checked = false;
                    break;
                }
            }
            if(!isAnyoneChecked)
            {
                this.checkBoxes[11].checked = true;
            }
        }
        fromCheck()
        {
            let regRule = /\s*(from|(start|starting|starts)\s(from|at)|as low as|low to)\s(just\s)?(([^0-9\s]+)\s?(\d+|\d+\.\d+|(\d{1,3},)?\d{1,3},\d{3})(pp|\/each)?(\s|$)|(\d+|\d+\.\d+|(\d{1,3},)?\d{1,3},\d{3})(pp|\/each)?\s?([^0-9\s]+)(\s|$))/gi;
            this.promoDetailCheck(12,regRule,this.fromChecked,()=>{
                let currentCurrency = this.getCurrency((RegExp.$6||RegExp.$13).toLowerCase());
                let currentNumber = RegExp.$7||RegExp.$11;
                this.checkBoxes[12].checked = true;
                this.checkBoxes[12].parentElement.nextElementSibling.value = currentCurrency;
                this.checkBoxes[12].parentElement.nextElementSibling.nextElementSibling.value = currentNumber;
            },()=>{
                this.checkBoxes[12].parentElement.nextElementSibling.value = this.originalCurrency;
                this.checkBoxes[12].parentElement.nextElementSibling.nextElementSibling.value = '';
            },true);
        }
        initPromoCheck()
        {
            this.percentCheck();
            this.moneyCheck();
            this.clearanceCheck();
            this.bngnCheck();
            this.fgCheck();
            this.fsamCheck();
            this.fsCheck();
            this.fdCheck();
            this.ftCheck();
            this.rebateCheck();
            this.rewardCheck();
            this.fromCheck();
            this.otherCheck();
            this.sitewideCheck();
        }
        bindEvent()
        {
            this.title.addEventListener('input',(e)=>{
                this.initPromoCheck();
            },false);
        }
        exec()
        {
            this.bindEvent();
        }
    }

    let oAutoCheck = new AutoCheck(document.querySelectorAll("input[name='scope_apply']"),document.querySelector('#title'),document.querySelectorAll('#PromotionDetail > div > p > span > input[type=checkbox]'),document.querySelector("[name='money_type[money]']").value);
    oAutoCheck.exec();
    document.querySelector('input[value=SITE_WIDE]').addEventListener('click',function(){
        document.querySelector('input[value=sale_clearance]').checked = false;
    },false);
})();