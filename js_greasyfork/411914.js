//appends a white space to a list
    function addWhiteSpaceToList(list){
        var space = document.createElement('li');
        space.style.display = "inline";
        space.style.color = "white";
        space.innerHTML = "&nbsp"
        list.appendChild(space);
    }

    //appends a pipe '|' to a list
    function addDividerToList(list){
        var divider = document.createElement('li');
        divider.style.display = "inline";
        divider.style.color = "white";
        divider.innerHTML = "|";
        list.appendChild(divider);
    }

function generalEnhancerAddNavigationBar() {

        const winsitesArray = ["thedonald", "consumeproduct", "omegacanada", "kotakuinaction", "kotakuinaction2", "gavinmcinnes", "weekendgunnit", "greatawakening", "ip2always", "communities"];

        var topBar = document.createElement('div');
        topBar.className = "top-bar"

        var linklist = document.createElement('ul');
        linklist.style.listStyle = "none";

        for (var i = 0; i < winsitesArray.length; i++) {

            addWhiteSpaceToList(linklist);

            var newli = document.createElement('li');
            newli.style.display = "inline";
            newli.style.color = "white";
            newli.style.padding = "5px";

            var newlink = document.createElement('a');
            newlink.href = "https://" + winsitesArray[i] + ".win/";
            newlink.innerHTML = winsitesArray[i];
            newlink.className = "bar-link";
            newlink.padding = "10px"

            newli.appendChild(newlink);
            linklist.appendChild(newli);

            addWhiteSpaceToList(linklist);

            if (i < winsitesArray.length - 1) {
                addDividerToList(linklist)
            }
        }

        topBar.appendChild(linklist);

        var wrapper = document.getElementsByClassName("wrapper");
        var header = document.getElementsByClassName("header");

        if(wrapper[0] && header[0]){
            wrapper[0].insertBefore(topBar, header[0]);
        }

        var themeSwitcher = document.querySelector(".theme-switcher");
        if(themeSwitcher){
            themeSwitcher.style.zIndex = 1;
        }
    }
