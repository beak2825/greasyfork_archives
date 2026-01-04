// ==UserScript==
// @name         Twitter bot wiht GUI integrated V0.5
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  welcome to the olimpus
// @author       ALONZO-CORP
// @match        https://twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406394/Twitter%20bot%20wiht%20GUI%20integrated%20V05.user.js
// @updateURL https://update.greasyfork.org/scripts/406394/Twitter%20bot%20wiht%20GUI%20integrated%20V05.meta.js
// ==/UserScript==
g = (e, type) => {
    if(type == 'tag') return document.getElementsByTagName(e);
    return document.getElementsByClassName(e)
}
var join = (father, childrens) =>{
    for(let i in childrens){
        father.appendChild(childrens[i])
    }
}
class Builder{
    constructor(tag, textNode, prop, attribute){
        let element, content, tagHTML;

        element = document.createElement(tag);

        if(textNode){
            content = document.createTextNode(textNode);
            element.appendChild(content);
        }
        tagHTML = element;

        if(prop){
            for(let i in prop){
                tagHTML.style[i] = prop[i];
            }
        }
        if(attribute){
            for(let i in attribute){
                tagHTML.setAttribute(i, attribute[i]);
            }
        }
       return tagHTML;
    }
}
class Popup extends Builder{
    constructor(attribute){
        super('bot', null, {
            'background': '-webkit-linear-gradient(#2b5876, #4e4376)',
            'border':'1px solid rgba(0,0,0,0.1)',
            'box-shadow': '1px 1px 10px #000',
            'width':'50%',
            'text-align':'center',
            'margin':'auto',
            'margin-top':'50px',
            'position':'fixed',
            'top':'10',
            'left':'0',
            'right':'0',
            'bottom':'10',
            'zIndex':'1000'
        }, attribute)
    }
}
class Popup_config extends Builder{
    constructor(attribute){
        super('bot', null, {
            'transition':'transform 2s',
            'zIndex':'2000',
            'background':' -webkit-linear-gradient(#2b5876, #4e4376)',
            'border':'1px solid rgba(0,0,0,0.1)',
            'boxShadow': '1px 1px 10px #000',
            'width':'55%',
            'textAlign':'center',
            'margin':'auto',
            'padding':'7px',
            'marginTop':'140px',
            'position':'fixed',
            'top':'10',
            'left':'0',
            'right':'0',
            'bottom':'10',
            'zIndex':'2000',
            'display':'none'
        }, attribute)
    }
}
class Input extends Builder{
    constructor(width, attribute){
        super('input', null, {
            'font-weight': '900',
            'padding':'8px',
            'text-align-last':'center',
            'width':width,
            'margin-bottom':'2%'
        }, attribute)
    }
}
class Logo extends Builder{
    constructor(attribute){
        super('img', null, {
            'width':'30%'
        }, attribute)
    }
}
class LogoConfig extends Builder{
    constructor(textNode, attribute){
        super('span', textNode, {
            'borderRadius':'4px',
            'width':'1%',
            'float':'left',
            'textAlign':'center'
        }, attribute)
    }
}
class Select extends Builder{
    constructor(width,attribute){
        super('select', null, {
            'font-weight': '900',
            'padding':'10px',
            'text-align-last':'center',
            'width':width,
            'margin-bottom':'2%'
        }, attribute)
    }
}
class Option extends Builder{
    constructor(textNode, attribute){
        super('option', textNode, null, attribute)
    }
}
class LabelConfig extends Builder{
    constructor(textNode, attribute){
        super('span', textNode, {
            'color':'#fff',
            'fontSize': 'medium',
            'fontFamily': 'sans-serif',
            'fontWeight':'bold',
            'display':'inline-block',
            'width':'40%',
            'verticalAlign':'middle',
        }, attribute)
    }
}
class LabelConfigCal extends Builder{
    constructor(textNode, attribute){
        super('span', textNode, {
            'color':'#fff',
            'fontSize': '10px',
            'fontFamily': 'sans-serif',
            'fontWeight':'bold',
            'display':'inline-block',
            'width':'100%'
        }, attribute)
    }
}
class Label extends Builder{
    constructor(textNode, attribute){
        super('span', textNode, {
            'color':'#fff',
            'font-size': 'medium',
            'font-family': 'sans-serif',
            'font-weight':'bold',
            'display':'inline-block',
            'width':'60%'
        },attribute)
    }
}
class Button extends Builder{
    constructor(textNode, attribute){
        super('button', textNode, {
            'fontWeight': '900',
            'padding':'8px',
            'marginTop':'10px',
            'marginBottom':'15px',
            'textAlignLast':'center',
            'width':'30%'
        }, attribute)
    }
}
class BR extends Builder{
    constructor(){
        super('br', null, null, null);
    }
}
//CLASS GUI: contains the method to create each interface and interaction for the user;
class GUI{
    constructor(){
        this.html = document.getElementsByTagName('html')[0];
        this.logo = 'https://media3.giphy.com/media/M9O6ePwNJ58UMF1Rvq/giphy.gif'
    }
    //it change of the mouse design when this pass on an element
    gatgets_hover_mouse(){
        let ico_config = g('ico_config')[0]
        ico_config.style.cursor = 'pointer';
    }
    //it unhide the interface setting or vice versa
    gatgets_show_setting(){
        let bot_setting = g('bot_setting')[0]
        let mode = g('mode')[0]
        let tracking_username = g('tracking_username')[0];
        let secure_profiles =  g('secure_profiles')[0];
        let btn_accept = g('btn_accept')[0];

        if(bot_setting.style.display == 'none'){
            bot_setting.style.display = '';
            mode.setAttribute('disabled', '');
            tracking_username.setAttribute('disabled', '');
            secure_profiles.setAttribute('disabled', '');
            btn_accept.setAttribute('disabled', '');
        }else{
            mode.removeAttribute('disabled', '');
            bot_setting.style.display = 'none'
            secure_profiles.removeAttribute('disabled');
            btn_accept.removeAttribute('disabled');

            if(mode.value == 'follow'){
                tracking_username.removeAttribute('disabled');
            }
        }
    }
    //it change the value and attributes on the [tracking username] input
    gatgets_mode(){
        let mode = g('mode')[0];
        let tracking_username = g('tracking_username')[0];

        if(mode.value == 'unfollow'){
            tracking_username.value = 'own profile';
            tracking_username.setAttribute('disabled', '')
        }
        if(mode.value == 'follow'){
            if(bot.tracking_username){
                tracking_username.value = bot.tracking_username;
            }else{
                tracking_username.value = '';
            }
            tracking_username.removeAttribute('disabled');
        }
    }
    //it calculate how much action you will get for each one hour;
    gatgats_calculate_actions(){
        let delay = parseInt(g('delay_setting')[0].value);
        let interval = parseInt(g('loop_setting')[0].value);
        let comment = g('setting_comment')[0];
		let hour = 60;
		let result = null;

		delay = delay / 60;

		if(interval == 1000){
			interval = 1;
		}else{
			interval = 2;
		}
		result = (hour / delay) * interval

		comment.textContent = 'you will get '+result+' actions ( profiles followeds or unfolloweds ) for each 1 hour';
    }
    //it show the current tracking from each user in the interface when the bot is running
    gatgets_console(status){
        let console; 
        if(g('textConsole')[0]){
            console = g('textConsole')[0];

            if(status == 'FOLLOWED'){
                console.textContent = `status: FOLLOWED; counter: [ ${bot.counter} ]; name: [ ${bot.twitter().username()} ]`;
            }
            if(status == 'UNFOLLOWED'){
                console.textContent = `status: UNFOLLOWED; counter: [ ${bot.counter} ]; name: [ ${bot.twitter().username()} ]`;
            }
            if(status == 'NO-ACTION'){
                console.textContent = `status: NO-ACTION; counter: [ ${bot.counter} ]; name: [ ${bot.twitter().username()} ]`;
            }
            if(status == 'SECURE-PROFILE'){
                console.textContent = `status: SECURE-PROFILE; counter: [ ${bot.counter} ]; name: [ ${bot.twitter().username()} ]`;
            }
            if(status == 'CHANCE'){
                console.textContent = `status: CHANCE; counter: [ ${bot.counter} ]; chance: [ ${bot.chance} ]`;
            }
            if(status == 'CHANCE-DONE'){
                console.textContent = `status: CHANCE-DONE; counter: [ ${bot.counter} ]; chance: [ ${bot.chance} ]`;
            }
        }
    }
    //it show the the [wave] and [total] action (follow or unfollowed) when the bot is running
    gatgets_dataDisplay(){
        let display;
        if(g('data_display')[0]){
            display = g('data_display')[0];
            if(bot.mode == 'follow')   display.value = `wave: ${bot.users_followeds.wave.length} / total: ${bot.users_followeds.total.length}`;
            if(bot.mode == 'unfollow') display.value = `wave: ${bot.users_unfolloweds.wave.length} / total: ${bot.users_unfolloweds.total.length}`;
        }
    }
    //it show the current delay in the interface when the bot is running
    gatgats_dataDelay(){
        let delay; 
        if(g('delay')[0]) delay = g('delay')[0];
        delay.textContent = bot.time_in+' / '+bot.delay
    }
    //it prepare the element to append the [gui] tag
    set(){
        if(!g('bot_interface')[0]){
            let elem = document.createElement('gui');
                elem.setAttribute('class', 'bot_interface');
                this.html.insertAdjacentElement('afterbegin', elem);
        }
    }
    //it call the setup from the bot
    process(){
        bot.system().setup();
    }
    //create the [menu] interface
    menu(){
        //*******************************************************************/
        let b0 = new BR(), b1 = new BR(),  b2 = new BR(), b3 = new BR(),
            b4 = new BR(), b5 = new BR(),  b6 = new BR(), b7 = new BR()
        //*******************************************************************/

        //*******************************************************************/
        let popup = new Popup({ 'class': 'bot_menu'});
        //*******************************************************************/

        //*******************************************************************/
        let logo_config = new LogoConfig('⚙️', {'class':'ico_config'})
            logo_config.addEventListener('mouseover', this.gatgets_hover_mouse);
            logo_config.addEventListener('click', this.gatgets_show_setting);
            logo_config.addEventListener('click', this.gatgats_calculate_actions)
        //*******************************************************************/

        //*******************************************************************/
        let logo = new Logo({ 'src': this.logo })
        //*******************************************************************/

        //*******************************************************************/
        let label_mode = new Label('what we are going to', {})
        let mode = new Select('60%', {'class':'mode'})
        let mode_option1 = new Option('follow profile',{'value':'follow'})
        let mode_option2 = new Option('unfollow profile',{'value':'unfollow'})

            mode.addEventListener('change', this.gatgets_mode);

            if(bot.mode == 'follow')   mode_option1.setAttribute('selected', 'selected')
            if(bot.mode == 'unfollow') mode_option2.setAttribute('selected', 'selected')
        //*******************************************************************/

        //*******************************************************************/
        let label_tracking_username = new Label('from which profile',{})
        let tracking_username = new Input('50%', {'class':'tracking_username','placeholder':'@username'})

        //*******************************************************************/

        //*******************************************************************/
        let label_secure_profiles = new Label('these profiles will stay in your account. add them separate by ( , )',{})
        let secure_profiles = new Input('40%', {'class':'secure_profiles', 'placeholder':'secure profiles'})
        //*******************************************************************/

        //*******************************************************************/
        let button = new Button('save', {'class':'btn_accept'})
            button.addEventListener('click', this.process);
        //*******************************************************************/

        //**************************CONSTRUCTION****************************/
        join(g('bot_interface')[0], [
            popup
        ])
        join(mode, [
            mode_option1,
            mode_option2
        ])
        join(popup, [
            logo_config, b0,
            logo, b1,
            label_mode, b2,
            mode, b3,
            label_tracking_username, b4,
            tracking_username, b5,
            label_secure_profiles, b6,
            secure_profiles, b7,
            button
        ])
        //*******************************************************************/

        this.gatgets_mode();
    }
    //create the [setting] interface
    setting(){
        //*******************************************************************/
        let b0 = new BR(), b1 = new BR(), b2 = new BR();
        //*******************************************************************/

        //*******************************************************************/
        let popup = new Popup_config({'class':'bot_setting'})
        //*******************************************************************/

        //*******************************************************************/
        let label_delay   = new LabelConfig('Delay / Timeout', {})
        let delay         = new Select('40%', {'class':'delay_setting'})
        let delay_option1 = new Option('1 minute',  {'value':'60'})
        let delay_option2 = new Option('5 minute',  {'value':'300'})
        let delay_option3 = new Option('10 minute', {'value':'600'})
        let delay_option4 = new Option('15 minute', {'value':'900'})
        let delay_option5 = new Option('20 minute', {'value':'1200'})
        let delay_option6 = new Option('30 minute', {'value':'1800'})
            delay.addEventListener('change', this.gatgats_calculate_actions);

        if(bot.delay == '60' )  delay_option1.setAttribute('selected', 'selected');
        if(bot.delay == '300')  delay_option2.setAttribute('selected', 'selected');
        if(bot.delay == '600')  delay_option3.setAttribute('selected', 'selected');
        if(bot.delay == '900')  delay_option4.setAttribute('selected', 'selected');
        if(bot.delay == '1200') delay_option5.setAttribute('selected', 'selected');
        if(bot.delay == '1800') delay_option6.setAttribute('selected', 'selected');
        //*******************************************************************/

        //*******************************************************************/
        let label_loop   = new LabelConfig('Loop Interval', {})
        let loop         = new Select('40%', {'class':'loop_setting'})
        let loop_option1 = new Option('normal', {'value':'1000'})
        let loop_option2 = new Option('fast',   {'value':'500'})
            loop.addEventListener('change', this.gatgats_calculate_actions);
        
        if(bot.interval == '1000') loop_option1.setAttribute('selected', 'selected');
        if(bot.interval == '500')  loop_option2.setAttribute('selected', 'selected');
        //*******************************************************************/

        //*******************************************************************/
        let comment_cal = new LabelConfigCal('calculating', {'class':'setting_comment'})
        //*******************************************************************/

        //*******************************************************************/
        let button = new Button('save setting', {'class':'btn_save_setting'})
            button.addEventListener('click', this.gatgets_show_setting);
        //*******************************************************************/

        //**************************CONSTRUCTION****************************/
        join(g('bot_interface')[0], [
            popup
        ])
        join(popup, [
            label_delay, delay, b0,
            label_loop, loop, b1,
            comment_cal, b2,
            button
        ])
        join(delay, [
            delay_option1, delay_option2, delay_option3,
            delay_option4, delay_option5, delay_option6
        ])
        join(loop, [
            loop_option1, loop_option2
        ])
        //*******************************************************************/
    }
    //create the action interface
    action(){
        let action_text;
        
        if(bot.mode == 'follow')   action_text = 'following from @'+bot.tracking_username;
        if(bot.mode == 'unfollow') action_text = 'unfollowing from your profile';

        //*******************************************************************/
        let b1 = new BR(), b2 = new BR(), b3 = new BR(),
            b4 = new BR(), b5 = new BR(), b6 = new BR()
        //*******************************************************************/
        
        //*******************************************************************/
        let popup = new Popup({'class':'bot_action'});
        //*******************************************************************/

        //*******************************************************************/
        let logo = new Logo({ 'src':this.logo })
        //*******************************************************************/

        //*******************************************************************/
        let count_label = new Label( action_text, {})
        let count =  new Input('60%', {
            "value":'-',
            "disabled": 'true',
            "class": 'data_display'
        })
        //*******************************************************************/

        //*******************************************************************/
        let console = new LabelConfigCal('loading', {'class':'textConsole'})
        //*******************************************************************/

        //*******************************************************************/
        let delay = new LabelConfigCal('delay: 0 / 0', {'class':'delay'})
        //*******************************************************************/

        //*******************************************************************/
        let btn_cancel = new Button('stop', {'class':'btn_cancel'})
            btn_cancel.addEventListener('click', this.process);
        //*******************************************************************/

        //**************************CONSTRUCTION****************************/
        join(g('bot_interface')[0], [
            popup
        ])
        join(popup, [
            logo, b1,
            count_label, b2,
            count, b3,
            console, b4,
            delay, b5, 
            btn_cancel, b6
        ])
        //*******************************************************************/
    }
    //show the correct interface according to the values and action receive;
    interface(){
        let menu = null;
        let action = null;
        let setting = null;

