// ==UserScript==
// @name         rule34 search modify
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  convenience, adding this search prompt to every search
// @author       reflexpunch
// @match        *://rule34.xxx/index.php*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/479092/rule34%20search%20modify.user.js
// @updateURL https://update.greasyfork.org/scripts/479092/rule34%20search%20modify.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let first = "dark-skinned_male ~ dark-skinned_futanari ~ queen_of_spades ~ queen_of_spades_symbol ~ qos ~ spade_choker ~ spade_tattoo ~ blacked_clothing ~ cuckold ~ blacked ~ bbc"
    let second = "camera_view ~ recording ~ snapchat ~ phone ~ phone_screen ~ cellphone ~ video_call ~ mirror_selfie ~ mirror ~ posing ~ magazine_cover ~ straight ~ female ~ shortstack ~ elf ~ smaller_female ~ muscular_female ~ muscular ~ living_sex_toy ~ vaginal_penetration ~ blowjob ~ deepthroat ~ anal ~ anal_sex ~ vaginal ~ double_penetration ~ rape ~ feet ~ 1girl ~ interracial ~ very_dark_skin ~ raceplay ~ interspecies ~ seductive_eyes ~ seductive_mouth  ~ grin ~ smile ~ disappointed ~ disgusted ~ disinterested ~ netorare ~ betrayal ~ caught ~ caught_in_the_act ~ handsfree_ejaculation ~ small_penis_humiliation ~ wasted_cum ~ infidelity ~ jerking ~ jerkingoff ~ watching ~ watching_porn  ~ watching_sex ~ forced_to_watch ~ implied_sex ~ side_view ~ voyeur ~ voyeur_pov ~ voyeurism ~ light-skinned_femboy ~ comparing ~ two-finger_handjob ~ pinching_gesture ~ sph ~ big_penis_adoration ~ penis_size_difference ~ sissy ~ chastity_cage ~ tiny ~ watching ~ cuckold_pov ~ cuckold_masturbating ~ cuckold_meal ~ cum_on_cuckold ~ creampie_eating ~ cum_cleanup ~ friendly_fire ~ eating_cum ~ flat_chastity_cage ~ rimming ~ rimming_male ~ rimjob ~ anilingus ~ caption ~ social_media ~ prostate_stimulation ~ prostate_milking ~ prostate ~ spade_choker ~ answering_door ~ cheating_wife ~ cheating ~ tricked ~ walk-in ~ cheating_girlfriend ~ blonde_hair ~ handholding ~ heart-shaped_pupils ~ used_condom ~ pornhub_bra ~ spade_(shape) ~ tattoo ~ tattoos ~ pubic_tattoo ~ womb_tattoo ~ body_writing ~ legs_wrapped_around_partner ~ kissing ~ kissing_while_penetrated ~ french_kissing ~ french_kiss ~ making_out  ~ femsub ~ penis_awe  ~ 2koma ~ imminent_sex ~ before_and_after ~ pregnant ~ after_sex ~ before_sex ~ fucked_senseless ~ fucked_silly ~ rolling_eyes ~ ahegao ~ mating_press ~ leg_lock ~ stand_and_carry_position ~ groping ~ grabbing ~ hand_on_ass ~ humiliation ~ masochism ~ older_man_and_teenage_girl ~ kissing_lover_while_cheating ~ dialogue ~ hmv ~ edit ~ text ~ english_text ~ third-party_edit "
    let third = "-bleached -queen_of_hearts -bleached_clothing -dark-skinned_femboy"
    //let newpart = `( ${first.trim()} ) ( ${second.trim()} ) ${third.trim()}`
    let newpart = `( ${first.trim()} ) ${third.trim()}`
    //let newpart = "( gay ~ yaoi ~ femboy ~ trap ) -straight"
    //let newpart = "rating:safe"
    let linkpart = newpart.split(' ').join('+')

    function modifyLinks() {
        var links = document.querySelectorAll('a'); // Select all links on the page
        links.forEach(function(link) {
            var currentHref = link.getAttribute('href');
            if (currentHref == "https://rule34.xxx/index.php?page=post&s=list&tags=all"){
                link.setAttribute('href', "https://rule34.xxx/index.php?page=post&s=list&tags=" + linkpart);
            }
            if (currentHref.startsWith("index.php?page=post&s=list&tags=")) {
                link.setAttribute('href', currentHref +"+"+ linkpart); // Add custom part to the end of the link
            }
        });
    }
	function modifyInput(input) {
		return input.toUpperCase(); // Example: Convert the input to uppercase
	}
    function findSearch(){
        var inputbox = document.querySelector('.awesomplete'); // Adjust the selector as per the site's search form
        return inputbox.querySelector('input[type="text"]'); // Adjust the selector as per the site's search form
    }
    function modifySearchURL() {
        var searchForm = findSearch()
        if (searchForm) {
            searchForm.addEventListener('keypress', function(e) {
                if (e.keyCode === 13) { // Check if the Enter key is pressed
                    if(!searchForm.value.trim().endsWith(newpart)){
                        searchForm.value = searchForm.value +" "+ newpart
                    }
                    //searchForm.setAttribute('action', currentAction +"+"+ newpart); // Modify the search URL
                }
            });
        }
    }

    function cleanAtStart(){
        var searchForm = findSearch()
        searchForm.value = searchForm.value.substring( 0, searchForm.value.indexOf(newpart) );
    }
    modifyLinks();
    modifySearchURL();
    cleanAtStart();


})();