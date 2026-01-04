// ==UserScript==
// @name           Risk Updater
// @namespace      https://www.example.com
// @version        1.2
// @description    Risk Updater auto
// @author         @nowaratn
// @match          https://rodeo-dub.amazon.com/KTW1/*
// @grant          GM_download
// @grant          GM_xmlhttpRequest
// @grant          GM_addStyle
// @require        https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.5.0-beta4/html2canvas.min.js
// @downloadURL https://update.greasyfork.org/scripts/499838/Risk%20Updater.user.js
// @updateURL https://update.greasyfork.org/scripts/499838/Risk%20Updater.meta.js
// ==/UserScript==


function addButton() {
    const header = document.getElementById('fcpn-header');
    if (header) {
        const button = document.createElement('button');
        button.textContent = 'Risk Update Mail Creator';
        button.style = "position:fixed;top:5%;right:5%;";
        button.id = "risk_id";
        button.addEventListener('click', function() {
            copyElementsToNewWindow(urlsAndSelectors, customStyles);
        });

        header.appendChild(button);
        console.log('Button added successfully.');
    } else {
        console.error('Element fcpn-header nie został znaleziony.');
    }
}

// // Użyj MutationObserver, aby monitorować zmiany w DOM
// const observer = new MutationObserver(function(mutations) {
//     mutations.forEach(function(mutation) {
//         if (document.getElementById('fcpn-header')) {
//             addButton();
//             observer.disconnect(); // Przestań obserwować po znalezieniu elementu
//         }
//     });
// });

// // Obserwuj zmiany w całym dokumencie
// observer.observe(document.body, { childList: true, subtree: true });

// Dodatkowo uruchom addButton po krótkim opóźnieniu
setTimeout(addButton, 5000);



