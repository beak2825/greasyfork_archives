// ==UserScript==
// @name         Links block for Lego.com
// @license      MIT
// @version      1.0
// @description  Adds a block to each product on Lego.com containing links to external brick websites, including Brickset, Bricklink, Rebrickable, Brickowl, and BrickEconomy
// @author       azuravian
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @match        https://www.lego.com/*
// @grant        none
// @run-at       document-end
// @namespace    https://greasyfork.org/users/1025348
// @downloadURL https://update.greasyfork.org/scripts/499823/Links%20block%20for%20Legocom.user.js
// @updateURL https://update.greasyfork.org/scripts/499823/Links%20block%20for%20Legocom.meta.js
// ==/UserScript==

waitForKeyElements(
    '[data-test*="product-attributes"]',
    start);

function start() {
  const prodattrdiv = document.querySelector('[data-test*="product-attributes"]');
  const item = prodattrdiv.querySelector('[data-test*="item-value"]');
  const itemnum = item.innerText;
  const last_attr = prodattrdiv.lastChild;
  const links_list = last_attr.cloneNode(true);
  links_list.removeChild(links_list.firstChild);
  links_list.removeChild(links_list.firstChild);
  const myspan = links_list.getElementsByTagName('span')[0]
  const spanclass = myspan.querySelector('span').getAttribute('class');
  myspan.removeChild(myspan.firstChild);
  myspan.setAttribute('style', 'text-align: left');


  const br1 = document.createElement('br');
  const br2 = document.createElement('br');
  const br3 = document.createElement('br');
  const br4 = document.createElement('br');

  var brickset = document.createElement('span');

  brickset.setAttribute('class', spanclass);
  var bricksetimg = document.createElement('img');
  var bricksetlink = document.createElement('a');
  bricksetimg.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAA1VBMVEVHcEymLh20giaXhS/AMyUXXSyoOC1QTzp3Vy/AMB3OMyIgXy6Sfy4ljTmXfTDYMCLVMSOkhSXaMB5pVSbxuwvdrBIvYTgmXzI3cj8qcDYyhD4tijsYXS24OCjUphaqLh4rhDmUMSjdrRiaijAgYjDwMCCdLR8tlj7jrhT4wQbxtiDoLyDOMR00tkoxnEHuQSDYoxoxnUI0r0a9mR7/xwLIoByRLR7gOx7hLh4lfTWwKx1GijhWozoohDkkcjMdaC+iiygwoEBxgyMsiDyqjiYQnUGYoyyIwEmGAAAAI3RSTlMA+irxjPs1CBf9uOOXzkXYzdP8+/3JP5kwkIfa7mV74LKCtt0AJoAAAAEQSURBVCiR1c/bTsJAFIXhSSmlAwihLWo0gFqYQ2dKS8+lBxTU938kt7QYxHiv/93Kl9nJIPT/0hVNP1/K2VINIbKx1tLU4tx66p0QZ0II+diMEeNQ3LzVZ30p8XZLFqrWQ8p86sdh+GpP5wqclKmXSoyx9Dy5mDAeMdCYRdyfoP4qM1IPSjEhie8wZvEo4ix8tjuAq5XIDEwSckQH+FOgBiEQYhZFWb4zx/Ftu8HZWLSYUBd6C0/YGSLU01TwLUnM6lBVdXcfO8y2J8NR+1NwswhcesjrOg/ccv8lTVeUvgSQG6zzXfcbAW7WFJzmuyWk/8A1+PJY9wIfKNimxcHFWXR7d0+POLi5vrTWf5G/0ge5ei2NLgiBHwAAAABJRU5ErkJggg==')
  bricksetlink.setAttribute('target', '_blank')
  bricksetlink.setAttribute('href', `https://brickset.com/sets/${itemnum}`)
  brickset.appendChild(bricksetlink)

  var bricklink = brickset.cloneNode(true)
  var rebrickable = brickset.cloneNode(true)
  var brickowl = brickset.cloneNode(true)
  var brickeconomy = brickset.cloneNode(true)

  var bricklinkimg = document.createElement('img');
  bricklinkimg.setAttribute('style', 'height:26px;width:26px')
  bricklinkimg.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAe1BMVEVHcEwREREREREREREREREREREICxAREREREREaGBMRERERERERERERERERERERERERERERERH/00wNDhAAAQ3/2VD/zEbvyEr/xUF8Zyz+2nW0lEHjuUf+4oZiVTHt0nv/1WnlwWb/zmA+NRxsWSbDoj2TfDXCqmeCeWF8hizGAAAAEnRSTlMAHo0ILOD97zz+bMhatzHP1ec1JXjSAAABQUlEQVQokW2T67aCIBCFU8tCuxiDkIAKKdr7P+EZsI6X5faH6OfsYTHbw2GhS367H3aV3OMzwDM+7rAoe0CKgjyLtmXXGwHWDRVhcL5dk1UzdGSkclS4Hhh6z62j+AQp65QoUUJ1DKCIJ+8kKwDLhoC8dJUyIHnwvuAeSY9Ia1qWVPtVQwBOxwDTzuHbUg9OCDUISkuquh9kFT6iXN80vcNFKduG/UO08lQrpfFmZL2BSLn/AMvqegODMeecGo/WkH71DmWfcRfKWrb1SLaQh0vK8dO2dm3Lv5JyqKxs5S400lpplbS70Bg7KruAaac4fwUhU8oaMx+fP3g90TfKmPngfyPTP2gXI5uHrT3UYdjneA7SFJPevYTyMQHIlyH7BqzyAcN+8Fgn8IjR9DUYzSyHYhPPOdRJlMXb7C5/h2mnf8FjLS4twHqMAAAAAElFTkSuQmCC')
  var bricklinklink = bricklink.getElementsByTagName('a')[0]
  bricklinklink.appendChild(bricklinkimg)
  bricklinklink.innerHTML = bricklinklink.innerHTML + ' Bricklink'
  bricklinklink.setAttribute('href', `https://www.bricklink.com/v2/catalog/catalogitem.page?S=${itemnum}`)

  var rebrickableimg = document.createElement('img');
  rebrickableimg.setAttribute('style', 'height:26px;width:26px')
  rebrickableimg.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAABoVBMVEVHcExKST84PDw5OTk6OjpBSEVwbFJjYkwuLS0pKipAQEAkJCQyMjPbynQcHBs0MzM4OzsVFxopNzccLTUmJSI1P0IAAAELEA5gBgynBgtMEBFzEh81FRQGFBoeHh9vDAvbGSTdKDHJKjI7BAQlAwLEyK0rKiijKC2dFxuSFhsOCwaKBQtwURTy0zLoxyH1zSH01UwVHB7euxrpxh710Rbyzy9PPwichSCzliP93CL41z7BozCLcxsEBAagggXLqR25mhuzlBLWtBDmzFTu2SqcghV5YgLGpA7m2hr/8h5eTAIsIgCOdQqGbQg3KgBMPAB7ZxD++x6ijDNgXUfNrhBIOQA+MQGjiBOEd1ILQbBXRgGsjxuTehQBBBzKqyeGgVKWfyYAECuIiFxmUgKmix4iISCvkx+Mim4aLVlqVwmqjA/EpB7HqCSrmkYxRX6XfAjBoRlxWwRdbH28nyK/nRDSsiPHpiPEpCB3ZhjGqTqWgjrjyG7t1GrlwjPUtkP821sAABAUFBWihxyyp15OQxyQf0RXSSBcTRFoWy9rWhViVB6jt1BHAAAAi3RSTlMANJXOn0IaX///u/+mHP//eP///+z/////////////////////DNP//////9uA484v8P////z///7+WLr+////////Rv////7////////////jvf//////2f///////0K5///////lm//////ja/7////m/P//n9j5////a7D//6Bd2KeLm225s+yihhSvdAAAAulJREFUeAFsTgMWw0AQrTtTxeuNnRr3P1rx1Gjs+ZMeTWfzxXIyQqvZbPp1a0AEHJnYbBG3u8n+YBgAgGa/b+KvDqZpfQcM23Z6EysXvg3b9raEGh4wzsWsM7BEAMPbCqk08e0gjOJYdaG7sPUUD8NIaJrwOCVB0AGa5Wj4QVgIWVooKlbXQk46lLmomooSUimqGkbS4Hg6X67tJ7e0kSRNK6QHVpZNcH88nq99+0adNAErha6JJumHRLJqUBuIovDUhXUJ9Ze6t8F3ieFMgkNSZoI7KQySrLv+7Q7lvJ7v+nV7vA6nz+nbmpu/tr5vb/uZd89evmBm4ty8R3CKki/gDAIQZH1UoXBEisbikOO4LxwjK05HIsmk0rHMIsjmoqwvxDrztGbevbq09OYLU1AD8VhMU+LxH4vgT9GD0hr2hHWdXy1Rf2mJg1BVyuVQqOytAFCt1SPJhkfX9WbA/fpNy2azcbCRRGk/VZt22OnmFNgTcF8yWLjaarVsHIOQDLVmsyn+pcBguEkgEgwsjdjx6xnwhZHlLw2Cm3g0A35NhgQWDEOigFKa+RyXVGVEtCYWp+/phrK5scyNBEkyLb601HrDcUwBqog0MZ5KOzTFTkAbN/CUNiGajtLqEgVUFGmMlXBYk3bfg8oeH3awo2g0zzpc+TmQhA2i9fuSJewugkfFfaLq0ykOK6RH97BqpxlSEPXSzeb44PAIDNbrbCL1RUbJZERBpVU7PXqq4OYjUCeefeMYVLpdxcET3evd3++f2Dk7vUUKqbq3r4mGae6CyrDr95f705PD/f2T0z2GY5gvbreaMMToaCSKXrA4KSpJj8lj18l+OT89O38A7qhQHVuiF+Nm+AKAy24CNQTDsqImzfgQUF2hZE/UtDAhkWu6qWii5zYE05xlnAPgRo2QxN6326v/vz0w0tA0qEtzXswB8G9tHS3sjGA2WEVWoWN0CtDIGJ8EVQZswNouPDzf162zq40NQw4AapnDZhU18fsAAAAASUVORK5CYII=')
  var rebrickablelink = rebrickable.getElementsByTagName('a')[0]
  rebrickablelink.appendChild(rebrickableimg)
  rebrickablelink.innerHTML = rebrickablelink.innerHTML + ' Rebrickable'
  rebrickablelink.setAttribute('href', `https://rebrickable.com/search/?show_printed=on&include_accessory=1&include_gear=1&q=${itemnum}`)

  var brickowlimg = document.createElement('img');
  brickowlimg.setAttribute('style', 'height:26px;width:26px')
  brickowlimg.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAe1BMVEVHcEzX2NjV19fW2NjNz8+dnZ2trq7V1dXW2dnZ29y7urmUlJSYmJjFxcWamZmenp6jo6OamprU1tanp6aurq3UzsqLi4v19vPe4OF7enn/////4bb/05T/3Kj9sCi/gRVkRA3/vlqcahMAAQI8RlD45cwqHATwjw7zkC196lJXAAAAE3RSTlMAMrPJmlCLFf///5T9/9v//zP6OwrJdwAAARlJREFUeAG10NeCgjAQhWF7Jmyy0cikjEi18P5PuGEo2y89Vz9+Ulcv3Hqz3e7208Fuu90cxGIC0mT2xgcbGKa+I+j3T5RqP4oQ6wnFMEYweyESAk9KCRLmhqHl8bSyfNZZ5VayQG6M5jqqAdEp6YNRASCcHfhwjHpGjJYuxZWCC9JoTp90xHNOZVVXpdeZNdRUdVt6VJYRIxVt193uDTnji6rrupRRM+pIzaNLK0k5auopsxn5l7okl7BN+Ug5Irpwfz66x/PqVWbvZfrjs5gvC1mkS1mWBTkIS+Z2RMyjJ0/kNABOaeZXAZtFp5yz/NlcypgjzAjSIoJEngRECzDjPHymIedPZO0B/kNA/IHwzxjX/+50Wr1mH3nDIvGVBEYJAAAAAElFTkSuQmCC')
  var brickowllink = brickowl.getElementsByTagName('a')[0]
  brickowllink.appendChild(brickowlimg)
  brickowllink.innerHTML = brickowllink.innerHTML + ' Brickowl'
  brickowllink.setAttribute('href', `https://www.brickowl.com/search/catalog?query=${itemnum}`)

  var brickeconomyimg = document.createElement('img');
  brickeconomyimg.setAttribute('style', 'height:26px;width:26px')
  brickeconomyimg.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAARVBMVEVHcEzv7/Dv7/Hv7/Dw8PDw8PHw8PH29vTv7/Dv8PHF0/BakOvZ4vXm7PYAZ+cJb+iQse+0yfI8gemhvfAac+j///96pO4XzhHzAAAACnRSTlMAOIbC7P9g/xffFSzsFQAAAVFJREFUeAFdkwGuhCAMRFXpr1JoAVruf9QPmDXLTmIS8mQy0GF7tR+nA3DnsW+/+nPQhTDk/hZ03RN5Cjh/uK8vx4kiMUn/YGhfGCQWzoV8Jfyi19iWRZSllkimGQERHucb0BdW1ZByQcqVKZeE98wJsQ3E0VoOisxYuLaGI7MLLPqB5jWZSTeX4EYazx0JP9B87dA01NozHRNKiSV0GFVSsUym6uHYzgnZbMLmZexPwh7h3NwCU04Vi5lxBHAbDCgfiGyllbGzQ5iQacBo1CwrUVQNVBFg2nobMIlwCTFY6PbG3XYEKtZh0Oe0hGPFSL4HOh7YWB8JJ6stssR+lH3A7qivWHxiDnMwzve1LmKKHMGNi593u0q4w1mWOxL/sgZwP8Oe81xcAwJcb02wvpFkNGEtEUJjeU7yVGitJgZi4Rbfaq6lRk8el1IvzwHX5/APMcQhL8CmHDEAAAAASUVORK5CYII=')
  var brickeconomylink = brickeconomy.getElementsByTagName('a')[0]
  brickeconomylink.appendChild(brickeconomyimg)
  brickeconomylink.innerHTML = brickeconomylink.innerHTML + ' BrickEconomy'
  brickeconomylink.setAttribute('href', `https://www.brickeconomy.com/search?query=${itemnum}`)

  bricksetimg.setAttribute('style', 'height:26px;width:26px')
  bricksetlink.appendChild(bricksetimg)
  bricksetlink.innerHTML = bricksetlink.innerHTML + ' Brickset';

  myspan.appendChild(brickset);
  myspan.appendChild(br1);
  myspan.appendChild(bricklink);
  myspan.appendChild(br2);
  myspan.appendChild(rebrickable);
  myspan.appendChild(br3);
  myspan.appendChild(brickowl);
  myspan.appendChild(br4);
  myspan.appendChild(brickeconomy);
  links_list.removeChild(links_list.firstChild);
  links_list.appendChild(myspan);
  prodattrdiv.appendChild(links_list);

  const divs = prodattrdiv.querySelectorAll('div.czFmem')
  if (divs.length >= 7) {
    increaseWidth(divs)
  }
}

function increaseWidth(divs) {
  for (d of divs) {
    d.style.width = '14%';
  }
}




/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.
    Usage example:
        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );
        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }
    IMPORTANT: This function requires your script to have loaded jQuery.
*/
function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = jQuery(selectorTxt);
    else
        targetNodes     = jQuery(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = jQuery(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}