        this.set();

        if(g('bot_menu')[0]) menu = g('bot_menu')[0];
        if(g('bot_action')[0]) action = g('bot_action')[0];
        if(g('bot_setting')[0]) setting = g('bot_setting')[0];

        if(bot.permission){
            if(!action) this.action();
            if(menu)    menu.remove();
            if(setting) setting.remove();
        }
        if(!bot.permission){
            if(!menu) this.menu();
            if(!setting) this.setting();
            if(action) action.remove();
        }
    }
}
//CLASS BOT: contains the method for handle and processing the data receive from the [twitter] and the own [system]
class Bot{
    constructor(){
        this.permission = false;
        this.available  = true;
        this.date = new Date();
        this.mode = null;
        this.interval = null;
        this.tracking_username = null;
        this.users_followeds   = {'wave':[], 'total':[]};
        this.users_unfolloweds = {'wave':[], 'total':[]};
        this.secure_profiles = [];
        this.scroll = 0;
        this.chance = 0;
        this.counter = 0;
        this.time_in = 0;
        this.delay = null;
    }
    //this method containe the function to return data from Twitter;
    twitter = () => {
        let list;
        let profile;

        if(g('section','tag')[0]) list = g('section','tag')[0];
        if(g('nav','tag')[0]) profile = g('nav','tag')[0].children[6].href.split('/')[3];


        //list.children[1].children[0].children[0].children[0].children[0].children[0].children[1].children[0].children[select]

        return{
            //return the current username
            'username':() => {
                if(list){
                    let new_string = list.children[1].children[0].children[this.counter].children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[0].children[1].children[0].textContent;
                    let user = '';

                    if(typeof(new_string) == 'string'){
                        for(let i in new_string){
                            if(new_string[i] == '@') continue;
                            user += new_string[i];
                        }
                        return user;
                    }
                }
            },
            //return the current button
            'button':(text) => {
                if(list){
                    let btn = list.children[1].children[0].children[this.counter].children[0].children[0].children[0].children[1].children[0].children[1].children[0] 
                    if(text == 'text') return btn.innerText;
                    return btn;
                }
            },
            //return your own profile
            'profile':() =>{
                if(profile) return profile;
            },
            //return the current date
            'date':() =>{
                return this.date.getDate()+"."+parseInt(this.date.getMonth()+1)+"."+this.date.getFullYear();
            },
            //make a scroll on the page
            'scroll': () =>{
                this.scroll += 90;
                return window.scroll(10, this.scroll, 10)
            },
            //double confirmation to unfollowed a private account;
            'confirm_popup':()=>{
                let confirm_popup; 

                if(g('r-14lw9ot')[0]){
                    confirm_popup = g('r-14lw9ot')[0].children[2].children[1];
                    confirm_popup.click();
                    console.log('popup confirmed it: '+this.twitter().username());
                }
            }
        }
    }
    //this method containe the function from the general system; 
    system(){
        return {
            //save all variables from the system
            'saveLocalData': () =>{
                localStorage.setItem('twitter bot', JSON.stringify({
                    'permission': this.permission,
                    'tracking_username': this.tracking_username,
                    'mode':this.mode,
                    'delay':this.delay,
                    'interval':this.interval,
                    'secure_profiles':this.secure_profiles,
                    'users_followeds':this.users_followeds.total,
                    'users_unfolloweds':this.users_unfolloweds.total
                }))
            },
            //load all variables from the system
            'loadLocalData': () =>{
                if(localStorage.getItem('twitter bot')){
                    let data = JSON.parse(localStorage.getItem('twitter bot'));
                    this.permission = data.permission;
                    this.tracking_username = data.tracking_username;
                    this.mode = data.mode;
                    this.delay = data.delay;
                    this.interval = data.interval;
                    this.secure_profiles = data.secure_profiles;
                    this.users_followeds.total = data.users_followeds;
                    this.users_unfolloweds.total = data.users_unfolloweds;
                }
            },
            //verify if a element type 'string' is into an array or an object;
            'is_there':(db, username) => {
                for(let i in db){
                    if(username == db[i].username || username == db[i]) return true;
                }
            },
            //verify if several elements are into a array and add them to the array;
            'dump':(db, name)=>{
                for(let i=0; i<=name.length-1; i++){
                    for(let j=0; j<=db.length-1; j++){
                        if(name[i] == db[j]) name[i] = null;
                    }
                    if(name[i] != null) db.push(name[i]);
                }
                return null;
            },
            ///------------------------------UNUSED FUNCTION waiting for the 'AUTOMATIC' mode
            //verify if a object has expired
            'is_expired':(array, name) =>{
                let present_day   = this.date.getDate(),
                    present_month = this.date.getMonth()+1,
                    present_year  = this.date.getFullYear();

                let expire_day,
                    expire_month,
                    expire_year;

                for(let i in array){
                    if(name == array[i].username){
                        let user_date = array[i].date.split('.');

                        expire_day    = parseInt(user_date[0]);
                        expire_month  = parseInt(user_date[1]);
                        expire_year   = parseInt(user_date[2]);

                        if(expire_year  <  present_year)    return true;
                        if(expire_month <  present_month)   return true;
                        if(expire_day   <= present_day-2)   return true;
                    }
                }
                return false;
            },
            //redirect to the correct page depending of the [mode] and the [tracking username] value
            'redirect':() =>{
                let url = window.location;
                let track;

                if(this.mode == 'follow'){
                    track = 'https://twitter.com/'+this.tracking_username+'/followers';
                    track = track.toLowerCase()

                    if( url.href == track) return true;
                        url.href =  track;
                }
                if(this.mode == 'unfollow'){
                    track = 'https://twitter.com/'+this.twitter().profile()+'/following';
                    track = track.toLowerCase();

                    if( url.href == track) return true;
                        url.href =  track;
                }
            },
            //increase the delay to enabled the variable [available]
            'reactive_delay':() =>{
                if(bot.permission){
                    if(this.available == false){
                        this.time_in += 1
                    }
                    if(this.time_in > this.delay){
                        this.available = true
                        this.time_in = 0
                    }
                    gui.gatgats_dataDelay();
                }
            },
            //when the element in the list are undefined this function give a chance until get one element
            'give_chance':() =>{
                if(this.chance <= 20){
                    this.counter++;
                    this.chance++;
                    this.twitter().scroll();
                    gui.gatgets_console('CHANCE', this.counter, 'none')
                }else{
                    this.counter = 0;
                    this.chance = 0;
                    gui.gatgets_console('CHANCE-DONE')
                }
            },
            //verify the form was correctly filled
            'check_form':() =>{
                let mode = null;
                let delay = null;
                let interval = null;
                let tracking_username = null
                let secure_profiles = null
                
                let string = null;
                let result = null; 

                if(g('mode')[0]){
                    mode = g('mode')[0].value;
                }
                if(g('delay_setting')[0]){
                    delay = parseInt(g('delay_setting')[0].value);
                }
                if(g('loop_setting')[0]){
                    interval = parseInt(g('loop_setting')[0].value);
                }
                if(g('tracking_username')[0].value != null && g('tracking_username')[0].value != "" ){
                    string = g('tracking_username')[0].value.toLowerCase(); 
                    result = "";

                    for(let i in string){
                        if(string[i] == "@") continue;
                        result += string[i];
                    }
                    tracking_username = result;
                }
                if(g('secure_profiles')[0].value != null && g('secure_profiles')[0].value != ""){
                    string = g("secure_profiles")[0].value.toLowerCase();
                    result = "";
        
                    for(let i in string){
                        if(string[i] != " ") result += string[i];
                    }
                    secure_profiles = result.split(',');
                }else{
                    secure_profiles = [];
                }
                if(tracking_username){
                    return {
                        'mode':mode,
                        'tracking_username':tracking_username,
                        'secure_profiles':secure_profiles,
                        'delay':delay,
                        'interval':interval
                    }
                }
            },
            'setup':() =>{
                if(event.target.textContent == 'save'){
                    let data = this.system().check_form();
                    if(data){
                        if(data.tracking_username != 'own profile') this.tracking_username = data.tracking_username;
                        this.mode = data.mode;
                        this.delay = data.delay;
                        this.interval = data.interval;
                        this.permission = true;
                        this.system().dump(this.secure_profiles, data.secure_profiles);
                        this.system().saveLocalData();
                    }
                }
                if(event.target.textContent == 'stop'){
                    this.permission = false;
                    this.available  = true;
                    this.time_in = 0; 
                    clearInterval(runtime);
                    this.system().saveLocalData();
                }
                main();
            },
            //take a specific action (follow/unfollow) according to the variable [mode]
            'action':() =>{
                if(this.mode == 'follow'){
                    if(this.twitter().button('text') =='Follow' || this.twitter().button('text') == 'Seguir'){
                        if(!this.system().is_there( this.users_followeds.total, this.twitter().username() )){
                            this.twitter().button().click();

                            this.users_followeds.total.push({
                                'username':this.twitter().username(),
                                'date': this.twitter().date()
                            })
                            this.users_followeds.wave.push(this.twitter().username())
                            this.available = false;
                            this.system().saveLocalData();
                            console.log('followed @'+this.twitter().username());
                            gui.gatgets_console('FOLLOWED', this.counter, this.twitter().username())
                        }else{
                            gui.gatgets_console('NO-ACTION')
                            console.log('NO-ACTION ON: @'+this.twitter().username()+'; counter: '+this.counter);
                        }
                    }
                }
                if(this.mode == 'unfollow'){
                    if(this.twitter().button('text') == 'Following' || this.twitter().button('text') =='Siguiendo'){
                        if(!this.system().is_there(this.secure_profiles, this.twitter().username())){
                            this.twitter().button().click();

                            this.users_unfolloweds.total.push({
                                'username':this.twitter().username(),
                                'note': 'it was unfollowed on '+this.twitter().date()
                            })
                            this.users_unfolloweds.wave.push(this.twitter().username())
                            this.available = false;
                            this.system().saveLocalData();
                            console.log('unfollowed @'+this.twitter().username());
                            gui.gatgets_console('UNFOLLOWED')
                        }else{
                            gui.gatgets_console('SECURE-PROFILE')
                            console.log('this user is on [SECURE-PROFILE] list: @'+this.twitter().username()+'; counter: '+this.counter);
                        }
                    }
                }
                gui.gatgets_dataDisplay();
                this.twitter().scroll();
                this.twitter().confirm_popup();
                this.counter += 1;
            }
        }
    }
}
bot = new Bot();
gui = new GUI();

//main function 
var main = () =>{
    bot.system().loadLocalData();
    gui.interface();

    if(bot.permission){
        runtime = setInterval(()=>{
            try{
                if(bot.system().redirect()){
                    if(bot.available) bot.system().action();
                    bot.system().reactive_delay();
                }
            }catch(error){
                //if(error.name == 'TypeError') return bot.system().give_chance();
                console.log(error); 
            }
        }, bot.interval)
    }            
}
main();