// Przykład użycia
var urlsAndSelectors = [
    { url: 'https://rodeo-dub.amazon.com/KTW1/ExSD?yAxis=WORK_POOL&zAxis=PROCESS_PATH&shipmentTypes=ALL&exSDRange.quickRange=NEXT_3_DAYS&exSDRange.dailyStart=00%3A00&exSDRange.dailyEnd=00%3A00&giftOption=ALL&fulfillmentServiceClass=ALL&fracs=ALL&isEulerExSDMiss=ALL&isEulerPromiseMiss=ALL&isEulerUpgraded=ALL&isReactiveTransfer=ALL&workPool=PredictedCharge&workPool=PlannedShipment&_workPool=on&workPool=ReadyToPick&workPool=ReadyToPickHardCapped&workPool=ReadyToPickUnconstrained&workPool=PickingNotYetPicked&workPool=PickingNotYetPickedPrioritized&workPool=PickingNotYetPickedNotPrioritized&workPool=PickingNotYetPickedHardCapped&workPool=CrossdockNotYetPicked&_workPool=on&workPool=PickingPicked&workPool=PickingPickedInProgress&workPool=PickingPickedInTransit&workPool=PickingPickedRouting&workPool=PickingPickedAtDestination&workPool=Inducted&workPool=RebinBuffered&workPool=Sorted&workPool=GiftWrap&workPool=Packing&workPool=Scanned&workPool=ProblemSolving&workPool=ProcessPartial&workPool=SoftwareException&workPool=Crossdock&workPool=PreSort&workPool=TransshipSorted&workPool=Palletized&_workPool=on&workPool=ManifestPending&workPool=ManifestPendingVerification&workPool=Manifested&workPool=Loaded&workPool=TransshipManifested&_workPool=on&processPath=PPMultiMedium&processPath=PPMultiWrap&processPath=PPMultiXLarge&processPath=PPNonCon&processPath=PPSingleLarge&processPath=PPSingleMedium&processPath=PPMultiTBYB&processPath=PPHOV&processPath=PPSingleNoSLAM&processPath=&minPickPriority=MIN_PRIORITY&shipMethod=&shipOption=&sortCode=&fnSku=#', selector: '#TotalTable' },
    { url: 'https://outboundflow-dub.amazon.com/KTW1/cora?durationOfRiskWindowInDays=7&tableSelector=ppf&fulfillmentProgram=AMAZON_FULFILLMENT', selector: '.singles-charge.dynamic-content' },
    { url: 'https://outboundflow-dub.amazon.com/KTW1/cora?durationOfRiskWindowInDays=7&tableSelector=ppf&fulfillmentProgram=AMAZON_FULFILLMENT', selector: '.multis-charge.dynamic-content' },
    { url: 'https://monitorportal.amazon.com/igraph?SchemaName1=Service&DataSet1=Prod&Marketplace1=KTW1&HostGroup1=ALL&Host1=ALL&ServiceName1=PythiaCLI&MethodName1=RawDataAggregator&Client1=PythiaCLI&MetricClass1=NONE&Instance1=NONE&Metric1=PPMultiXLarge.PACK.EACH.Count&Period1=FiveMinute&Stat1=sum&Label1=PythiaCLI%20RawDataAggregator%20PythiaCLI%20PPMultiXLarge.PACK.EACH.Count%20sum&SchemaName2=Service&Metric2=PPMultiMedium.PACK.EACH.Count&Label2=PythiaCLI%20RawDataAggregator%20PythiaCLI%20PPMultiMedium.PACK.EACH.Count%20sum&SchemaName3=Service&Metric3=PPMultiWrap.PACK.EACH.Count&Label3=PythiaCLI%20RawDataAggregator%20PythiaCLI%20PPMultiWrap.PACK.EACH.Count%20sum&SchemaName4=Service&Metric4=PPSingleMedium.PACK.EACH.Count&Label4=PythiaCLI%20RawDataAggregator%20PythiaCLI%20PPSingleMedium.PACK.EACH.Count%20sum&SchemaName5=Service&Metric5=PPMultiTBYB.PACK.EACH.Count&Label5=PythiaCLI%20RawDataAggregator%20PythiaCLI%20PPMultiTBYB.PACK.EACH.Count%20sum&SchemaName6=Service&ServiceName6=LagrangeModelService&MethodName6=LagrangeModelTask&Client6=ALL&Metric6=OUTBOUND.CurrentSinglesOverrideCapacity&Stat6=avg&Label6=LagrangeModelService%20LagrangeModelTask%20ALL%20OUTBOUND.CurrentSinglesOverrideCapacity%20avg&SchemaName7=Service&Metric7=OUTBOUND.CurrentMultisOverrideCapacity&Label7=LagrangeModelService%20LagrangeModelTask%20ALL%20OUTBOUND.CurrentMultisOverrideCapacity%20avg&SchemaName8=Service&ServiceName8=PythiaCLI&MethodName8=RawDataAggregator&Client8=PythiaCLI&Metric8=PPSingleNoSLAM.PACK.EACH.Count&Stat8=sum&Label8=PythiaCLI%20RawDataAggregator%20PythiaCLI%20PPSingleNoSLAM.PACK.EACH.Count%20sum&SchemaName9=Service&Metric9=PPSingleLarge.PACK.EACH.Count&Label9=PythiaCLI%20RawDataAggregator%20PythiaCLI%20PPSingleLarge.PACK.EACH.Count%20sum&SchemaName10=Service&Metric10=PPNonCon.PACK.EACH.Count&Label10=PythiaCLI%20RawDataAggregator%20PythiaCLI%20PPNonCon.PACK.EACH.Count%20sum&HeightInPixels=250&WidthInPixels=600&GraphTitle=KTW1%20Lagrange%20Override%20vs%20OB%20Pack%20Throughput&GraphType=zoomer&TZ=Europe%2FWarsaw@TZ%3A%20Warsaw&LabelLeft=Units%20packed&StartTime1=-PT3H&EndTime1=-PT0H&FunctionExpression1=SUM%28M1%2CM2%2CM3%2CM5%2CM10%29*12&FunctionLabel1=Multis%20Throughput%20%5Bavg%3A%20%7Blast%7D%5D&FunctionYAxisPreference1=left&FunctionColor1=%230000FF&FunctionExpression2=SUM%28M4%2CM8%2CM9%29*12&FunctionLabel2=Singles%20Throughtput%20%5Bavg%3A%20%7Blast%7D%5D&FunctionYAxisPreference2=left&FunctionColor2=%23003300&FunctionExpression3=M6&FunctionLabel3=Singles%20Override%20%5Bavg%3A%20%7Blast%7D%5D&FunctionYAxisPreference3=left&FunctionColor3=%2366FF33&FunctionExpression4=M7&FunctionLabel4=Multis%20Override%20%5Bavg%3A%20%7Blast%7D%5D&FunctionYAxisPreference4=left&FunctionColor4=%2300FFFF', selector: '#graph' },
    { url: 'https://throughput-dub.dub.proxy.amazon.com/KTW1/lagrange/', selector: '#scheduleLocal' },
    { url: 'https://rodeo-dub.amazon.com/KTW1/Dwell;jsessionid=556BBD07BD81C1D523A989F3849E2D61?yAxis=WORK_POOL&zAxis=PROCESS_PATH&shipmentTypes=ALL&DwellTimeGreaterThan=0&DwellTimeLessThan=10&exSDRange.quickRange=ALL&exSDRange.dailyExact=00%3A00&giftOption=ALL&fulfillmentServiceClass=ALL&fracs=ALL&isEulerExSDMiss=ALL&isEulerPromiseMiss=ALL&isEulerUpgraded=ALL&isReactiveTransfer=ALL&workPool=PredictedCharge&workPool=PlannedShipment&_workPool=on&workPool=ReadyToPick&workPool=ReadyToPickHardCapped&workPool=ReadyToPickUnconstrained&workPool=PickingNotYetPicked&workPool=PickingNotYetPickedPrioritized&workPool=PickingNotYetPickedNotPrioritized&workPool=PickingNotYetPickedHardCapped&workPool=CrossdockNotYetPicked&_workPool=on&workPool=PickingPicked&workPool=PickingPickedInProgress&workPool=PickingPickedInTransit&workPool=PickingPickedRouting&workPool=PickingPickedAtDestination&workPool=Inducted&workPool=RebinBuffered&workPool=Sorted&workPool=GiftWrap&workPool=Packing&workPool=Scanned&workPool=ProblemSolving&workPool=ProcessPartial&workPool=SoftwareException&workPool=Crossdock&workPool=PreSort&workPool=TransshipSorted&workPool=Palletized&_workPool=on&workPool=ManifestPending&workPool=ManifestPendingVerification&workPool=Manifested&workPool=Loaded&workPool=TransshipManifested&_workPool=on&processPath=PPMultiMedium&processPath=PPMultiWrap&processPath=PPMultiXLarge&processPath=PPSingleLarge&processPath=PPSingleMedium&processPath=PPNonCon&processPath=PPMultiTBYB&processPath=&minPickPriority=MIN_PRIORITY&shipMethod=&shipOption=&sortCode=&fnSku=', selector: '#TotalTable' }
];

