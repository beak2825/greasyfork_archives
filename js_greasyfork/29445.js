// ==UserScript==
// @name         PeopleSoft Timecard Enhance - Single Page
// @namespace    EPS Developments
// @version      0.1.2
// @description  Automate parts of filling out timecard.
// @author       EPS
// @match        https://hr.gmis.in.gov/psp/hrprd/EMPLOYEE/HRMS/c/ROLE_EMPLOYEE.*
// @require      https://code.jquery.com/jquery-2.2.3.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29445/PeopleSoft%20Timecard%20Enhance%20-%20Single%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/29445/PeopleSoft%20Timecard%20Enhance%20-%20Single%20Page.meta.js
// ==/UserScript==

(function (){
    

    // PeopleSoft uses ajax content loading into an iframe.  We cannot 
    // distinguish which page we are on based upon the Top Window URL.  We 
    // are checking the <span class="PAPAGETITLE"> to determine when we are 
    // on the timecard page.  We are limiting our scripts to just the "Timesheet" page.
    if( $( 'span.PAPAGETITLE[text="Timesheet"]' ) ) {
        
        // Cannot @require style sheets in Tampermonkey.  This is the work-around.
        var link = document.createElement('link');
        link.setAttribute('type', 'text/css');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css');
        document.getElementsByTagName("head")[0].appendChild(link);
    

        // Most of the content we want to manipulate is contained within the 
        // #ptifrmtgtframe iframe.  We will call our scripts after the iframe
        // has loaded.
        (function allLoaded() {
            
            try {
                
                var ourFrame = $( '#ptifrmtgtframe' ).contents(),
                    timeCodes = $( 'select[id^="TRC$"]', ourFrame );
                
                if (timeCodes.length < 1){
                    console.log('no timeCodes');
                   
					// The iframe has not loaded yet.  We will call the function
					// repeatedly until it has loaded.
                    setTimeout(function(){
                        allLoaded();
                    },500);
                }
                else {
                    console.log('Iframe loaded. Calling checkLocalStorage()');
					// localStorage contains our user settings.
                    checkLocalStorage();
                }
            }
            catch(e) {
                setTimeout(function(){
                    allLoaded();
                },500);
            }
            
        })(); 
		
   
    } // end if    
    
    

	
	
	function checkLocalStorage() {        
        
        // Now that the iframe is loaded, check if localStorage.getItem("userSettings")
        // has a value and prompt if it does not.
        if( localStorage.getItem("userSettings") ){
            iframeLoaded(); 
        }
        else {
            // Call function to prompt user for userSettings value.
            showUserSettings();               
        } 
        
    }
    

     
    function iframeLoaded() {
        
        
        // Cache a reference to the iframe and the "Time Reporting Code" <select>'s.
        var ourFrame = $( '#ptifrmtgtframe' ).contents(),
            timeCodes = $( 'select[id^="TRC$"]', ourFrame );       
       
        // Create this button to be used to trigger our auto-fill function.
        $( 'table#pthdr2table span.greeting' ).html( '<table><tr><td><button id="autoFill">Auto-fill defaults</button></td>' +
            '<td><img id="gearIcon" style="width:20px; height:20px;" alt="settings gear icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAADAFBMVEUBAAAAAABAQEAQEBBgYGAwMDAgICBwcHAGCAk0O0E5PUFlbHJ2en9pdoJxdXpteYVZZ3Q2PkUsLjBDSE2PlZqytrvK0Nbs7vDO1NmosryIlaJ0fIVDTFMrLS84OTqgoaPAxcrp6+3m6Ou8w8yToKsNDQ0xNTk3ODji5ejg5OcZGhoPERLAyM7Q1domKSwvNj19f4EoKCnd4eRwf4yzuL2qtL0hJSlfZm2nqatQUFDc3+Ocp7J0dXZMVl9hYmSIi43R1Nbc4OOEjpgICQquuMCWmZuSnaZcYmiYpK+5wclPVVrZ3eFKUFaCiI7X3ODg4+a2vshZZnELDAxqbnHX2+DIztSwucKtt8DCytBfbnzU2d7S19y3wMjHztRWXGG7wMWhrLa6vsK9xc1ITVEjJCUyNDbEy9K/yM6eqbSjrrgpKy3KztKgq7WapbCzvMQmKClRUlSwsbOcqLKosrqVoa3T2Nx9ipYvMzamsLqboqlaXV+rsLWOm6iRnal3fIC1vMIcHiAVFhePnKiMmabM0NK+xMqGlKGKmKSJl6SIlJ9SVllRXmpjZWiAj5yEkqBSW2NHSkySk5UtMzistb5xeoMTFxoWFxgWGRx/ho2Mkpd0hJJeYWN+g4h/hIl/jpyUm6Fuc3iIjpRUX2hXW2Bqcnl9jJp5gol8i5kbICOCkJ5kb3kaHiJkcHxtfo5eaXR6iZiBi5ZARUqCjpoVGBt6h5VvgJBygI46QEZhbnp4iJZ1hZRLV2I/Rk1NV2AcICRETlgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgCq9tAAAAAXRSTlMAQObYZgAANqxJREFUeNrtfQt8VdWZ77eTnHPyNBCQBE3ABEgNGFReoqhgAJHWtk6ndsivRWZq2zvePm1v2zu1vepMH9PpdLzt7b30d6u9pbY31N5WSqtoIRGlWstLS4BoCAmSIEQQEk5e55zAud/3rbX2Xnuf/ToJOtZx7fPYZ5+9117ff/2/bz33twz4Dx6Mf+8E/HuHNx2AHDDOe/+ZhvNZxPWXBUCeMRr+3HT4c/8SAMjLSY3hqsj5NwOFNxqAWCo9vvRFEn/JAFyY2McH4TsAvAPAOwC8A8BbDYCYYQC90oZhnBOfeXjqMLhb/LcRABONVBTF9T6fw0kHDm8LAHIuPT3JMIYACocKxSfwDlhHoGhQ/CjMMYaHJne8rQCoyuUvIbEUWcksD9mvLByKD78NAUAICrW/h1DOokGxabu0FULk0NsSAAsBIb3g/JCQHgrpf9rw/76+vxQAcs9lA4D8I83bYBGkzV36wf8MFqVDAuBz6zcNAGzCe6fQAwBDXDBUqG8KGCVztD0QADzXGG//wXgBMNObFQCQdr9vWgGAMZ4YCQLA/95vCgAR1WL3SIUFQJ48K5aIJeiwBwJWRLFXggBQMeSNpbPhggAQS7ok3BMAOiOWcP5hRWBIgGTciSAboEURHUefwTgAiNqQd02lDQDO/BhWd2MJt7siAun8EcEROjHdHi5qCpEkjDWMGYCY855uydQBiCakaPkjtBm2S2MJcVSKHzszMdE7HCpmGcZMgrECEMnsr3NJpwaAKT/ZADR2JghpYRckrAlzG+oOE7EZxmoJxgiA62Vp79OqCkkm4BdmNr3xT5Q7TT/MvwDMvYRfMRjy9m8YADke98o4rDMgiZuFQBKFpdZvbMQmtfbyYYBHosdUJxgLAFFPtjmTqjGA5Ffis7ZTiLnLzi9vADzTPBZbOAYA/C5Je5xaZbWBpI7nBzHWE4As7v9GAJDnqH7PfMWnNDRjn5XjPBaYVK9i0JbiOuOg/arcbAdTsgXAaf1rI4bR6olAJgMMjzMzQ2yff5QU6tPpVLv9smxLgywBcKj/zCLU5Ujei+4IxEZNqyQAsN8srbpB3D8tBuTkWYW8Q/6UAYUjdhJkaQiyAyDXbmfro9yhk+eKgK2omJWbzryZPwXSetYqA58pP0Cxsct2YU5WbeSsAHCcnDuzcMjwQMABVW1OuhCGnfGlKau9XpYKWGI55I/IGC/amQ2yYwfAfu7MSf3mfp7dDix+3nkpAgBlZ2DiGfohPjGdPuIXDqXbnZHYo7XkByh7rdtWFc4CgfAAOCr/9enRAqs3I2VHICPMTRZIAijpAQqAu4a9XoPtvjEK+ScSqLh1TrOrwZI/XHAAHMXf4jNI6QJrC0Cg1iANmCg4gO8C5wkZ8g85VMAp/2uXDGtgAky2i3zDMxcYAIf8N77mFOGi034IzM2F4YoTtE08U3GiAEIEXwag/KUYGVCMMgsmPDUmBEICYJe/wTiWKUNPhScCMyvyX4fSE0xWJEGsH0KEyfFTHV7/1b9WBycAKgC0qHL7bOeHRCAcAHb568+WuZ3kwYG6qn5hPQQFIEB6feBgSrq7zUt+Dva4yo/ZEhAOgVAAOOQ/Uel+mgsHGmKp1wFKaVeY6Zgz1VCq/556fOqZEesvrNZEh1s85XeGtinZIxAGALv9X+zd9+LkQP1Eo+g4CaJf4qcAU48P1xyecdwCoB9K2xa+4ojVlN+MCUFkkKHoMf3MMGVBGABs5yxOYC55bbt0DixOTwLM0IzoRsTJlNvHK3sqe0D+pu+80TMT4Xi+dfLkntL+/IvyNLlI/pI4WL1I5nmleNyOQIj6QAgAHPL7nttzqawTzuyqnAOdNfjKQGCikl/+luABooUXOK5AfajsyY+VGsajUv4Tc/or46hRE3Wc8LTSkjjiAgVbskMgGAC7/GUBZ+9iBGbO3bFQHUHDP/kUwCWvSvHxfRQuhzao6p6djPFgGKYbSvcbvXRN3ihdwpfxRiQ5BZNh5037Dgr5S3oq44nJPVPtNz5eSfIjkGez40AgALZK/Y3FgXiRFkTfpw92k/wo/iUAr0I1bG3ob5+/Zz71kEGypwaMwzVGZ3VXdRfSByqrD9a9NM0EbiJBcRzlj2HuHlowupEMMGkNkt3R4iF1iovd4t9px2cfGCcAtvbv2tcD5cembIFxyn7kDOU/bi/P2QX1CdERFkX5gQkARqccJkIAelY9CXDL8Pb5lmSVcGoy7RyadejaM39cxCIed8oPNPQWl6pV82PtjzsfHBcAtv6PQP57hDOY+y/3luBefWs92xDMUKJAZ2WMRwM7Kf8JAED5Vz25Cp5EGK+kkaHcc7lA1C7R46OfDgBy6ShIywo2BD72o3EAYKsAZC0/5QpGkFsCRWexrbJiG6zoLe9NQCwa1xjACABCQAUCQUAIUOjrqMFjKD9m7YAZKRqAqcdLQCJgjrkiSlrhYrOE/tUBfwD0fxeX5cIYwrkJWxtg10LRWKvnwkuqABkBBwNIBSQJgEaQTuewMREii1CM6j7AyObCOT1FBADwCz/6dAR8DaER9s+rZpuDlbkMv/1TpCjjC3Yug/1XEAACgnpigFQBZQO6atIof/UOIsCqAz2KAAQBJiExMoCW12RA8XEFBilG3Epf8fG2OqtGAnXrQyLgB4BuAK+6rhtK+ibEz03om9CX6/KZi3+zzOILj+ay+CABYBUQNkCqQPSlyqiYLNEFTAHSAKECAoNDV6MFioDxSN1UCQFlP+46ZJd/iMoE7rTUTW1ZWfZ9618/Q+gDgN6p1zD1rLhnCcl6boLLJ34jQvpX8zK+VgGAQdoAWQoke6CGjkr5NRUQ+U9VAoigDeh9pgEBKGbphAYwBOb2Kmc+8P9KD3L+pLUNP/vfxwKA/tfnXovr90QqZHyixHHFTeJD87LtOgAMQb2swMpSQNiArmpwqoDUAqrqRSCCRCQIZDjetohugVepEG+rk9KrM+j31H/T0u+tBEaof241QEfcfQOEgMwxfzUva1mV4rTrKiBsgFUKREX0GSogDgsViJPKx+DF/Q1SuLZFQgW6qtWNL9mNR0loFp1Pibctuvw7YRDwHmfTagCLialUHPm/gN4EFOy7HMgysvy6CkgbYJYCFDprnCogOYClgMkAEqFP1knRBJDsSAGFPZQgBA0tdeJN57QsQoXRi4IvfTtLAPQm8FWzBf+DXgwShn29sBRyWxpaGpwqIGyAKgWKBjtr0AZ2pWtYfnArBSQDqB8BRk7RANvAzkUSgbmKe5cAU0BuDUwU/Gz5gFYUeDWNvQDQjjeURSF0wGQ1Y04tJQZEUk4VkPUAWQqwDaBiwKECB+YIIyBLAY4kRoUh60HLop2Ldi6Pm3CL0LxWqEGLgICwb2k436oNGgXN47IHvQScdn1Y4Yn9zeLJv6XIAMldTQWkDbC3BbpqqCJEVUHRFlhVccKFAQmGIJGMEwWQBIy1eWssB9rWPgwNQnDz8PR/tlLnURa6A6ArwNpsRpqa8S0AcDJAlAKZbQFKwmGZih7ZFpAIcHtfMYCmjwBsgnnPXFxNFLDJD9TWZD3gzCft463u2m9Zp7grgTsA2tHI7b79845wEmDl1pVPCgbYbIBnW4AYYFpBsgJzUH5RFwYbA3gGzRZY0Ze7D6p3XowHEYHm5fxG4JEAa+Hhhhbgl9gA/karDwXPNjOFtkqAhsWbQ8qOqdmH8p/PMRngUgpktgUoDbI/gHRgzoE5jIALA2jbdNumNf3dzy/fB3P3WeKjBcBTHkb5LdH5Vdf24a5HzRTOchtpcAVAO1hUDWHDSf5UAGD1MLMi5GwL9NQwA7A1CIIBq3T5R+w2gL42ATT2lbY/A8ub7Rv9udaSXxEA4BP/5E8Bw/9Y3uWh5Ye5zToAKEBmRcjZFhAEUK1BCiw/60D+iFYT1FQAIYDuJ+BivJ+OwNqHUX5osPrQaZcOXnTISmKoCXd6G6Dh+l/LjA0OFzsY0NIg7bFPW0A0BWo604ZQASIAMlqWAhk2gFUA1mCiW6q2h82Xyn6rUeAyj8wFAO1QXY4BIRG4+ORyBwMIAso9/7aAoICIo6cSpQckgKgLuZQCQPL3lxrQtCAsApM/eL/1I8yUQ1svaKTWCAfAxXO5CPRjgEtbQNiAarMuvE5E5sUABgBtAM2r3ph/Kky6YPJyrRyA++4NBsB+aOGQcRLOl/eW22E4n0MvEB8s/j5XBugAgHtbgCfPKxsgGaAXg3opsAVuIzPIWRnd+1yOSoZ3eHeJLn/ISaf2idi1k1/KOEPdVX0vh30uDMisCNnbAggBqQDVA0RgA2AywK0UICO4hiGDWHrv8zInPvUDoPoHiE/akV/w6dcC5A8sBokDDgSE1BryF1OVzIUBjqpwRlvgpRp5N7M1wPKbNsClFMD8hzVkA5ABBux53koIyytAUF9h5A+uCRIHXpt9EGYfVFt5b4647bLtLG/5XGoAOxlgNQc92wKSAWCWgcubdQbAoXrIKAVWl7INZAYY0PU4J0Tlt/hWVFi5NYT8nvOO7RyoO6nPxVu6A2VEOUnUnBt2iEQ7GZDr6BBxawuI6LA5DKImaDJA2oARxMDZFoDVJL9gAKSPPH4+h2VeuXXZdvqkDVYCv8PIH6Y5TByoe1r7iWoHbH1u2IGv5dwIzGQAVoUzSgFRETRLATkwoEpBBwPyYQQ5kNEWWLNxjckAQgCk1AAKAGkEQsnv3SPk5ICOwFLYccPTS59u2H5+6Y7lslWeyYCGzFKAR8bMUoB7hVVzGHQGyHrAyKFZJXsB5oGlAmQBTBuAob8XtlqCrwT5QbkWZP8DAMiwAzoAO84vfZrKoGXbL67mXtFgBmSqAJjloKoJOmwAFgOtgBBIAPgYGQGhAjExotj/M0t6DCYW4fI/dK8wLJy0Rwdg2fYb8E3yA2TFgFYqCcweIeoR1BpDIOUXRoCKwdZZJbDXZAABsGbjamEEBQMg9/XXWHQ7CpCeFE5+34ERNw4Q8dHcPClyecciHgPwYoC9OWw1hlSPEHULa0NjkgEn9B6h1muGIgBWRYiM4MZGjQG5RvNUIbMIQgMuD5n/WQyNQWQ5ckBIz/2W+JmznIZ/PBjg3hwWOiBLAas5rBAQt9LbAq3zUhHQK0LKCDID0tHzQ0UHMoQIL38Wg6OEAOXr9mUR8fvJpVE5CuTOgKcb7M1hIX+rqQI8LMAPTnswgKuCkZTFANIAYQNNBkQTeUMblzucD4TmfyAAmQig/C2y2zp1YBoNCXrbgMweIWkDSAUQNH6MSg2O2hhgyY933auXAqgAa0byDc0GIIBHB2yJzkb+wBkiDgSK2bZxnqS2zwcaEfW2AY5xAc0GUBGgdWqb8jfbmsOiKmwygL42yZqwZgOGCo30iTOmB4pUJCv5g+cIuSAQwbtgsvrPgT8DHOMCggH1CR7kiFoDY+bgqM4AKgXkPS0GbFo9oU9ogGYDCI2hk0PCLwfeMS8r+bOdJfbtvRGq4NKW2wfZMMAEQMYki0GuDkSV/M1mXZgJwDaA5WcAtqze0thXOlIwXKDZgHgh6UN7jN2SUMLmfikb+bOdJ7hgBkj5ty86B5CFDTBLASAMEtOgX0YkttJeOKa1BSwA1OgoA1DaPwGGC0BjQN5ohL0ONE9VDJj4w2zkDwPAtdaDGt/ZrRIMQz2V58bEgNbaaR6TZUt7o6KBbFaFqSIAXA4KAGjewYThfM0G5FL+GxA9c5Llp+x5woreZ17AmBgwe47ZCYAKcGaiHwPov8xSAKtD/rPFR44tt1WEqCIAoAHQ1AhCBUQpkCgcKkIGgPFyjJ6zoKzJG7KGAi4IA6xTcj9o7g6dO+7PgNyWpbkZ9QBYkT4bdLv+khqzT5AaA1AvKkKAJmD1hOFNsk9QtgajaXY8YESTRzBRogcmsemCAmB1kjZMMgkwBD2Vp/wZYKsKL28mCArg6jCPNfaXFJoAEAPIDLIJRPmhoKlRSBaVNWH2PBJLxn4/HSnA9NIokNkJmj0A1hmrL0JZ6LVkqJ/l97UBuaBVhbENwQbuuStCAIA32Cw6RUd4UIN1QBCAVMDGgDzUAG5PRJMHikDoAFzzeTOq8ZcC2jDJVw6zNPjKbSstYQD8SgGwqsKlsE08Y5Mp/35wxWTXDWQBEIBZh+aJglABAI1pI4MBEEtGt04302wVBIGP1GdREXrgeRRFJLgdJAAQpjV4HcbxrIyEY9DCFfvFxxX7r9ivDoj9gvkEwKxDggFbVksEsCosOkQsBnBBgPVrogCH/sV3h6ZAEADaTIFJKzj/ce/KtlIIZkCDnCKBVyx51ozlChkH7sxu+eJ3+uZ/IH/klyMIDD06I1VMnDmzIlMFSAH6tf6ACMnHpUBUp8BlXzHvF+RcJAgAywRGPtBfCv3dsAT6kQAQggFyJut+vIQCakFVN1RRty5MLtu9VZ+H/b2mledOwdHS/XQGvxCz4Rvyqd5kZ8AEaLL6BNMQAVUKRCF53BT23ENqL8gMGuFwwFB02RX7MfUozkAbhGKAqAjsN/Nf1OGgat5Lv3UrDCLvvXyv6TRhCQE2/LmNYFLAaQSjsh40WEgVoSR5HbEoUP/pYIHS2QHQMOkg5gtmYH9pOzAAk4NqgoIB+5c8O4waLZ5urOquWvgtbx8H3/vKZXhGN91oCTEGEcAGNAFg2YD+UrAYkCxiBmCLIkbfe/En1Qbh8EWPBkqkAxALfua+bKqQvr90+yX0HNjkeElQa5AZgApd1b1kG1AtAAU78u1P+d7mB1++jEhCGPBF84/ZGED5D1qvMHnoYm90MepcMPbFYLAIEUgWPXYsUCIxZ0gAkBNcY7p1lLKGEMg5zg/CTUYKhGBAfzfJvwL3jnbD2pJPBt7oBwMPk/xLjnaTGgDN0bMxwLDVA4QNYBXAb1EQUNuh9DuBNxIlpKHxwC/k1HGu4Ecx1gZQBRIMQAADSH5QF3ZXtHcH3odC1eKDjLWgwVCNbgNKN96Wr40MRcBUgTQyIL0zUkQcSBYNLvnPgfdJZwPA6qOsnNBdFaG5XKgCwa1BBKCfLxGv9/+yJfA2IjTc/hu+Aj9g2tEXCQGtFNBagwoApIBBXUbprZPZIyci0L0l8DZZAfDDTVL+bu7HUSoQwID+bmHT6MLzvw8pPoWbc4T83cNQ214hCsLyedQWRkvap2wAyz9YaFD2x4CrxHtBeiWdfk8WAOQFzoVs6K2STzj+jh8cZhWYGMSAAZAZ2V1V8nw4+qtQtTgOeOm0o7htq0AGlPeuntDSgHfTR4byUmwDqG8pliArmG6NCflhcCiwHGCXOwxANLCNVraIZKGHPcv2FoBVDPoyYH+VeX3qGbdbIPA0zOrq+ydym/VMSMmxeXt7y3vLUX78ZdUDmAHCCBqCAOn1i9VF2wPLAfY3Y5g04ICVm/swxL/7Bft2S6l6ZLCL3X+qYtCHAU9PUervKv/iP9p+XpvhdkRH4NRiZEB5L3CXUOmI7BOUPcaqHkAUAEsH5o/osTEaP/o4bf9iHjQ925gANATOC+cyIIwNgFyr6ydDfldfP04eRm6MqN1YRWtJBykB9wiJtEelBqiqcIybBLDPq5pFesJdsNazNJkAfG8nZ/Qkjzjwz7I2GwCeDMAqzCR1zaRn7Prv6ezJ4aaqao65W3K2YyZ0gFYPQH1nBnBtgOVPcsFo6UAmAnVtgK9LTQooACwbuPakt/RCnF7h4SGwHjAFrjKvsdt/Xz9HdvdDa62paTM64iUdq2ECsBnAtGOGJ7jWk0fdIWwCeaABdSAgLP2EebdRAYAF/I9+l/AHIPpHdn4TbAPgZvOamz6mx+DQfWew24L1fwBpe0qO9QKUNzStFhCgBkASilB82R3EGwkz4ckI+AcrPURFusaygSsvPeN/8XOTRIsu0AZMmQlw5WEaszt2kV7/ya6XsuHs5BgNfsQSsctfhHhvI/cIkRloWocNIfJFPZpHJoA6jaPCYXNrgD+5GZd9VE+NHYD3JyYN+F1cnN6bLtQB8GTAzWY8e3UDEMbFk47ArBn4MWmgGF4v2YulQDlNumhqbFpDZQAxgDRA2YBEjBnwzcVBN/i5JwCRqvnxmOPsK/8sPvm7+OBwOAZMmUlX0Lb677OU347AD5vjJdEBIsHl/49UoHHXQiRAeuMd1OTDan96qFD2h6hJd8bjFVB2uuw07tKX2OWfMOMwbZD/kJYeGwBVN0Iy6qTAlfBnlf8DxXvADoAHA1alzVh+q5m1sC6+NARybuYcKY4MdvZR/rP80LSGBlexxC/kWiF3iCTYBOI9tlTwlUJmsO2j9DBw5f/RfVXaAFh7nqZuocQ9lSS32BEYEAzR6IvnIB2mFFgVZ8rgq1nDM7yLM/2JjXfzGCrmS83mmQtbkAPEAKkB7J3f4AoAFYNivLkjzs/5ny5TH/x9+kTFjMMDxTMwXbO/paXI0DsDSm6hm3HK8Y5CAoSAqhBi77lJEKoUmB+TF8DV95miBNh/PWhlQc57ISoI3nWmnAhARhBVgKtShWQChSAx9tlKDNg6WlGmpDZdHiAFZpw5PTCALIbb/s4E+rwdgJ88hvfpqcS7RZOiYKGPokFzP70XQtmA61D4Kx+rhJ5Wq8qXlZ9DrT5Qcks0GS+h25/taKRhZpJ/HXd/UjEgOoUhPxGV88ggeeDE7IwIT5MXqxnPFl+JpD5nOhkRAFh8WzV1EOXHxJsAJDUwkGAdwxCmFGgYEbMAe2qu/6wZeXYOX61E1c8fJH3H2095YiYsJBVoWrdhjSm/iNtgr73UHoRks01+yQJEAPMfqZ2Emge0RNkAuB2UyCCyXkxjMPeL/miEYsD8GBMJkiNPmnFn6exUqxWvuqjoTJTE7TozEzUAg5CfIEjljeYZalxAzqVEK1hmZjpuBMdB2kH6i3T90h8AppHrZ7zLCFUKXCfl72kb0m6VXbBSVfgeYPgBzi7c1YEmYM1GWMO/qRRgHxzKBjADoOMQynxw9kGoOAG8Ry84iPKLVFX+xgOAiStYTLybx+vgOQhTCqyKRykifG0ysz1rp89W2zBym9o7C6Ihd0dy4xomZRHNCTLk0JCyAdB6kcpzRQAQ8kdFqpKdpsOvDAD8w/ZJEKIUgGXKgp21NGA8Lp9XnRITR2DKE+J7zUbcAEQZyP0geikANOZEmU8POQDMZjJQJaZHRgOPmvplB6A+6CHBNI1Z8p6vDZivJsA9YXVpjAeAklvkzpQOwYA1sPHOFESIAXkGt4eAGSDnnSEA7GxSvOgZj2Iq/mJmGl7yYMB7Cv2TBG2jEKYUuE51qwyZbr2yqAOoYNUFzHShFeywM6DIWpuDGCB2119miwgpQF+aFyQrXXYA1o6Af4jsCVUKLHNDOvuQyUxjjxCfbCBIBshSAKhbNF/cJ9mcEVfxwJK2zhq1vk/+wz4AkHMSrzeNVgeXAlBVLe+kFzfjAABLJ5pU3Flj7BEMuOOna1AHkqoiaAIQE155XABAAhhmGjo/9GV3AL6921f8ruq2lBGiFFiZYBy7qqf8zwsEwCdP8tN1AMgAenBwTfSna9gFh+oRMQHgcsAFgEmi61Am7NZ1Xgygf302atgElwLvP0MnI9BTzSrnmBYAsepCtxbQYzWYzks3EwB3/BTQBgoA0gYNjysAZDmYMShEvVyd1V30YEo1nrzAkwEBAMSNMKUAloJiCnyFXufOPlhtlFsL0yKVl26+jafArdmoGMAUkGsYxcyqYH+pfZskB9AOz+BnFD9zhzsAP/2+v/zV+4wwpcCyw3wydJWYro7HCcD6h/ihohq4NGcTqwDKLxkgKkF0plqtBcPGTPn5saQawYLOz9hUwOoTfvh7UNrvt2GxboRggADADvRYgpkzG/4H1LC70cUxEAwAE4BBtU4bAyDO3+iQgypAnUAOTvnvztttKmBNjkAVCADAKJB382PA+1XH9Kc1oMcFACYMEUAJpggAdAaI+REOBtjjEQ9lUQTy4SxvFQhIUVwsFhrIAHn6nXeZooxXBWTylwI4bQCoYpABMMpPZAJA9OnU5LfljA7A6iBPAXElfzgGXDAAbj3BUgDML3YyQIyLMABA/cJpagZkAmD/fbtHKYCq5h/O0ZT0wHqACwPGWQz+/DdSgklXOG1A2jAZAEiB6b1IgQrHJPma6i4TAcbCiwHf/iWQEN7v2j1iVVD/GSIrX5Ln73gOrBtlH6yK0H/aw45iFuxeammAYkDEtAEsTnlvObQNP7Ngt9pgeVd183Ks/1DyhL+Z5WVe9YBfgi8CULvHZIBfW2A6yPN3XyAAFojowMUGoPCqFADBhYpeaLLFs5xrf0oO2vNSAbQBTvc8tg2694SxAeeX1cgrEheoMRQjV1GYmQuKIMMGRCwVEN3cU4+PPLpgNzlkIgLQHHWrLi/T5QXAe3p95W+G7glmKSCnyLi3BrvkFT8zJ2mMqzn80X2CugugCDJtgKYCZBHKe6cesPphKEdJbvUW236P5jAh7RuOvIjyD+tTZFwZMP9Kef6hX4N1pzETAD4wC6CZshMLAVcG8FmCAWgEpn5t5W7LBriIZGNmlgCAXCHXd6bora0ynr1bwbrT2AFYOQ+zTQfAbgOEFZDPmdJMmlcH/cTH8LgXAO8OSFPnPmdV2JUBqy5VF1zVqPbG0Sna9F1WaNhNJiCjJpjK01SAAYAdBpsAvKbUPW4vAGDBnIoAAJxG0H1cYJnqfXzBmhsy9m7xm68+ISwaKAD0tkDa0IwglHdX9ZYzAGQHvQht+Rd1APDJPwXowCZnVdh9XMAEQNOBsQ+M/ONhKX+6GDIZIIYGhAqMTH9lOvSW73190usH5hTsxuw8UaFvMsITG7wAWFlbbL9Cu5a/Th4PxYApt6o7723V7jU2AqBinkAFoBgUAHpbQDBArGI5/ZUZo91Vrzw658CNr08aKoUTDkJLMYr+mx0Aq879c2/nkSKux1KhGADmJJR5f2PGMNbB0V88XtE8hy0PN33cGWDESP5uLOxHofsVWgPrAKuz/SlNCcncD5swO0aHPzB1oMKbAtjKGPlzuNHhZTUDxYCvE1B9n3n7MQ6PfxHkylRMAHcbEONFTGk6DYz2/q/r4YB0TOk0aYICcbN0FgDoVcFrPHWAhxn6XnZ0inowoGFy8QAUUxvu3RYFxjZBopC6hBmBriu8GDBUlkjzBBgG4NVTk+TUsooB1xlPr5l9hs4ZInNv8J0iBXBgwOoU5caQ1xyhmy6GYnF3jQJjmiLzRYKRHrfJP0LP3ImnYjNsAB1kAiAAlh575OML+mKeNgAeedoLAHX5vuFQc4Rg/gwpP9z8YS2a7CdJ/fz3lP0oP+Qf8WSABEAyYJ+gzLA7ARCCW8zaScY0uU9qSxm4hicmpoNbg/i56lKOhz6e03x6Zj9NrsEYhmKKR8rvZQOU/DDaRg905CMqw8WushSDbbjCDsBNswMA6O0K0Rqkr+vEemQY2x+mj2Oi5CvX548U5DIAxeIhWxcGxNgCtNfyJaMvsKfJAqSFx0jfUWtdvrRzquzDz4N/eK1D6EAgA56cfo26ZoMN06ymyj78LGVwHgIgLAC49AmiCTyNuZJTDUIFno9T9qe9xzlXrFV7aqqs1TG+uga8A8sh7UdAKQCwdGCGed3sL+vRZDFZ+vo5MAIlo2kYQfkBTCNo6xVGCOiWM0CqwFbuHaMFKjzu0WkWAmqytNYcujFo4ebB3ZIBk8/5eZBYNZJ7+BozrpZDtjjCTpfP+zBWcMuGkacMgJsNoJmSafLvqFRg9N4VdPpISTzf4ybwnK2bxvHARF0QACdelmtNVgY9NZY7GVRk2z5yv0PSMA9MNH2VZCECYEOcjzhsAOgEQPmZAvdcz60CT/EBDpk2KRMAqPe46EvKM7vxJ/4qLQnwINHQ0nB+ionmtq83OmMMfGSmLrlipOx0WdJISQAybQAIK5hz/lytkn90B34Uni6Doev/BdyDvXkS8qGpgjuAvQFEUr+Wy036M2DVk0sh/6X54iL82PatD7nE6vfQFOZ/JAKnS9KjJgGcNkAYAazOnqulochq+qvrCPndwQvzf9EHAcF6aCrEY3OzQCLQfTQUA9iPUL5wBkaXbfnMZ4PuYQtzB1eTq84IpFKa+CYD+PEfyv6iNBZFkep2goAocM8KAUAqdSjwMU3rsbkQD05e8l7p9wh2hmEAqsDSXCg1NGdJB0KvhQxk/yNpmmmUNJABRy7TIJA2YKOYKlk4mncuNwflPyyN4B9SEeHp7LnAR2eye3K07HLyZ0NutPrIS38QA0gFkAMjJ+tNz0uRpetDPzq788MREHJAKnJIyp9hA7BWl8yjBgmgCRBGoP2YuDCV+l3w4+NZAZDzceHSKRXp7QjDAOlMLV7F14hX6W/DLVbxvdf6hfgoB2NXPHBEOBexGMAzRYuTUUjlAjFAGsF7VigAfhQ8HKkBEOLx+YfXA7A/l72TekKVAkvZf8T5Y3iR2PDoTweCkzX7H7dbPxgAll9RQNoAUgGUX5KL52NUIwJPqSemrlkbeCP98fkQDhQKrpbOTECYwcBSQHpVPRydp0ezc7c/BLP/yb6CNipBBGQ9Sm8N0i49JRZJ5QoCcCFwz2p12UPDEBSEe5XwLjSWPSERSO0MVwpIz9IjPOhuobDwX70XKa8vWOQ4gthiHh+xAyAR4MkQuTmpiFABhMAEYMr2YHuTpQ8RWJTXu0IQ7CSZwUpa9jWgFBDu5M4fg95yHYKGeIFbreCR4Yu+Ix2nmceEBaVllvZnMEB4UkKMa5X8rf3q8p07gwWyAeAZrNbJIw/Fe1ezI4fr9/Gj9ACBpYC4sn96Kz35rUfb8M9f+cYu7ffCe775D83kIUGkf4vIyZSUUCqBbgPQCLAPDcyS6naoFRPz7lktLt2y+kYT4aC+2CwcKV1SUD5PJC2JaZ/K7vR8SwG15tP+qlNnytkhGkzoky+K6FfGWVja/+JFZ0v+eovibmk/+43j/1NYpZcuRQ+BXgxyKQCKAOvvYgq0197910r+X79qpnq8jpS0Ewqupmf456EcaAVQfl//AaQCigH7oark2LV/vDZhkZsgEL8m9FmH5N9bCOhyq1lC5UAxe9jSGbCOZ4dEUlJ6PPr9eRzZlnJ4wTKB4/YpqpWQj/6wYyZAB7IZKcAI+LYFlC8x9o41vLKVVv7BJJInANzhrz7pG4TdQ5CHjD72FLJlZkd5/YhaYkMxQLMBQI0BiwGkAgjCBpCR/etfWfKN25madsYmWr2O5MeCYCovDO1XCpiepYkBpf3TzpAtvBZQDVowBvxoQUJRcoFELr82gRAQDQiZksuoQ0c1aTMYQAS4w5DLNSsG3H2nuB4j+JL5jMmFcKqqOVRctgGzhrMx2cMLhPuWAk9rXlX3k1uksigI0UlKlr9cKBUB0NCCEPTFEkSRqwfYq6adAUJ+EBNFpQKw/MoGbFgtrx+qM8vA4OGorFxqvme0Y2YHzFyIQr/CMfuXAqYKEAO6US1rT8051MtD+DCzY+bCXRgbbfRcPO3jVx/ZPtWd52CA2RhiADZICFQxeHch8Yl9TEy1ml0X2KdoQ1shUYBUtTt13LceoLnXFwwgf1K107bNL0QIaBgfI+oV8jMg9FAoUWPvLBrOOuHCAKsUsDGA8p8gaN0IjcKG/MoiwAV3q/uelzCfGvvIqVfBND8GyLaAVAG2AXC0W3iVKSnMP9KRcRcixIoRHsyzOZUFpw3g2dJmKSAQWP9AO2tn3xZobLrcnAEUZjgyKwYA3LSkCTMLmhr74vv8GGCrCAkboORn3+Jdy/tae7V4y+Fq+JPpW9ydAcr3Zv5G+NiDa5RzdWkD9jdB43ABfvQd0BsTF4IBtjM2fYE+WdNm5YT0LK1sQK0VDa8vUDRoVAtf2s3m8gIb1mkUcGcAPTKEFSEjmlYpEwogktU3YcFteoLHXwrYTnjks3fys7u0zZzUF9AWsNuAabTUWOv8uFxlpmhQLDVmpC33+pZvcZ9SgNabYwBERYgqAFB7D6hkNT70b7YO2PFWhGz/1/VZ8jc2XX/StxQwPUtbpQCH+fH2+XvmiwUmeJkZWntaX2DC8i1uZ4AqBfipMY0BqAL7tWQ1PjShLQsEjCz+fqTTPnC4OyeUZ2mNAcBqYK06ay44iG2ZHZXmKjMBpQCtNpaWDGAKtG5sHDMCRvh/Mf/t/zadXexbCthsAMsP89Xy5PpKU5YKCBvgXwpwMUgAqEJg/V0JhxTFNbbm9tiX2PCXH+BkPO7TIwRmVVjWBEEtsGCuMaIWXZXxhSkFmAHsN0UVg/DRDCGuuD80B4yw/7nID/DElBCepRUDeMFFscIEqwCaQRHEE1mkAvKAXynARkBjAJpAl/684g1hETBC/lV37363c1qL/HqEtNYgMaCWCwJtmR2x1lhXtWkEw5QCTACLAZGUa39maA4Y4f5B+d3j6BgK7hFSpQBawPZ6fbE1aQQNuw0IKgUUAKoUSLqmrD4kAkaoP+rWDch56c5t49VRv3EBeylQ266rgGUEaeXp8KWA8C2uGLDjGg8BQmqBEeZ43b0P3bDDYzv27FwXBpjjAhYDpA7UZyy5CYZzoSlwZQDrANlAXnNUqwl6hNpQHDBCHK67tx28wxNnecVNZykAWmNIMMBsDEgV0I2g2PEqBeTQiKYBzICgEAoBI/iov/wAz7IDPgcDxCLY4gRVD1CNAcfa413VhqoIebQFRLc4yZ/YQsvughGGAQBX/tdgBIzAg0HyAwx209yhuQGlAFB3gFhu0L72uLMekFkK8Oig0oDGtFxfIEj8cAgYQcc2DwXJLxDgpefBUoEGzQgyA0gD2kFfe1yVX2Y56NUWQGGVCSCHitK1dggAQiBgBByi/BdTQ6wlpkQ/m360r3sf2FVAIqAxYFstSBvoWHXWWnLTqxSgAVJEIMGOAW6TCy3FwJYqax/TJ+elUEshyA5kAmCbqVb3zVZQkStGmw5aZQ7Tx4YCuwqw/KDXBLlPsF1fb9A0guaqq15tAcSMR8Y2wWq0AWlecDGmYlepMtMiBpNSMoFXD+vtgsxOUn8G5PzfdvMOcok1I2kBIdeCIxw2DNhXn0cEti+zlpoy+wTBagtoNUEQSuBbClwBvNhYk1h3Nx3jSQcA8lMkLqW0TgtPPe3r0dAFAG0opOHze3ncoZ0+KdAXJhwP8Bt/0hHqlNqwINdWE8xkQK1ZDDqaw856gGtbAHilJbngJhPAEahZiOd+/y7RSQYqkfO/a/WRugyTBBjByNdYxggNQLYLIPBDQsCHWotT9EZRn3tBUAAkAyIptcqKZMBRWRV2NIed9QCXtkCMAGDv8sCuldM/vqu2td6xFac4cSJHrDyq1AZhx7D2+PWH4YF2kdPr4S7ughRQ4G/+Y/1damgisvcZuw101AOoGtAOmc1h0R8ilh63tQXMFQdpgFwQAGiRiaY1P75rvcumMoUSJhKF7x9oc7NCrz2uTVlt2P1fZE7Xt1PvSwSq23PP1fJ3JCWyoZj26eQjg1s1BEx9tPoDbKvOmkbQXHLSuy0gl9raIuSvb3Xd2rmDMMIJ4zcm+POvW6PDrlN0A2uCdffe/QD1u9d6bzQySXYsmnzwxsfBVgrKhYbYBqwQXSKZzWFuDDEAUnydAJF4iTBzDADtrPNKiJJfP3bV+/wJ4AGAPmfo8TsBTPlRTtc786qZJNOvupUNWAU2BmBrUNUEHc3hzhqjs7TfYoCjFJBWnod98XtNvW9O0Hwp68DdD2kPw7rPFPCoT+uTZ7d89IG7CQLlTMfM9Gr1yVs0yZr84LVPCvmtIkkwAIZrVU3Q0RzGSr0EwKUtoACghEB57zopqT0BVjJApZHT+S7tkS2Ph3dDNIcbPvVJeODuB2ScNB1LAcAzc0RFFgGAZPWxZFU3/OoVQgDAwQCwKKA1hw/XgHPlaUcpoABA+s9cUK9S4Zb9TENRqRCnRX+gTZXKcvV5XQnIDNzNEAC/GAIAKT59VHUzA44luUbz4AKxNLHigNkrLJuDtuawkTZBdG0LCABS21bgts6cFC1nRts/9Re/9Wqw11QZzyal/vDC3K9Y8nO+SyYIDgjpaSUR+jw/Aw+/cESvlanWIALQblcB9gHaVfO6fMDTtRTguuY2tH+k/eDt5kqXX2jBN7WJqZ4PaYTrE9wQg7sfYFR5Mo6Yl6yQl9ITD6q6Jfat7TkRsNkAWizF3hZAaj1WI+7TqUqBzLaAYMCWFdu+ofI1bP4n1mkSZN8naP+r+EGas42beU95my6xjg51z5R302RVlYTW9pijHlBLGOhtgZcqY+wHzH9cQEwzLvYkvvl5eIb5ogOf0Fc3HUuvsO0hjoYvSPegInJTTAagt5yy/hgkiQbV4jyatvjkDL0esOTotKPiP7M53POeNlaBTunpKKMtIFZfByv3HTnt9SKSaU0Av6lSft1Kelm42Rh0O0XQ/lhSst8R2jeLR8f2L+kvPSoWDRJ/sAqoPlGrGOipVKvPEwNUW2jbNyD7UJTWakB+7itCD41tHnI9ZbSXnTbQ5vqY2lOvlELhUCkclTNEpvWaKkAeflVzWASzHiA0gNecvcnrMSb/UKjJP+ahMfu/c2kZy1FLSt4dRemBa2jkvSJP/0+des/EGYVUo8fsp4WagFWghNylg2KAqgcIBggK9JFLhG3ravKsuzpv7vyhHdQLgHEMjtofJpp7f8J2G9rpqlKT3UBLUiyhThJzP5/aMw/FL7W8GSgV4K5tGh3O7BPMHym51FQqLToTDLEzqgDSkxW7V5c/1/dRwICuZdujjHO/wrcdRVnlffFfBQDym//M4w4zkUDak19/KHopAYoBqAIg3Vxz6DIZ0AOi7OqLlNYLYcTdRMyxhIBAF5b+lwiMcgpwx5b/Ac5LgvrWbU/UEQdGrfvRhnK/Mh31X/7ERBaseXCUc37UYi+nv/2JG15iQlBvjpv8xABad/0Q6r0Zn4yCUc1bu+mMuDlYf9tPpc0mf5D/nsDBBVsf6e8HB/OiSc55U2T7BhM/1wZbEwMQGxQcwLTSFWLBgdHugVN7qpNiySs1tKPl/yqoStcPFtGZMj6+Wx4vJxe54zRsjg0lFCc4GVo6xI9ocrLuIj1wqmiWs8SQA5i5AoOMF26xyBep/t3wDwiBlFkho37iRys8NS9eAaozuGsOwKF5Wz4GU/hnEZ9pYSr6oIvvuIoKdkRgMM8igJI9z0LFlv8XYq6wA4FvDFIt3kV8oKwu/qJsfzTsPf8Tc5EKYgP/TbSnWdbBG1/FlyAaQ4Vf75wn6zXEAbq/CHnRIWaYuv9o4X3ZyR8GAAcC94k0OU/iFJjy85n3GkZCLlAh0hlNDvqsXmB/iauIAFiPu1+TanPOAEGjv0VqxiR/KADsz5TNvc84PdGlVlQ4ZJef0pqfShhpa7USbPwlwr64twD30tHX4/aVehGBqDFYiPCot8qDWNouf9DTImEBcDxbvDknlU66UEDqvx27d32hhJ1/i6RCNi+2kvHvvpwhBSYgEU3aNk5NYdSegNwgXwChAXAi8JGfwJBwrKdv0Uz5Kcx+Nf2zlMAgK/nx0vSdlxx0i3JzThJs9wZ29fm3P9Prv+HkDwmAA4HYz3IBnPLHzr3P6+rYuz4yM9x9tOCW9yYCuY6/yLfRuY/YDoaTPywAzifsr/+ys37lkf8yNIUazLaFRKPPnxkIQCR2s+13SPlDA+BEYO437Aj45P8YAfjWLr9/MxCwm7/Q8ocHwPl88ebc8xoEAfJfcAbYEYiknPcPY/+zBcB5biz/kUGQptBx/8UZDkEQgAyjSZabPqy37deZTLcjtmgZAb4mkvq7EbvAWfguzAYA58kTfpEUJPj6fTb56fZ2h0B2BsiuQkp8JCXfkaHCVAo/8UcqBXTga3YV4Eq9ffLOffdTRHj+Rx3uQrLx3ZgVAE6xNkdGqc/63kz5weGTwKEC5I9rSLjpTkX4LY7SD3FoyK4CqlPPiQDefqggZad/Vp4bswTA6W8mNvmHqKxRN/np31ETr6aJmXGlrLEjJAV5RYrQTznJRVOBnDyL4E4EAP7+lJ3+WfqvzRIAp7MnaPr4T7zk12N3A2CIV0vzPHKm0T9KRiD5tz9ymIpsHdlnC0CGy53YDFtlza5+GgD2G/Ekx6SRLPI8ko4sD4iTwuzDDnMfuvgbMwD+l6Q9Tm0qc55J66Mnoz5Hbk0FRRp8/zcGAB/HU877ewOAeR1NR/2O9H8oMFZnyNp99RgB8HQ6k3HYG4BUGuWN+B356q7gaB2Hx7KQx5gA8LjMZxKeCwPSUd8jqb9KhYjX//ZvIAAZpQH4z0FrKomIKY3SqVLaUP6VPI94q4Brsse0jMk4AMh0PeQ7B00ywJzuEryTun9XqJhlCF/5v1AAOG2h/xQsZIA1lzXcjp8KOBM+Fus3fgBsJAh4HINUIJXd63RjyLjHkf3jBECzBEEzkB4plHO4w7+G/GyAHvlYtf9CAKCuD3wk65Gg5UwzQyAAAfd+kwDgOkHwBJw3BABeHGEsZf8FBYC8KATH/sYA4HfrNxGAMLG/QQBcyCS+A8AbC0AO5AetaqyHfBg5/7YCAGIPf+KR2x8SXr8DZB+BO3/5of+91irb3xYAiPCDDYd+vXvvBz3Pv/OeBR+Yte5TjqNvIwBUeATg60dtR6Z9FeBDHme/DQHILrwDwFs/ie8A8A4A7wDgEWKp8SXfiIyjrf9WAIBDXs6Y1h0+n+0gx1sWAIGCEV6evPSbIfubDIAMOQGz98fbvn/LA/BWC//hAfj/ZeNgDpRqYHoAAAAASUVORK5CYII="></td>' +
            '</tr></table>' );        
        
        // Our reference to the Time Code <select>'s does not persist
        // after the iframe loads new content via ajax.  This event-
        // listener ensures we have a current reference to the selects.
        $( 'body', ourFrame ).on( 'click', function(){
            
            console.log('iframe click event!');
            timeCodes = $( 'select[id^="TRC$"]', ourFrame );
            timeCodes.on( 'change', function() {                
                updateProductSelect($(this));                
            });             
            
        });
        
        
        // Open our settings page when gear icon is clicked.
        $( '#gearIcon' ).on( 'click', function(){
                
            showUserSettings();
                
        });
        
    
        // Create our routine to fill in the times with a default of 7.5 hours
        // when the autoFill button is clicked.
        $( 'button#autoFill' ).on( 'click', function() {
            
            // We will check to see if any of the QTY_DAY textboxes already have values
            // and prompt the user to continue if they do.
            var QTY_DAYtb = $( 'input[id^="QTY_DAY"]', ourFrame ),
                QTYsum = 0;
                    
                
            $.each( QTY_DAYtb, function(index){                
                QTYsum += QTY_DAYtb.eq(index).val();               
            });
            
            
            if ( QTYsum !== '0'){
                var continueDefaults = confirm('One or more days already have values.\n\nClick "OK" to overwrite the values or click "Cancel" to leave them unchanged');
                if ( continueDefaults ){                   
                    fillTimes();                    
                }
            } 
            else {
                fillTimes();
            }

            // Fill in the appropriate text boxes for the default schedule of 7.5 hours per day as Regular Work Hours.
            function fillTimes(){
                
                // Clear all of the existing values in the Day inputs.
                $.each( QTY_DAYtb, function( index, value ) {
                    $(this).val("");
                });
                
                $( 'select[id^="TRC$"]', ourFrame ).prop('selectedIndex', 0);
                $( 'input[id^="PRODUCT$"]', ourFrame ).val("");
                
                // We'll collect and examine the row headers for the day input boxes
                // to determine if we are viewing by week or by calendar period.  We will
                // also determine which day is being shown as the first day of the week (Sun, Mon, etc).
                var whichView = $( 'span[id^="TR_WEEKLY_GRID$"]', ourFrame ).slice( 0, -10 ), // remove non-day spans
                    weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri"],
                    dayNum = [];
                $.each( whichView, function( index, value )  {
                    
                    var testWeekDays = $.inArray( $(this).text().substr(0, 3), weekDays );
                  
                    if ( testWeekDays !== -1 ) {
                        dayNum.push( index + 1 );
                    }
               
                });
            
                
                // var dayNum = ['2', '3', '4', '5', '6', '9', '10', '11', '12', '13'];
                $.each( dayNum, function(index, value) {

                    var dayV = 'QTY_DAY' + value + '$0',
                        dayVTextbox = $('input[id="' + dayV + '"]', ourFrame) ;
                                      
                    if ( dayVTextbox ){
                        dayVTextbox.val( '7.5' );
                    }
                   
                }); 
                
                $( 'select[id="TRC$0"]', ourFrame ).val("REG");
                $( 'input[id="PRODUCT$0"]', ourFrame ).val( localStorage.getItem("userSettings") +'112' );                
                
            }
           

        }); // End button#autoFill click 
		
		
		function compareScheduledToReportedHours() {

			var reportedHours = $( "#DERIVED_TL_WEEK_TL_QUANTITY", ourFrame ),
				scheduledHours = $( "#DERIVED_TL_WEEK_TOTAL_SUM", ourFrame );
			if ( reportedHours.text() !== scheduledHours.text() ) {
				console.log("reported hours do NOT match scheduled hours");	
				
				// We will highlight the Reported Hours if they do not match the Scheduled Hours.
				reportedHours.css( {"background-color" : "red", "font-weight" : "bold", "padding" : "5px"} );
				
				(function() {
						
					// create a counter variable that will be utilized by the inner function.
					var counter = 0;					
					
					function flash() {						

						reportedHours.fadeToggle( 700, "linear", function(){
							
							counter = counter + 1;							

							if( counter < 4 ) {
								flash();
							}

						});
						
					}
					
					flash();
					
				})();
				
			}
			else {
				console.log("reported hours match scheduled hours");
			}
			

		}		

		// Compare the report hours value to the scheduled hours value.
		compareScheduledToReportedHours();
    
    } // End iframeLoaded()





    // Called each time a "Time Reporting Code" select element changes.
    function updateProductSelect(select){
        
        var selectVal = select.val(),
            selectID = select.prop('id'),
            productIndex = selectID.slice(4),
            productValue = 0,
            ourFrame = $( '#ptifrmtgtframe' ).contents(); 
        
        switch(selectVal) {
            case 'ALWP':
                productValue = '174';
                break;
            case 'C2':
                productValue = 'COM';
                break;
            case 'CSV':
                productValue = '139';
                break;   
            case 'FUNRL':
                productValue = '149';
                break;
            case 'HOL':
                productValue = '136';
                break;  
            case 'JURY':
                productValue = '138';
                break;
            case 'MIL':
                productValue = '137';
                break;   
            case 'MILUP':
                productValue = '174';
                break;
            case 'OFC':
                productValue = '???';
                break;
            case 'OLV':
                productValue = '181';
                break;
            case 'PER':
                productValue = '195';
                break;   
            case 'REG':
                productValue = '112';
                break;
            case 'SICK':
                productValue = '193';
                break;   
            case 'SSL':
                productValue = '180';
                break;
            case 'TRN':
                productValue = '132';
                break;   
            case 'ULWP':
                productValue = '174';
                break;
            case 'VAC':
                productValue = '194';
                break;
            case 'WC':
                productValue = '???';
                break;
            case 'ZACOR':
                productValue = '???';
                break;                          

        }                    
        
        // Change the corresponding Product <text> element to match the Time Reporting Code.
        if ( productValue === 0 ) {
            $( 'input[id^="PRODUCT"]', ourFrame ).eq( productIndex ).val("");
        }
        else {
            $( 'input[id^="PRODUCT"]', ourFrame ).eq( productIndex ).val( localStorage.getItem("userSettings") + productValue );
        }  
		
    } // End updateProductSelect()  
    
    
    function showUserSettings() {
        
        if ( $('#prefix-modal').length < 1 ) {
            console.log('no modalbox defined');
            $( 'body' ).prepend( '<div id="prefix-modal" title="Product Code Prefix">Please enter the two digits prefix code used with the Product Code text box:</div>' );
            $('#prefix-modal').append( '<input id="prefix-code" type="text"/>' );
            
            $("#prefix-modal").dialog({
                autoOpen : false, modal : true, width: 500, show : "blind", hide : "blind", buttons : 
                [
                    {
                        text: "Submit",
                        click : function() {
                            
                            if ( $( '#prefix-code' ).val() !== "" ) {
                                localStorage.setItem( "userSettings", $( '#prefix-code' ).val() );
                            }
                            $( this ).dialog( 'close' );
                            // Clear the value of the text box.
                            //$( '#prefix-code' ).val('');                               
                            console.log('localStorage.getItem("userSettings"): ' + localStorage.getItem("userSettings") );
                            iframeLoaded();
                           
                        }
                    }
                ]
            });
                
            $( '#prefix-modal' ).dialog( 'open' );
                  
        }
        else {
            
            console.log('modalbox already exists');
            $( '#prefix-modal' ).dialog( 'open' );
            // Clear any previous entry.
            $( '#prefix-code' ).val(''); 
            console.log('localStorage: ' + localStorage.getItem('settings'));        
            
        }
        
        // Add functionality to modal box to submit on pressing Enter key
        $( '#prefix-code' ).on( 'keypress', function( event ){
            if (event.which === 13) {
                $( '#ptifrmtemplate div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button' ).click();
            }
            
        });
        
    } // End showUserSettings()	

    

    console.log('All synchronous functions complete.  Waiting for User initiated events.');

    
})();