// Wywołaj funkcję po załadowaniu strony
window.addEventListener('load', function() {

});

// Własne style dla poszczególnych elementów
var customStyles = [
    `
    .singles-charge.dynamic-content { display: block !important; min-width: fit-content;  }
    .singles-charge.dynamic-content tr { display: block !important; float: left !important; }
    .singles-charge.dynamic-content th { display: block !important; }
    .singles-charge.dynamic-content td { display: block !important; }

    .multis-charge.dynamic-content { display: block !important; min-width: fit-content; }
    .multis-charge.dynamic-content tr { display: block !important; float: left !important; }
    .multis-charge.dynamic-content th { display: block !important; }
    .multis-charge.dynamic-content td { display: block !important; }

    .preferences-container { display: none !important; }

    .row { margin: 0px !important; }

    #TotalTable { display: block !important; font-family: Verdana !important; border-collapse: collapse !important; width: auto !important; }
    #TotalTable .tableHeaderRow, th, td { color: black !important; padding: 1px !important; margin: 1px !important;  min-height: 0 !important; height: auto !important; line-height: 1.7 !important; vertical-align: center;   }


    `
    // Można dodać więcej stylów, jeśli potrzebujesz dla kolejnych elementów
];


// Funkcja pobierająca element z podanego URL-a
function getElementFromURL(url, elementSelector, callback) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: function(response) {
            if (response.status === 200) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = response.responseText;

                // Znajdź element za pomocą podanego selektora
                const element = tempDiv.querySelector(elementSelector);

                // Znajdź wszystkie style
                const styles = Array.from(tempDiv.querySelectorAll('link[rel="stylesheet"], style')).map(styleElement => {
                    if (styleElement.tagName.toLowerCase() === 'link') {
                        const absoluteURL = new URL(styleElement.getAttribute('href'), url).href;
                        styleElement.setAttribute('href', absoluteURL);
                    }
                    return styleElement;
                });

                // Wywołaj callback z elementem i stylami
                callback(element, styles);
            } else {
                console.error('Request failed with status:', response.status);
                callback(null, []);
            }
        },
        onerror: function(error) {
            console.error('Request failed:', error);
            callback(null, []);
        }
    });
}

// Funkcja kopiująca elementy do nowego okna
function copyElementsToNewWindow(urlsAndSelectors, customStyles) {
    var elements = new Array(urlsAndSelectors.length).fill(null);
    var completedRequests = 0;

    // Funkcja wewnętrzna do obsługi pojedynczego elementu
    function handleElement(index, element, pageStyles) {
        if (element) {
            // Klonowanie elementu
            var clonedElement = element.cloneNode(true);

            elements[index] = { element: clonedElement, styles: pageStyles };
        }

        completedRequests++;
        if (completedRequests === urlsAndSelectors.length) {
            // Otwieranie nowego okna po ukończeniu wszystkich żądań
            var newWindow = window.open('', '_blank');
            if (!newWindow) {
                console.error('Failed to open new window');
                return;
            }

            // Wstawianie sklonowanych elementów do nowego okna
            elements.forEach(function(item, index) {
                if (item) {
                    // Tworzenie unikalnego kontenera dla elementu
                    var container = newWindow.document.createElement('div');
                    container.className = 'risk-content';
                    container.style = "display: block !important; min-width: max-content;";

                    // Dodajemy style specyficzne dla elementu
                    item.styles.forEach(function(styleElement) {
                        container.appendChild(styleElement.cloneNode(true));
                    });

                    // Dodanie własnych stylów do elementu
                    var customStyleElement = newWindow.document.createElement('style');
                    customStyleElement.textContent = customStyles[index] || '';
                    container.appendChild(customStyleElement);

                    // Dodanie elementu do kontenera
                    container.appendChild(item.element);

                    // Dodanie kontenera do nowego okna
                    newWindow.document.body.appendChild(container);

                    // Dodanie tagu <br> po kontenerze
                    newWindow.document.body.appendChild(newWindow.document.createElement('br'));
                }
            });
        }

        newWindow.document.getElementById("graph").innerHTML = "<img src='https://monitorportal.amazon.com/mws?Action=GetGraph&Version=2007-07-07&SchemaName1=Service&DataSet1=Prod&Marketplace1=EUFulfillment-KTW1&HostGroup1=ALL&Host1=ALL&ServiceName1=SimplePackService&MethodName1=CompletePackage&Client1=ALL&MetricClass1=NONE&Instance1=NONE&Metric1=SuccessfulPackageComplete.ProcessPath.PPSingleMCF&Period1=FiveMinute&Stat1=sum&Label1=EUFulfillment-KTW1%20SimplePackService%20CompletePackage%20SuccessfulPackageComplete.ProcessPath.PPSingleMCF%20sum&SchemaName2=Service&Metric2=SuccessfulPackageComplete.ProcessPath.PPMultiMedium&Label2=EUFulfillment-KTW1%20SimplePackService%20CompletePackage%20SuccessfulPackageComplete.ProcessPath.PPMultiMedium%20sum&SchemaName3=Service&Metric3=SuccessfulPackageComplete.ProcessPath.PPMultiXLarge&Label3=EUFulfillment-KTW1%20SimplePackService%20CompletePackage%20SuccessfulPackageComplete.ProcessPath.PPMultiXLarge%20sum&SchemaName4=Service&Metric4=SuccessfulPackageComplete.ProcessPath.PPSingleMedium&Label4=EUFulfillment-KTW1%20SimplePackService%20CompletePackage%20SuccessfulPackageComplete.ProcessPath.PPSingleMedium%20sum&SchemaName5=Service&Metric5=SuccessfulPackageComplete.ProcessPath.PPMultiWrap&Label5=EUFulfillment-KTW1%20SimplePackService%20CompletePackage%20SuccessfulPackageComplete.ProcessPath.PPMultiWrap%20sum&SchemaName6=Service&Marketplace6=KTW1&ServiceName6=LagrangeModelService&MethodName6=LagrangeModelTask&Metric6=OUTBOUND.CurrentSinglesOverrideCapacity&Label6=KTW1%20LagrangeModelService%20LagrangeModelTask%20OUTBOUND.CurrentSinglesOverrideCapacity%20sum&SchemaName7=Service&Metric7=OUTBOUND.CurrentMultisOverrideCapacity&Stat7=avg&Label7=KTW1%20LagrangeModelService%20LagrangeModelTask%20OUTBOUND.CurrentMultisOverrideCapacity%20avg&&&GraphTitle=KTW1%20Lagrange%20Override%20vs%20OB%20Pack%20Throughput%20v2&TZ=Europe%2FWarsaw@TZ%3A%20Warsaw&LabelLeft=Units%20packed&StartTime1=-PT3H&EndTime1=-PT0H&FunctionExpression1=M4*12&FunctionLabel1=Singles%20Throughput%20%5B%7Blast%7D%5D&FunctionYAxisPreference1=left&FunctionColor1=%23000000&FunctionExpression2=SUM%28M2%2CM3%2CM5%29*29&FunctionLabel2=MultisThroughput%20%5B%7Blast%7D%5D&FunctionYAxisPreference2=left&FunctionColor2=%230000FF&FunctionExpression3=M6&FunctionLabel3=Singles%20Override%20%5B%7Blast%7D%5D&FunctionYAxisPreference3=left&FunctionColor3=%2366FF33&FunctionExpression4=M7&FunctionLabel4=Multis%20Override%20%5B%7Blast%7D%5D&FunctionYAxisPreference4=left&FunctionColor4=%2300FFFF&actionSource=iGraph&WidthInPixels=948&HeightInPixels=250&NoRedirect=1&forceRefresh='" +
            Date.now().toString() + "'>";


        newWindow.document.getElementById("scheduleLocal").innerHTML = "<iframe src='https://throughput-dub.dub.proxy.amazon.com/KTW1/lagrange/' style='overflow:hidden;width:80%;height:600px;' />";
        // https://throughput-dub.dub.proxy.amazon.com/KTW1/lagrange/

        setTimeout(function()
                   {
            // Pobieramy zawartość HTML nowego okna
            var content = newWindow.document.documentElement.outerHTML;

            // Normalny tekst dla tytułu wiadomości
            var emailSubject = "KTW1- Risk Update – 22/08/2024 NS 21:37";

            // Adres e-mail odbiorcy
            var recipientEmail = "nowaratn@amazon.com";

            // Kodowanie zawartości wiadomości
            var emailBody = encodeURIComponent(content);

            // Tworzenie linku mailto i nawigacja do niego
            window.open(`mailto:${recipientEmail}?subject=${encodeURIComponent(emailSubject)}&body=${emailBody}`);
        },5000);
    }


    // Iteracja po wszystkich URL-ach i selektorach
    urlsAndSelectors.forEach(function(item, index) {
        getElementFromURL(item.url, item.selector, function(element, styles) {
            handleElement(index, element, styles);
        });
    });
}