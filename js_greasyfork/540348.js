// ==UserScript==
// @name         RTW Auto Fill Tool
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Combined RTW Auto Fill Tools for AMXL, AMZL, RSR, PFSD, and SSD cycles
// @author       Arjun Bridgelal
// @match        https://na.cluster-config.planning.last-mile.a2z.com/cluster-config*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/540348/RTW%20Auto%20Fill%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/540348/RTW%20Auto%20Fill%20Tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const COLOR_SCHEMES = {
    dark: {
        name: 'Dark Mode',
        mainBackground: '#1E1E1E',
        mainBorder: '#3D3D3D',
        mainHover: '#2D2D2D',
        mainTextColor: '#E0E0E0',

        sectionBackground: '#2D2D2D',
        sectionHover: '#3D3D3D',
        sectionTextColor: '#E0E0E0',

        cycleBackground: '#404040',
        cycleHover: '#4D4D4D',
        cycleTextColor: '#E0E0E0',

        actionBackground: '#0066CC',
        actionHover: '#0052A3',
        actionTextColor: '#FFFFFF',

        dropdownBg: '#2D2D2D',
        dropdownHover: '#3D3D3D'
    },

    light: {
        name: 'Light Mode',
        mainBackground: '#FFFFFF',
        mainBorder: '#DDDDDD',
        mainHover: '#F0F0F0',
        mainTextColor: '#333333',

        sectionBackground: '#F5F5F5',
        sectionHover: '#E8E8E8',
        sectionTextColor: '#333333',

        cycleBackground: '#EEEEEE',
        cycleHover: '#E0E0E0',
        cycleTextColor: '#333333',

        actionBackground: '#0066CC',
        actionHover: '#0052A3',
        actionTextColor: '#FFFFFF',

        dropdownBg: '#FFFFFF',
        dropdownHover: '#F0F0F0'
    },

    gaby: {
        name: 'Gaby Mode',
        mainBackground: '#FFF0F5',
        mainBorder: '#FF69B4',
        mainHover: '#FFB6C1',
        mainTextColor: '#FF1493',

        sectionBackground: '#FFB6C1',
        sectionHover: '#FF69B4',
        sectionTextColor: '#D4006A',

        cycleBackground: '#FFC0CB',
        cycleHover: '#FFB6C1',
        cycleTextColor: '#FF1493',

        actionBackground: '#FF1493',
        actionHover: '#FF69B4',
        actionTextColor: '#FFFFFF',

        dropdownBg: '#FFF0F5',
        dropdownHover: '#FFB6C1'
    },

    mari: {
        name: 'Mari Mode',
        mainBackground: '#a50044',
        mainBorder: '#004d98',
        mainHover: '#8b003a',
        mainTextColor: '#FFFFFF',

        sectionBackground: '#004d98',
        sectionHover: '#0060c0',
        sectionTextColor: '#FFFFFF',

        cycleBackground: '#004d98',
        cycleHover: '#0060c0',
        cycleTextColor: '#ffed02',

        actionBackground: '#ffed02',
        actionHover: '#edbb00',
        actionTextColor: '#004d98',

        dropdownBg: '#004d98',
        dropdownHover: '#0060c0'
    },

    arjun: {
        name: 'Arjun Mode',
        mainBackground: '#1A2F1A',
        mainBorder: '#2D4D2D',
        mainHover: '#234023',
        mainTextColor: '#E0E0E0',

        sectionBackground: '#1B5E20',
        sectionHover: '#2E7D32',
        sectionTextColor: '#FFFFFF',

        cycleBackground: '#2E7D32',
        cycleHover: '#388E3C',
        cycleTextColor: '#FFFFFF',

        actionBackground: '#388E3C',
        actionHover: '#4A5D23',
        actionTextColor: '#FFFFFF',

        dropdownBg: '#1A2F1A',
        dropdownHover: '#234023'
    }
};

     function setTheme(themeName) {
        localStorage.setItem('rtwToolTheme', themeName);
        return COLOR_SCHEMES[themeName];
    }

    function getCurrentTheme() {
        const savedTheme = localStorage.getItem('rtwToolTheme');
        return COLOR_SCHEMES[savedTheme] || COLOR_SCHEMES.dark; // Default to dark if no theme saved
    }


    const sections = [
        {
            title: 'AMXL Cycles',
            color: '#177E96',         // Dark teal
        hoverColor: '#075061',    // Light teal
            cycles: [
                {
                    name: 'AMXL_1',
                    buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings', 'Labour Mappings'],
                    color: '#95B0DD',  // Define color for this cycle
                hoverColor: '#6B98E3'  // Optional: define hover color
                },
                {
                    name: 'AD_HOC_1',
                    buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings'],
                    color: '#95B0DD',  // Define color for this cycle
                hoverColor: '#6B98E3'  // Optional: define hover color
                },
                {
                    name: 'AD_HOC_2',
                    buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings'],
                    color: '#95B0DD',  // Define color for this cycle
                hoverColor: '#6B98E3'  // Optional: define hover color
                },
                {
                    name: 'RTS_1',
                    buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings'],
                    color: '#95B0DD',  // Define color for this cycle
                hoverColor: '#6B98E3'  // Optional: define hover color
                },
                {
                    name: 'RTS_2',
                    buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings'],
                    color: '#95B0DD',  // Define color for this cycle
                hoverColor: '#6B98E3'  // Optional: define hover color
                }
            ]
        },
        {
            title: 'AMZL Cycles',
            color: '#177E96',         // Section color
        hoverColor: '#075061',    // Section hover color
            cycles: [
                {
                    name: 'CYCLE_1_SORT_TO_ZONE',
                    buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings', 'Labour Mappings'],
                    color: '#95B0DD',  // Define color for this cycle
                hoverColor: '#6B98E3'  // Optional: define hover color
                },
                {
                    name: 'CYCLE_1_DYNAMIC',
                    buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings', 'Labour Mappings'],
                    color: '#95B0DD',  // Define color for this cycle
                hoverColor: '#6B98E3'  // Optional: define hover color
                },
                {
                    name: 'AD_HOC_1',
                    buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings'],
                    color: '#95B0DD',  // Define color for this cycle
                hoverColor: '#6B98E3'  // Optional: define hover color
                },
                {
                    name: 'AD_HOC_2',
                    buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings'],
                    color: '#95B0DD',  // Define color for this cycle
                hoverColor: '#6B98E3'  // Optional: define hover color
                },
                {
                    name: 'AD_HOC_3',
                    buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings'],
                    color: '#95B0DD',  // Define color for this cycle
                hoverColor: '#6B98E3'  // Optional: define hover color
                },
                {
                    name: 'RTS_1',
                    buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings'],
                    color: '#95B0DD',  // Define color for this cycle
                hoverColor: '#6B98E3'  // Optional: define hover color
                },
                {
                    name: 'RTS_2',
                    buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings'],
                    color: '#95B0DD',  // Define color for this cycle
                hoverColor: '#6B98E3'  // Optional: define hover color
                },
                {
                    name: 'RTS_3',
                    buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings'],
                    color: '#95B0DD',  // Define color for this cycle
                hoverColor: '#6B98E3'  // Optional: define hover color
                },
                {
                    name: 'FER',
                    buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings', 'Labour Mappings'],
                    color: '#95B0DD',  // Define color for this cycle
                hoverColor: '#6B98E3'  // Optional: define hover color
                }
            ]
        },
        {
        title: 'RSR Cycles',
        color: '#177E96',
        hoverColor: '#075061',
        cycles: [
            {
                name: 'AMXL_1',
                buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings', 'Labour Mappings'],
                color: '#95B0DD',
                hoverColor: '#6B98E3'
            },
            {
                name: 'AD_HOC_1',
                buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings', 'Labour Mappings'],
                color: '#95B0DD',
                hoverColor: '#6B98E3'
            },
            {
                name: 'AD_HOC_2',
                buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings', 'Labour Mappings'],
                color: '#95B0DD',
                hoverColor: '#6B98E3'
            },
            {
                name: 'AD_HOC_3',
                buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings', 'Labour Mappings'],
                color: '#95B0DD',
                hoverColor: '#6B98E3'
            },
            {
                name: 'RTS_1',
                buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings', 'Labour Mappings'],
                color: '#95B0DD',
                hoverColor: '#6B98E3'
            },
            {
                name: 'RTS_2',
                buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings', 'Labour Mappings'],
                color: '#95B0DD',
                hoverColor: '#6B98E3'
            },
            {
                name: 'RTS_3',
                buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings', 'Labour Mappings'],
                color: '#95B0DD',
                hoverColor: '#6B98E3'
            },
            {
                name: 'SAME_DAY_AM',
                buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings', 'Labour Mappings'],
                color: '#95B0DD',
                hoverColor: '#6B98E3'
            },
            {
                name: 'SAME_DAY',
                buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings', 'Labour Mappings'],
                color: '#95B0DD',
                hoverColor: '#6B98E3'
            }
        ]
    },
    {
        title: 'PFSD Cycles',
        color: '#177E96',
        hoverColor: '#075061',
        cycles: [
            {
                name: 'SAME_DAY_SUNRISE',
                buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings', 'Labour Mappings'],
                color: '#95B0DD',
                hoverColor: '#6B98E3'
            },
            {
                name: 'SAME_DAY_AM',
                buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings', 'Labour Mappings'],
                color: '#95B0DD',
                hoverColor: '#6B98E3'
            },
            {
                name: 'SAME_DAY',
                buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings', 'Labour Mappings'],
                color: '#95B0DD',
                hoverColor: '#6B98E3'
            }
        ]
    },
    {
        title: 'SSD Cycles',
        color: '#177E96',
        hoverColor: '#075061',
        cycles: [
            {
                name: 'SSD_1',
                buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings'],
                color: '#95B0DD',
                hoverColor: '#6B98E3'
            },
            {
                name: 'SSD_EU',
                buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings'],
                color: '#95B0DD',
                hoverColor: '#6B98E3'
            }
        ]
    }
];


        // All cycle configurations
    const cycleConfigurations = {
        // AMXL Cycles
        'AMXL_AMXL_1': {
            type: 'AMXL',
            cycleName: 'AMXL_1',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "800",
                    nextDayCutoff: "15:00"
                },
                clusters: [
                    {
                        name: "Standard_1",
                        prefix: "XL",
                        departTime: "06:00"
                    },
                    {
                        name: "FutureScheduled_1",
                        prefix: "FS",
                        departTime: "06:00"
                    },
                    {
                        name: "Exclusion_1",
                        prefix: "EX",
                        departTime: "06:00"
                    }
                ]
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: false,
                clusters: [
                    {
                        name: "Standard_1",
                        vccCodes: [
                            "Standard_1",
                            "MultiCycle",
                            "Standard_1_CommH",
                            "Standard_1_CommM",
                            "Standard_1_CommU",
                            "Standard_1_CommR",
                            "Standard_1_R_Comm",
                            "Standard_1_CommMU"
                        ]
                    },
                    {
                        name: "FutureScheduled_1",
                        vccCodes: [
                            "FutureScheduled_1",
                            "StickyExclusion"
                        ]
                    },
                    {
                        name: "Exclusion_1",
                        vccCodes: [
                            "Exclusion_1",
                            "Exclusion_2"
                        ]
                    }
                ]
            },
            labourMappingConfigs: {
                settings: {
                    hideYesterdayLabour: true,
                    schedulingAutomation: true,
                    planFinalization: false
                },
                clusters: [
                    {
                        name: "Standard_1",
                        serviceType: "AMXL Infinity Route",
                        shiftTime: "600",
                        labourDepartTime: "17:20",
                        scheduleLaborFiniteQuantity: false,
                        unmappedLabourMapsToCluster: true
                    },
                    {
                        name: "FutureScheduled_1",
                        serviceType: "AMXL Infinity Route",
                        shiftTime: "600",
                        labourDepartTime: "06:20",
                        scheduleLaborFiniteQuantity: false,
                        unmappedLabourMapsToCluster: false,
                        fillOrder: 1
                    },
                    {
                        name: "Exclusion_1",
                        serviceType: "AMXL Infinity Route",
                        shiftTime: "600",
                        labourDepartTime: "08:20",
                        scheduleLaborFiniteQuantity: false,
                        unmappedLabourMapsToCluster: false,
                        fillOrder: 2
                    }
                ]
            }
        },
        'AMXL_AD_HOC_1': {
            type: 'AMXL',
            cycleName: 'AD_HOC_1',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "800",
                    nextDayCutoff: "15:00"
                },
                clusters: [
                    {
                        name: "Crash_1",
                        prefix: "PDD",
                        departTime: "07:30"
                    }
                ]
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: false,
                clusters: [
                    {
                        name: "Crash_1",
                        vccCodes: ["Crash_1"]
                    }
                ]
            }
        },
        'AMXL_AD_HOC_2': {
            type: 'AMXL',
            cycleName: 'AD_HOC_2',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "800",
                    nextDayCutoff: "15:00"
                },
                clusters: [
                    {
                        name: "Emergency_2",
                        prefix: "EMC",
                        departTime: "07:30"
                    },
                    {
                        name: "Crash_2",
                        prefix: "CRC",
                        departTime: "07:30"
                    }
                ]
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: false,
                clusters: [
                    {
                        name: "Emergency_2",
                        vccCodes: ["Emergency_2"]
                    },
                    {
                        name: "Crash_2",
                        vccCodes: ["Crash_2"]
                    }
                ]
            }
        },
        'AMXL_RTS_1': {
            type: 'AMXL',
            cycleName: 'RTS_1',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "800",
                    nextDayCutoff: "15:00"
                },
                clusters: [
                    {
                        name: "Scrub_1",
                        prefix: "SC",
                        departTime: "07:00"
                    }
                ]
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: false,
                clusters: [
                    {
                        name: "Scrub_1",
                        vccCodes: ["Scrub_1"]
                    }
                ]
            }
        },
        'AMXL_RTS_2': {
            type: 'AMXL',
            cycleName: 'RTS_2',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "800",
                    nextDayCutoff: "15:00"
                },
                clusters: [
                    {
                        name: "Scrub_2",
                        prefix: "SCC",
                        departTime: "12:00"
                    }
                ]
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: false,
                clusters: [
                    {
                        name: "Scrub_2",
                        vccCodes: ["Scrub_2"]
                    }
                ]
            }
        },


// AMZL Cycles
        'AMZL_CYCLE_1_SORT_TO_ZONE': {
            type: 'AMZL',
            cycleName: 'CYCLE_1_SORT_TO_ZONE',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "1439",
                    nextDayCutoff: "13:00"
                },
                clusters: [
                    {
                        name: "STATIC_1",
                        prefix: "CX",
                        departTime: "09:00"
                    }
                ]
            },
            dropdownConfigs: {
                sortType: 'SORT_TO_ZONE'
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: true,
                stationArrivalTime: "12:30",
                swaForecastStrategy: "Exclude",
                clusters: [
                    {
                        name: "STATIC_1",
                        clusterType: "CATCH_ALL",
                        transportType: "Any"
                    }
                ]
            },
            labourMappingConfigs: {
                settings: {
                    hideYesterdayLabour: true,
                    schedulingAutomation: true
                },
                clusters: [
                    {
                        name: "STATIC_1",
                        serviceType: "AmFlex Vehicle",
                        shiftTime: "240",
                        labourDepartTime: "12:00",
                        scheduleLaborFiniteQuantity: false,
                        unmappedLabourMapsToCluster: true
                    }
                ]
            }
        },
        'AMZL_CYCLE_1_DYNAMIC': {
            type: 'AMZL',
            cycleName: 'CYCLE_1_DYNAMIC',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "1439",
                    nextDayCutoff: "13:00"
                },
                clusters: [
                    {
                        name: "STATIC_1",
                        prefix: "CX",
                        departTime: "09:00"
                    },
                    {
                        name: "STATIC_2",
                        prefix: "CV",
                        departTime: "09:00"
                    }
                ]
            },
            dropdownConfigs: {
                sortType: 'DYNAMIC',
                routingAlgorithm: 'DYNAMIC-PLANNER'
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: true,
                stationArrivalTime: "12:30",
                clusters: [
                    {
                        name: "STATIC_1",
                        clusterType: "CATCH_ALL",
                        transportType: "Any"
                    },
                    {
                        name: "STATIC_2",
                        clusterType: "CATCH_ALL",
                        transportType: "Any"
                    }
                ]
            },
            labourMappingConfigs: {
                settings: {
                    hideYesterdayLabour: true,
                    schedulingAutomation: true
                },
                clusters: [
                    {
                        name: "STATIC_1",
                        serviceType: "AmFlex Vehicle",
                        shiftTime: "225",
                        labourDepartTime: "08:00",
                        scheduleLaborFiniteQuantity: false,
                        unmappedLabourMapsToCluster: true
                    },
                    {
                        name: "STATIC_2",
                        serviceType: "AmFlex Vehicle",
                        shiftTime: "225",
                        labourDepartTime: "08:00",
                        scheduleLaborFiniteQuantity: false,
                        unmappedLabourMapsToCluster: false,
                        fillOrder: 1
                    }
                ]
            }
        },
        'AMZL_AD_HOC_1': {
            type: 'AMZL',
            cycleName: 'AD_HOC_1',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "800",
                    nextDayCutoff: "20:00"
                },
                clusters: [
                    {
                        name: "ADHOC_1",
                        prefix: "AX",
                        departTime: "12:00"
                    }
                ]
            },
            dropdownConfigs: {
                sortType: 'DYNAMIC',
                routingAlgorithm: 'DYNAMIC-PLANNER'
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: false,
                clusters: [
                    {
                        name: "ADHOC_1",
                        vccCodes: ["ADHOC_1"]
                    }
                ]
            }
        },
        'AMZL_AD_HOC_2': {
            type: 'AMZL',
            cycleName: 'AD_HOC_2',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "800",
                    nextDayCutoff: "20:00"
                },
                clusters: [
                    {
                        name: "ADHOC_2",
                        prefix: "AV",
                        departTime: "14:00"
                    }
                ]
            },
            dropdownConfigs: {
                sortType: 'DYNAMIC',
                routingAlgorithm: 'DYNAMIC-PLANNER'
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: false,
                clusters: [
                    {
                        name: "ADHOC_2",
                        vccCodes: ["ADHOC_2"]
                    }
                ]
            }
        },
        'AMZL_AD_HOC_3': {
            type: 'AMZL',
            cycleName: 'AD_HOC_3',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "800",
                    nextDayCutoff: "20:00"
                },
                clusters: [
                    {
                        name: "ADHOC_3",
                        prefix: "AT",
                        departTime: "16:00"
                    }
                ]
            },
            dropdownConfigs: {
                sortType: 'DYNAMIC',
                routingAlgorithm: 'DYNAMIC-PLANNER'
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: false,
                clusters: [
                    {
                        name: "ADHOC_3",
                        vccCodes: ["ADHOC_3"]
                    }
                ]
            }
        },
        'AMZL_RTS_1': {
            type: 'AMZL',
            cycleName: 'RTS_1',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "800",
                    nextDayCutoff: "20:00"
                },
                clusters: [
                    {
                        name: "RTS_1",
                        prefix: "RX",
                        departTime: "12:00"
                    }
                ]
            },
            dropdownConfigs: {
                sortType: 'DYNAMIC',
                routingAlgorithm: 'DYNAMIC-PLANNER'
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: false,
                clusters: [
                    {
                        name: "RTS_1",
                        vccCodes: ["RTS_1"]
                    }
                ]
            }
        },
        'AMZL_RTS_2': {
            type: 'AMZL',
            cycleName: 'RTS_2',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "800",
                    nextDayCutoff: "20:00"
                },
                clusters: [
                    {
                        name: "RTS_2",
                        prefix: "RV",
                        departTime: "14:00"
                    }
                ]
            },
            dropdownConfigs: {
                sortType: 'DYNAMIC',
                routingAlgorithm: 'DYNAMIC-PLANNER'
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: false,
                clusters: [
                    {
                        name: "RTS_2",
                        vccCodes: ["RTS_2"]
                    }
                ]
            }
        },
        'AMZL_RTS_3': {
            type: 'AMZL',
            cycleName: 'RTS_3',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "800",
                    nextDayCutoff: "20:00"
                },
                clusters: [
                    {
                        name: "RTS_3",
                        prefix: "RT",
                        departTime: "16:00"
                    }
                ]
            },
            dropdownConfigs: {
                sortType: 'DYNAMIC',
                routingAlgorithm: 'DYNAMIC-PLANNER'
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: false,
                clusters: [
                    {
                        name: "RTS_3",
                        vccCodes: ["RTS_3"]
                    }
                ]
            }
        },
        'AMZL_FER': {
            type: 'AMZL',
            cycleName: 'FER',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "105",
                    nextDayCutoff: "23:00"
                },
                clusters: [
                    {
                        name: "FER_1",
                        prefix: "FX",
                        departTime: "19:00"
                    },
                    {
                        name: "FER_2",
                        prefix: "FV",
                        departTime: "19:00"
                    }
                ]
            },
            dropdownConfigs: {
                sortType: 'DYNAMIC',
                routingAlgorithm: 'DYNAMIC-PLANNER'
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: false,
                clusters: [
                    {
                        name: "FER_1",
                        vccCodes: ["FER_1"]
                    },
                    {
                        name: "FER_2",
                        vccCodes: ["FER_2"]
                    }
                ]
        },
        labourMappingConfigs: {
                settings: {
                    schedulingAutomation: true
                },
                clusters: [
                    {
                        name: "FER_1",
                        serviceType: "AmFlex Vehicle",
                        shiftTime: "105",
                        labourDepartTime: "19:00",
                        scheduleLaborFiniteQuantity: false,
                        unmappedLabourMapsToCluster: true
                    },
                    {
                        name: "FER_2",
                        serviceType: "AmFlex Vehicle",
                        shiftTime: "105",
                        labourDepartTime: "19:00",
                        scheduleLaborFiniteQuantity: false,
                        unmappedLabourMapsToCluster: false,
                        fillOrder: 1
                    }
                ]
            }
        },

// PFSD Cycles
         'PFSD_SAME_DAY_SUNRISE': {
            type: 'PFSD',
            cycleName: 'SAME_DAY_SUNRISE',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "1439",
                    nextDayCutoff: "02:30"
                },
                clusters: [
                    {
                        name: "SAME_DAY_SUNRISE",
                        prefix: "SA",
                        departTime: "",
                        departTimeMessage: "Refer to Ops clock snip attached to SIM for Depart Time. Use Dispatch Wave 1 Start for SSD Breakfast window as Depart Time."
                    }
                ]
            },
               volumeMappingConfigs: {
        stationArrivalCutoff: true,
        stationArrivalTime: null, // explicitly set to null
        stationArrivalMessage: "Refer to Ops clock snip attached to SIM for Station Arrival Cutoff. Use CET end time for SSD Breakfast window as Station Arrival Cutoff.",
        clusters: [
            {
                name: "SAME_DAY_SUNRISE",
                vccCodes: ["SAME_DAY_SUNRISE"]
            }
        ]
    },
            labourMappingConfigs: {
                settings: {
                    hideYesterdayLabour: true,
                    schedulingAutomation: true
                },
                clusters: [
                    {
                        name: "SAME_DAY_SUNRISE",
                        serviceType: "AmFlex Vehicle",
                        shiftTime: "165",
                        labourDepartMessage: "Refer to Ops clock snip attached to SIM for Labour Depart Time. Use Dispatch Wave 1 Start for SSD Breakfast window as Labour Depart Time.",
                        scheduleLaborFiniteQuantity: false,
                        unmappedLabourMapsToCluster: true
                    }
                ]
            }
        },
        'PFSD_SAME_DAY_AM': {
            type: 'PFSD',
            cycleName: 'SAME_DAY_AM',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "1439",
                    nextDayCutoff: "06:00"
                },
                clusters: [
                    {
                        name: "SAME_DAY_AM",
                        prefix: "SB",
                        departTime: "",
                        departTimeMessage: "Refer to Ops clock snip attached to SIM for Depart Time. Use Dispatch Wave 1 Start for SSD Brunch window as Depart Time."
                    }
                ]
            },
             volumeMappingConfigs: {
        stationArrivalCutoff: true,
        stationArrivalTime: null, // explicitly set to null
        stationArrivalMessage: "Refer to Ops clock snip attached to SIM for Station Arrival Cutoff. Use CET end time for SSD Brunch window as Station Arrival Cutoff.",
        clusters: [
            {
                name: "SAME_DAY_AM",
                vccCodes: ["SAME_DAY_AM"]
            }
        ]
    },
            labourMappingConfigs: {
                settings: {
                    hideYesterdayLabour: true,
                    schedulingAutomation: true
                },
                clusters: [
                    {
                        name: "SAME_DAY_AM",
                        serviceType: "AmFlex Vehicle",
                        shiftTime: "165",
                        labourDepartMessage: "Refer to Ops clock snip attached to SIM for Labour Depart Time. Use Dispatch Wave 1 Start for SSD Brunch window as Labour Depart Time.",
                        scheduleLaborFiniteQuantity: false,
                        unmappedLabourMapsToCluster: true
                    }
                ]
            }
        },
        'PFSD_SAME_DAY': {
            type: 'PFSD',
            cycleName: 'SAME_DAY',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "1439",
                    nextDayCutoff: "19:00"
                },
                clusters: [
                    {
                        name: "SAME_FLEX1",
                        prefix: "SV",
                        departTime: "17:00"
                    }
                ]
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: true,
                stationArrivalTime: "21:30",
                clusters: [
                    {
                        name: "SAME_FLEX1",
                        clusterType: "CATCH_ALL"
                    }
                ]
            },
            labourMappingConfigs: {
                settings: {
                    hideYesterdayLabour: true,
                    schedulingAutomation: true
                },
                clusters: [
                    {
                        name: "SAME_FLEX1",
                        serviceType: "AmFlex Vehicle",
                        shiftTime: "225",
                        labourDepartTime: "17:00",
                        scheduleLaborFiniteQuantity: false,
                        unmappedLabourMapsToCluster: true
                    }
                ]
            }
        },
// SSD Cycles
        'SSD_1': {
            type: 'SSD',
            cycleName: 'SSD_1',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "800",
                    nextDayCutoff: "20:00"
                },
                clusters: [
                    {
                        name: "SSD",
                        prefix: "T",
                        departTime: "07:30"
                    }
                ]
            },
            dropdownConfigs: {
                sortType: 'DYNAMIC',
                routingAlgorithm: 'DYNAMIC-PLANNER'
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: false,
                clusters: [
                    {
                        name: "SSD",
                        vccCodes: ["Cycle_1"]
                    }
                ]
            }
        },
        'SSD_EU': {
            type: 'SSD',
            cycleName: 'SSD_EU',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "800",
                    nextDayCutoff: "20:00"
                },
                clusters: [
                    {
                        name: "SSD",
                        prefix: "T",
                        departTime: "07:30"
                    }
                ]
            },
            dropdownConfigs: {
                sortType: 'DYNAMIC',
                routingAlgorithm: 'DYNAMIC-PLANNER'
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: false,
                clusters: [
                    {
                        name: "SSD",
                        vccCodes: ["Cycle_1"]
                    }
                ]
            }
    },
// RSR Cycles
'RSR_AMXL_1': {
    type: 'RSR',
    cycleName: 'AMXL_1',
    generalInfo: {
        cycleSettings: {
            planningOpenTime: "00:00",
            openMinutes: "800",
            nextDayCutoff: "20:00"
        },
        clusters: [
            { name: "Standard_1", prefix: "XL", departTime: "06:10" },
            { name: "UDS_BASIC", prefix: "UB", departTime: "18:00" },
            { name: "Professional_1", prefix: "PO", departTime: "06:00" },
            { name: "Appliance_1", prefix: "MA", departTime: "18:00" },
            { name: "FutureScheduled_1", prefix: "FS", departTime: "06:00" },
            { name: "Exclusion_1", prefix: "EX", departTime: "06:00" }
        ]
    },
    dropdownConfigs: {
        sortType: 'DYNAMIC',
        routingAlgorithm: 'DYNAMIC-AMXL'
    },
    volumeMappingConfigs: {
        stationArrivalCutoff: false,
        clusters: [
            { name: "Standard_1", vccCodes: ["Standard_1", "Standard_1_Comm", "Standard_1_CommH", "Standard_1_R_Comm"] },
            { name: "UDS_BASIC", vccCodes: ["UDS_BASIC"] },
            { name: "Professional_1", vccCodes: ["Professional_1"] },
            { name: "Appliance_1", vccCodes: ["Appliance_1"] },
            { name: "FutureScheduled_1", vccCodes: ["FutureScheduled_1"] },
            { name: "Exclusion_1", vccCodes: ["Exclusion_1"] }
        ]
    },
    labourMappingConfigs: {
        settings: {
            hideYesterdayLabour: false,
            schedulingAutomation: true,
            planFinalization: false,
            dspRecycling: false
        },
        clusters: [
            {
                name: "Standard_1", serviceType: "AMXL Infinity Route", shiftTime: "540",
                labourDepartTime: "10:20", scheduleLaborFiniteQuantity: false,
                unmappedLabourMapsToCluster: true
            },
            {
                name: "UDS_BASIC", serviceType: "AMXL Infinity Route", shiftTime: "540",
                labourDepartTime: "10:20", scheduleLaborFiniteQuantity: false,
                unmappedLabourMapsToCluster: false, fillOrder: 3
            },
            {
                name: "Professional_1", serviceType: "AMXL Infinity Route", shiftTime: "540",
                labourDepartTime: "10:20", scheduleLaborFiniteQuantity: false,
                unmappedLabourMapsToCluster: false, fillOrder: 4
            },
            {
                name: "Appliance_1", serviceType: "AMXL Infinity Route", shiftTime: "540",
                labourDepartTime: "10:20", scheduleLaborFiniteQuantity: false,
                unmappedLabourMapsToCluster: false, fillOrder: 5
            },
            {
                name: "FutureScheduled_1", serviceType: "AMXL Infinity Route", shiftTime: "540",
                labourDepartTime: "10:20", scheduleLaborFiniteQuantity: false,
                unmappedLabourMapsToCluster: false, fillOrder: 1
            },
            {
                name: "Exclusion_1", serviceType: "AMXL Infinity Route", shiftTime: "540",
                labourDepartTime: "10:20", scheduleLaborFiniteQuantity: false,
                unmappedLabourMapsToCluster: false, fillOrder: 2
            }
        ]
    }
},
'RSR_AD_HOC_1': {
    type: 'RSR',
    cycleName: 'ADHOC_1',
    generalInfo: {
        cycleSettings: {
            planningOpenTime: "00:00",
            openMinutes: "800",
            nextDayCutoff: "20:00"
        },
        clusters: [
            { name: "ADHOC_1", prefix: "AX", departTime: "12:00" }
        ]
    },
    volumeMappingConfigs: {
        stationArrivalCutoff: false,
        clusters: [
            { name: "ADHOC_1", vccCodes: ["ADHOC_1"] }
        ]
    },
    labourMappingConfigs: {
        settings: {
            hideYesterdayLabour: true,
            schedulingAutomation: true,
            planFinalization: false,
            dspRecycling: true  // Adding this setting
        },
        clusters: [
            {
                name: "Adhoc_1",
                serviceType: "AmFlex Vehicle",
                shiftTime: "240",
                labourDepartTime: "15:00",
                scheduleLaborFiniteQuantity: false,
                unmappedLabourMapsToCluster: true
            }
        ]
    }
},
'RSR_AD_HOC_2': {
    type: 'RSR',
    cycleName: 'ADHOC_2',
    generalInfo: {
        cycleSettings: {
            planningOpenTime: "00:00",
            openMinutes: "800",
            nextDayCutoff: "20:00"
        },
        clusters: [
            { name: "ADHOC_2", prefix: "AV", departTime: "12:00" }
        ]
    },
    volumeMappingConfigs: {
        stationArrivalCutoff: false,
        clusters: [
            { name: "ADHOC_2", vccCodes: ["ADHOC_2"] }
        ]
    },
    labourMappingConfigs: {
        settings: {
            hideYesterdayLabour: true,
            schedulingAutomation: true,
            planFinalization: false,
            dspRecycling: true  // Added this setting
        },
        clusters: [
            {
                name: "Adhoc_2",
                serviceType: "AmFlex Vehicle",
                shiftTime: "240",
                labourDepartTime: "15:00",
                scheduleLaborFiniteQuantity: false,
                unmappedLabourMapsToCluster: true
            }
        ]
    }
},

'RSR_AD_HOC_3': {
    type: 'RSR',
    cycleName: 'ADHOC_3',
    generalInfo: {
        cycleSettings: {
            planningOpenTime: "00:00",
            openMinutes: "800",
            nextDayCutoff: "20:00"
        },
        clusters: [
            { name: "ADHOC_3", prefix: "AT", departTime: "12:00" }
        ]
    },
    volumeMappingConfigs: {
        stationArrivalCutoff: false,
        clusters: [
            { name: "ADHOC_3", vccCodes: ["ADHOC_3"] }
        ]
    },
    labourMappingConfigs: {
        settings: {
            hideYesterdayLabour: true,
            schedulingAutomation: true,
            planFinalization: false,
            dspRecycling: true  // Added this setting
        },
        clusters: [
            {
                name: "Adhoc_3",
                serviceType: "AmFlex Vehicle",
                shiftTime: "240",
                labourDepartTime: "15:00",
                scheduleLaborFiniteQuantity: false,
                unmappedLabourMapsToCluster: true
            }
        ]
    }
},
'RSR_RTS_1': {
    type: 'RSR',
    cycleName: 'RTS_1',
    generalInfo: {
        cycleSettings: {
            planningOpenTime: "00:00",
            openMinutes: "800",
            nextDayCutoff: "20:00:00"
        },
        clusters: [
            { name: "RTS_1", prefix: "RX", departTime: "17:00" }
        ]
    },
    volumeMappingConfigs: {
        stationArrivalCutoff: false,
        clusters: [
            { name: "RTS_1", vccCodes: ["RTS_1"] }
        ]
    },
    labourMappingConfigs: {
        settings: {
            hideYesterdayLabour: true,
            schedulingAutomation: true,
            planFinalization: false,
            dspRecycling: false
        },
        clusters: [
            {
                name: "RTS_1", serviceType: "AmFlex Vehicle", shiftTime: "165",
                labourDepartTime: "17:00", scheduleLaborFiniteQuantity: false,
                unmappedLabourMapsToCluster: true
            }
        ]
    }
},
'RSR_RTS_2': {
    type: 'RSR',
    cycleName: 'RTS_2',
    generalInfo: {
        cycleSettings: {
            planningOpenTime: "00:00",
            openMinutes: "800",
            nextDayCutoff: "20:00"
        },
        clusters: [
            { name: "RTS_2", prefix: "RV", departTime: "17:00" }
        ]
    },
    volumeMappingConfigs: {
        stationArrivalCutoff: false,
        clusters: [
            { name: "RTS_2", vccCodes: ["RTS_2"] }
        ]
    },
    labourMappingConfigs: {
        settings: {
            hideYesterdayLabour: true,
            schedulingAutomation: true,
            planFinalization: false,
            dspRecycling: false
        },
        clusters: [
            {
                name: "RTS_2", serviceType: "AmFlex Vehicle", shiftTime: "165",
                labourDepartTime: "17:00", scheduleLaborFiniteQuantity: false,
                unmappedLabourMapsToCluster: true
            }
        ]
    }
},
'RSR_RTS_3': {
    type: 'RSR',
    cycleName: 'RTS_3',
    generalInfo: {
        cycleSettings: {
            planningOpenTime: "00:00",
            openMinutes: "800",
            nextDayCutoff: "20:00"
        },
        clusters: [
            { name: "RTS_3", prefix: "RT", departTime: "17:00" }
        ]
    },
    volumeMappingConfigs: {
        stationArrivalCutoff: false,
        clusters: [
            { name: "RTS_3", vccCodes: ["RTS_3"] }
        ]
    },
    labourMappingConfigs: {
        settings: {
            hideYesterdayLabour: true,
            schedulingAutomation: true,
            planFinalization: false,
            dspRecycling: false
        },
        clusters: [
            {
                name: "RTS_3", serviceType: "AmFlex Vehicle", shiftTime: "165",
                labourDepartTime: "17:00", scheduleLaborFiniteQuantity: false,
                unmappedLabourMapsToCluster: true
            }
        ]
    }
},
'RSR_SAME_DAY_AM': {
    type: 'RSR',
    cycleName: 'SAME_DAY_AM',
    generalInfo: {
        cycleSettings: {
            planningOpenTime: "00:00",
            openMinutes: "1439",
            nextDayCutoff: "06:00"
        },
        clusters: [
            {
                name: "SAME_DAY_AM",
                prefix: "SB",
                departTime: "",
                departTimeMessage: "Refer to Ops clock snip attached to SIM for Depart Time. Use Dispatch Wave 1 Start for SSD Brunch window as Depart Time."
            }
        ]
    },
    volumeMappingConfigs: {
        stationArrivalCutoff: true,
        stationArrivalTime: null,
        stationArrivalMessage: "Refer to Ops clock snip attached to SIM for Station Arrival Cutoff. Use CET end time for SSD Brunch window as Station Arrival Cutoff.",
        clusters: [
            { name: "SAME_DAY_AM", vccCodes: ["SAME_DAY_AM"] }
        ]
    },
    labourMappingConfigs: {
        settings: {
            hideYesterdayLabour: true,
            schedulingAutomation: true
        },
        clusters: [
            {
                name: "SAME_DAY_AM",
                serviceType: "AmFlex Vehicle",
                shiftTime: "240",
                labourDepartMessage: "Refer to Ops clock snip attached to SIM for Labour Depart Time. Use Dispatch Wave 1 Start for SSD Brunch window as Labour Depart Time.",
                scheduleLaborFiniteQuantity: false,
                unmappedLabourMapsToCluster: true
            }
        ]
    }
},
'RSR_SAME_DAY': {
    type: 'RSR',
    cycleName: 'SAME_DAY',
    generalInfo: {
        cycleSettings: {
            planningOpenTime: "00:00",
            openMinutes: "1439",
            nextDayCutoff: "19:00"
        },
        clusters: [
            {
                name: "SAME_FLEX1",
                prefix: "SV",
                departTime: "",
                departTimeMessage: "Refer to Ops clock snip attached to SIM for Depart Time. Use Dispatch Wave 1 Start for SSD Brunch window as Depart Time."
            }
        ]
    },
    volumeMappingConfigs: {
        stationArrivalCutoff: true,
        stationArrivalTime: "21:30",
        clusters: [
            { name: "SAME_FLEX1", clusterType: "CATCH_ALL" }
        ]
    },
    labourMappingConfigs: {
        settings: {
            hideYesterdayLabour: true,
            schedulingAutomation: true
        },
        clusters: [
            {
                name: "SAME_FLEX1",
                serviceType: "AmFlex Vehicle",
                shiftTime: "240",
                labourDepartMessage: "Refer to Ops clock snip attached to SIM for Labour Depart Time. Use Dispatch Wave 1 Start for SSD Brunch window as Labour Depart Time.",
                scheduleLaborFiniteQuantity: false,
                unmappedLabourMapsToCluster: true
            }
        ]
    }
}

    };

        // Helper Functions
    function createPopup(message) {
    const theme = getCurrentTheme();
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.backgroundColor = theme.mainBackground;
    popup.style.padding = '20px';
    popup.style.border = `2px solid ${theme.mainBorder}`;
    popup.style.borderRadius = '5px';
    popup.style.zIndex = '10000';
    popup.style.maxWidth = '400px';
    popup.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    popup.style.color = theme.mainTextColor;

    const messageText = document.createElement('p');
    messageText.textContent = message;
    messageText.style.margin = '0 0 15px 0';
    messageText.style.fontSize = '20px';

    const okButton = document.createElement('button');
    okButton.textContent = 'OK';
    okButton.style.padding = '5px 15px';
    okButton.style.backgroundColor = theme.mainBackground;
    okButton.style.color = theme.mainTextColor;
    okButton.style.border = `1px solid ${theme.mainBorder}`;
    okButton.style.borderRadius = '3px';
    okButton.style.cursor = 'pointer';
    okButton.style.float = 'right';

    okButton.addEventListener('mouseover', () => {
        okButton.style.backgroundColor = theme.mainHover;
    });
    okButton.addEventListener('mouseout', () => {
        okButton.style.backgroundColor = theme.mainBackground;
    });

    okButton.onclick = () => {
        document.body.removeChild(popup);
    };

    popup.appendChild(messageText);
    popup.appendChild(okButton);
    document.body.appendChild(popup);
}

    function logElement(element, label = 'Element') {
        console.log(`${label}:`, {
            tagName: element?.tagName,
            id: element?.id,
            className: element?.className,
            role: element?.getAttribute('role'),
            'aria-controls': element?.getAttribute('aria-controls'),
            'aria-expanded': element?.getAttribute('aria-expanded'),
            textContent: element?.textContent?.trim()
        });
    }

    async function waitForElement(selector, timeout = 2000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const element = document.querySelector(selector);
            if (element) return element;
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return null;
    }

    function setNativeValue(element, value) {
        const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
        const prototype = Object.getPrototypeOf(element);
        const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;

        if (valueSetter && valueSetter !== prototypeValueSetter) {
            prototypeValueSetter.call(element, value);
        } else {
            valueSetter.call(element, value);
        }
    }

    function triggerEvents(element) {
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));
    }

    function fillInput(element, value) {
        if (element) {
            setNativeValue(element, value);
            triggerEvents(element);
        }
    }

    async function setDropdownValue(elementId, value) {
        console.log('\n=== Starting Dropdown Setting ===');
        console.log(`Attempting to set ${elementId} to ${value}`);

        const dropdown = document.querySelector(`#${elementId}[role="combobox"]`);
        if (!dropdown) {
            console.log(`❌ Dropdown ${elementId} not found`);
            return false;
        }

        logElement(dropdown, 'Found Dropdown');

        try {
            console.log('Step 1: Opening dropdown...');
            const mouseDown = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            dropdown.dispatchEvent(mouseDown);
            console.log('Dispatched mousedown event');

            await new Promise(resolve => setTimeout(resolve, 1000));

            const options = document.querySelectorAll('[role="option"]');
            console.log(`\nFound ${options.length} options`);

            const targetOption = Array.from(options).find(option =>
                option.textContent.trim() === value
            );

            if (targetOption) {
                console.log('Found matching option:', targetOption.textContent);

                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                targetOption.dispatchEvent(clickEvent);

                await new Promise(resolve => setTimeout(resolve, 200));

                const valueContainer = dropdown.querySelector(`#${elementId}-value`);
                if (valueContainer) {
                    console.log('Updating value container...');
                    valueContainer.textContent = value;
                    triggerEvents(valueContainer);
                    triggerEvents(dropdown);
                }

                console.log('✅ Dropdown value set successfully');
                return true;
            } else {
                console.log('❌ Target option not found');
            }

            return false;
        } catch (error) {
            console.error('❌ Error setting dropdown value:', error);
            return false;
        }
    }

// Styling Helper Functions
    function styleMainButton(button) {
    const theme = getCurrentTheme();
    button.style.width = '200px';
    button.style.padding = '10px';
    button.style.backgroundColor = theme.mainBackground;
    button.style.border = `3px solid ${theme.mainBorder}`;
    button.style.borderRadius = '5px';
    button.style.color = theme.mainTextColor;
    button.style.cursor = 'pointer';
    button.style.fontFamily = 'Arial, sans-serif';
    button.style.fontSize = '15px';
    button.style.fontWeight = 'bold';
    button.style.textAlign = 'left';

    button.addEventListener('mouseover', () => {
        button.style.backgroundColor = theme.mainHover;
    });
    button.addEventListener('mouseout', () => {
        button.style.backgroundColor = theme.mainBackground;
    });
}

function styleSectionToggle(button) {
    const theme = getCurrentTheme();
    button.style.width = '280px';
    button.style.padding = '8px';
    button.style.backgroundColor = theme.sectionBackground;
    button.style.border = `2px solid ${theme.mainBorder}`;
    button.style.borderRadius = '4px';
    button.style.color = theme.sectionTextColor;
    button.style.cursor = 'pointer';
    button.style.fontFamily = 'Arial, sans-serif';
    button.style.fontSize = '15px';
    button.style.fontWeight = 'bold';
    button.style.textAlign = 'left';

    button.addEventListener('mouseover', () => {
        button.style.backgroundColor = theme.sectionHover;
    });
    button.addEventListener('mouseout', () => {
        button.style.backgroundColor = theme.sectionBackground;
    });
}

function styleCycleToggle(button) {
    const theme = getCurrentTheme();
    button.style.width = '260px';
    button.style.padding = '6px';
    button.style.backgroundColor = theme.cycleBackground;
    button.style.border = `2px solid ${theme.mainBorder}`;
    button.style.borderRadius = '3px';
    button.style.color = theme.cycleTextColor;
    button.style.cursor = 'pointer';
    button.style.fontFamily = 'Arial, sans-serif';
    button.style.fontSize = '15px';
    button.style.fontWeight = 'bold';
    button.style.textAlign = 'left';

    button.addEventListener('mouseover', () => {
        button.style.backgroundColor = theme.cycleHover;
    });
    button.addEventListener('mouseout', () => {
        button.style.backgroundColor = theme.cycleBackground;
    });
}

function styleActionButton(button) {
    const theme = getCurrentTheme();
    button.style.width = '240px';
    button.style.padding = '6px';
    button.style.backgroundColor = theme.actionBackground;
    button.style.border = `1px solid ${theme.mainBorder}`;
    button.style.borderRadius = '3px';
    button.style.color = theme.actionTextColor;
    button.style.cursor = 'pointer';
    button.style.fontFamily = 'Arial, sans-serif';
    button.style.fontSize = '15px';
    button.style.textAlign = 'left';

    button.addEventListener('mouseover', () => {
        button.style.backgroundColor = theme.actionHover;
    });
    button.addEventListener('mouseout', () => {
        button.style.backgroundColor = theme.actionBackground;
    });
}


        // Form Filling Functions
    async function fillClusterForm(cluster, index) {
        console.log(`Filling cluster ${index + 1}: ${cluster.name}`);

        const nameInput = await waitForElement(`#clusterCode-${index}`);
        const prefixInput = await waitForElement(`#clusterPrefix-${index}`);
        const departTimeInput = await waitForElement(`#departTime-${index}`);

        if (nameInput && prefixInput && departTimeInput) {
            fillInput(nameInput, cluster.name);
            await new Promise(resolve => setTimeout(resolve, 200));

            fillInput(prefixInput, cluster.prefix);
            await new Promise(resolve => setTimeout(resolve, 200));

            if (cluster.departTimeMessage) {
                createPopup(cluster.departTimeMessage);
            }

            if (cluster.departTime) {
                fillInput(departTimeInput, cluster.departTime);
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            return true;
        }
        return false;
    }

    async function fillCycleSettings(config) {
        const planningOpenTime = document.getElementById('planningOpenTime');
        const openMinutes = document.getElementById('openMinutes');
        const nextDayCutoff = document.getElementById('nextDayCutoff');

        if (planningOpenTime) fillInput(planningOpenTime, config.planningOpenTime);
        if (openMinutes) fillInput(openMinutes, config.openMinutes);
        if (nextDayCutoff) fillInput(nextDayCutoff, config.nextDayCutoff);
    }

    async function addAndFillClusters(clusters) {
    for (let i = 0; i < clusters.length; i++) {
        // Try multiple selectors for the Add Cluster button
        const addButton = await waitForElement('button.css-c6ayu0') || // Light mode
                         await waitForElement('button[aria-label="Add Cluster"]') || // Try aria-label
                         await waitForElement('button.css-1t4qwh') || // Possible dark mode class
                         document.querySelector('button:contains("Add Cluster")'); // Fallback

        console.log('Found Add Cluster button:', addButton); // Debug log

        if (addButton) {
            addButton.click();
            await new Promise(resolve => setTimeout(resolve, 1000));

            await fillClusterForm(clusters[i], i);
            await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
            console.error('Could not find Add Cluster button');
            break;
        }
    }
}

    async function switchToGeneralInfoTab() {
    console.log('Attempting to switch to General Info tab...');

    // Try multiple selectors
    const selectors = [
        'input[value="general-info"]',
        'input[value="generalInfo"]',
        'input[value="general"]',
        'label[for*="general"]',
        '[aria-label*="General Info"]',
        '[role="tab"]:has-text("General Info")',
        // Add a selector that looks for text content
        Array.from(document.querySelectorAll('[role="tab"]')).find(el =>
            el.textContent.includes('General Info'))
    ];

    let tab = null;
    for (const selector of selectors) {
        if (typeof selector === 'string') {
            tab = document.querySelector(selector);
        } else if (selector) {
            tab = selector;
        }
        if (tab) break;
    }

    if (tab) {
        console.log('Found General Info tab, clicking...');
        tab.click();
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('✅ Switched to General Info tab');
        return true;
    } else {
        console.error('Could not find General Info tab');
        // Log all available tabs for debugging
        const allTabs = document.querySelectorAll('[role="tab"]');
        console.log('Available tabs:', Array.from(allTabs).map(tab => ({
            value: tab.value,
            text: tab.textContent,
            role: tab.getAttribute('role'),
            ariaLabel: tab.getAttribute('aria-label')
        })));
        return false;
    }
}

async function fillAllTextFields(config) {
    console.log('\n=== Starting General Info Text Fields Fill ===');

    // Use the new tab switching function
    await switchToGeneralInfoTab();

    console.log('Starting text field fill...');
    await fillCycleSettings(config.generalInfo.cycleSettings);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await addAndFillClusters(config.generalInfo.clusters);
    console.log('=== Text Field Fill Complete ===');
}

async function fillAllDropdowns(config) {
    console.log('\n=== Starting General Info Dropdowns Fill ===');

    // Use the new tab switching function
    await switchToGeneralInfoTab();

    console.log('Starting dropdown fill...');

    // Set Sort Type based on cycle configuration
    console.log('\nSetting Sort Type...');
    const sortType = config.dropdownConfigs?.sortType || 'DYNAMIC';
    await setDropdownValue('sortType', sortType);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Set Routing Algorithm for each cluster if needed
    if (sortType !== 'SORT_TO_ZONE') {
        const clusterCount = config.generalInfo.clusters.length;
        for (let i = 0; i < clusterCount; i++) {
            console.log(`\nSetting Routing Algorithm for cluster ${i + 1}...`);

            // Check if it's an AMXL cycle either by type or cycle name
            const isAMXLCycle = config.type === 'AMXL' || config.cycleName.includes('AMXL');
            console.log('Is AMXL cycle:', isAMXLCycle);

            const routingAlgorithm = isAMXLCycle ? 'DYNAMIC-AMXL' : 'DYNAMIC-PLANNER';
            console.log('Using routing algorithm:', routingAlgorithm);

            await setDropdownValue(`routingAlgorithm-${i}`, routingAlgorithm);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    console.log('=== Dropdown Fill Complete ===');
}


async function fillVolumeMappings(config) {
    console.log('\n=== Starting Volume Mappings Fill ===');

    // Switch to Volume Mappings tab
    console.log('Switching to Volume Mappings tab...');
    const volumeMappingsTab = await waitForElement('input[value="volume-mappings"]');
    if (volumeMappingsTab) {
        volumeMappingsTab.click();
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('✅ Switched to Volume Mappings tab');
    }

     console.log('Handling Station Arrival Cutoff...');
    const cycleSettingsSection = document.querySelector('.css-dsf1ob');
    if (cycleSettingsSection) {
        const toggle = cycleSettingsSection.querySelector('input[type="checkbox"][role="switch"]');
        if (toggle) {
            console.log('Found Station Arrival Cutoff toggle');

            // Specific handling for AMZL Cycle 1 Sort to Zone
        if (config.type === 'AMZL' && config.cycleName === 'CYCLE_1_SORT_TO_ZONE') {
            console.log('Handling AMZL Cycle 1 Sort to Zone configuration...');

            // Ensure toggle is on
            if (!toggle.checked) {
                toggle.click();
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            // Set the time to 12:30
            const timeInput = document.querySelector('#stationArrivalCutoffs');
            if (timeInput) {
                console.log('Setting Station Arrival Time to 12:30...');
                fillInput(timeInput, "12:30");
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

            // For PFSD SAME_DAY_SUNRISE, PFSD SAME_DAY_AM, and RSR SAME_DAY_AM, ensure the time field is empty
            if ((config.type === 'PFSD' && (config.cycleName === 'SAME_DAY_SUNRISE' || config.cycleName === 'SAME_DAY_AM')) ||
                (config.type === 'RSR' && config.cycleName === 'SAME_DAY_AM')) {
                console.log(`Handling ${config.type} ${config.cycleName} configuration...`);

                if (!toggle.checked) {
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                // Clear the time input field
                const timeInput = document.querySelector('#stationArrivalCutoffs');
                if (timeInput) {
                    console.log('Clearing Station Arrival Time...');
                    fillInput(timeInput, '');
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                // Show the appropriate message
                if (config.volumeMappingConfigs.stationArrivalMessage) {
                    createPopup(config.volumeMappingConfigs.stationArrivalMessage);
                }
            }
            // Specific handling for PFSD and RSR SAME_DAY
            else if ((config.type === 'PFSD' || config.type === 'RSR') && config.cycleName === 'SAME_DAY') {
                console.log(`Handling ${config.type} SAME_DAY specific configuration...`);

                // Ensure toggle is on
                if (!toggle.checked) {
                    console.log('Turning on Station Arrival Cutoff for SAME_DAY...');
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                // Set the time to 21:30
                const timeInput = document.querySelector('#stationArrivalCutoffs');
                if (timeInput) {
                    console.log('Setting Station Arrival Time to 21:30...');
                    fillInput(timeInput, "21:30");
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } else {
                    console.error('Could not find station arrival time input for SAME_DAY');
                }
            }
            // Handle all other cycles
            else {
                if (config.volumeMappingConfigs.stationArrivalCutoff === false && toggle.checked) {
                    console.log('Turning off Station Arrival Cutoff...');
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } else if (config.volumeMappingConfigs.stationArrivalCutoff === true && !toggle.checked) {
                    console.log('Turning on Station Arrival Cutoff...');
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    if (config.volumeMappingConfigs.stationArrivalMessage) {
                        createPopup(config.volumeMappingConfigs.stationArrivalMessage);
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }

                    if (config.volumeMappingConfigs.stationArrivalTime) {
                        const timeInput = document.querySelector('#stationArrivalCutoffs');
                        if (timeInput) {
                            console.log('Setting Station Arrival Time...');
                            fillInput(timeInput, config.volumeMappingConfigs.stationArrivalTime);
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }
                }
            }
        }
    }

    // Process each cluster's volume mappings
    const sections = document.querySelectorAll('.css-uz15kn');
    for (let section of sections) {
        const titleElement = section.querySelector('.css-a4ni36');
        if (!titleElement) continue;

        const clusterConfig = config.volumeMappingConfigs.clusters.find(conf =>
            titleElement.textContent.includes(conf.name)
        );
        if (!clusterConfig) continue;

        console.log(`Processing cluster: ${clusterConfig.name}`);

        // Find and click the cluster type dropdown
        const dropdown = section.querySelector('.css-rd6znd[role="combobox"]');
        if (dropdown) {
            console.log('Found dropdown, attempting to click...');

            const mouseDown = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            dropdown.dispatchEvent(mouseDown);
            await new Promise(resolve => setTimeout(resolve, 1000));

            const options = document.querySelectorAll('[role="option"]');
            const targetOption = Array.from(options).find(option =>
                option.textContent.trim() === (clusterConfig.clusterType || 'VCC')
            );

            if (targetOption) {
                console.log(`Clicking option: ${targetOption.textContent.trim()}`);
                targetOption.click();
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Handle VCC codes if cluster type is VCC
                if (!clusterConfig.clusterType && clusterConfig.vccCodes && clusterConfig.vccCodes.length > 0) {
                    const editButton = Array.from(section.querySelectorAll('button'))
                        .find(button => button.textContent.includes('Edit'));

                    if (editButton) {
                        console.log('Clicking Edit button');
                        editButton.click();
                        await new Promise(resolve => setTimeout(resolve, 1000));

                        const textarea = document.querySelector('textarea');
                        if (textarea) {
                            console.log('Setting VCC codes');
                            const vccCodes = clusterConfig.vccCodes.join('\n');

                            setNativeValue(textarea, vccCodes);
                            textarea.dispatchEvent(new Event('input', { bubbles: true }));
                            textarea.dispatchEvent(new Event('change', { bubbles: true }));

                            await new Promise(resolve => setTimeout(resolve, 1000));

                            const saveButton = document.querySelector('button.css-2cbc2h');
                            if (saveButton) {
                                console.log('Saving VCC codes');
                                saveButton.click();
                                await new Promise(resolve => setTimeout(resolve, 1000));
                            }
                        }
                    }
                }
            }
        }
    }

    console.log('=== Volume Mappings Fill Complete ===');
}


async function fillLabourMappings(config) {
    if (!config.labourMappingConfigs) {
        console.log('No labour mapping configurations found for this cycle');
        return;
    }

    console.log('\n=== Starting Labour Mappings Fill ===');
    console.log('Cycle:', config.cycleName);

    // Switch to Labour Mappings tab
    console.log('Switching to Labour Mappings tab...');
    const labourMappingsTab = await waitForElement('input[value="labour-mappings"]');
    if (labourMappingsTab) {
        labourMappingsTab.click();
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('✅ Switched to Labour Mappings tab');
    }

    // Handle top section settings
    const settings = config.labourMappingConfigs.settings;
    console.log('Labour Mapping Settings:', settings);

    // Find all toggle sections
    const toggleSections = document.querySelectorAll('.css-uhaq8');

    // Toggle Hide Yesterday's Labour
    if (settings.hideYesterdayLabour === true) {
        console.log('Looking for Hide Yesterday\'s Labour toggle...');
        const hideYesterdaySection = Array.from(toggleSections).find(section =>
            section.textContent.includes('Hide Use Yesterday\'s Labour Button')
        );

        if (hideYesterdaySection) {
            const toggle = hideYesterdaySection.querySelector('input[type="checkbox"][role="switch"]');
            if (toggle && !toggle.checked) {
                console.log('Turning ON Hide Yesterday\'s Labour');
                toggle.click();
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    // Toggle Scheduling Automation
    if (settings.schedulingAutomation === true) {
        console.log('Looking for Scheduling Automation toggle...');
        const schedulingSection = Array.from(toggleSections).find(section =>
            section.textContent.includes('Scheduling Automation')
        );

        if (schedulingSection) {
            const toggle = schedulingSection.querySelector('input[type="checkbox"][role="switch"]');
            if (toggle && !toggle.checked) {
                console.log('Turning ON Scheduling Automation');
                toggle.click();
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    // Toggle DSP Recycling
    if (settings.dspRecycling === false) {
        console.log('Looking for DSP Recycling toggle...');
        const dspRecyclingSection = Array.from(toggleSections).find(section =>
            section.textContent.includes('DSP Recycling')
        );

        if (dspRecyclingSection) {
            const toggle = dspRecyclingSection.querySelector('input[type="checkbox"][role="switch"]');
            if (toggle && toggle.checked) {
                console.log('Turning OFF DSP Recycling');
                toggle.click();
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    } else if (settings.dspRecycling === true) {
        const dspRecyclingSection = Array.from(toggleSections).find(section =>
            section.textContent.includes('DSP Recycling')
        );

        if (dspRecyclingSection) {
            const toggle = dspRecyclingSection.querySelector('input[type="checkbox"][role="switch"]');
            if (toggle && !toggle.checked) {
                console.log('Turning ON DSP Recycling');
                toggle.click();
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    // Toggle Plan Finalization
    if (settings.planFinalization === false) {
        console.log('Looking for Plan Finalization toggle...');
        const planFinalizationSection = Array.from(toggleSections).find(section =>
            section.textContent.includes('Plan Finalization')
        );

        if (planFinalizationSection) {
            const toggle = planFinalizationSection.querySelector('input[type="checkbox"][role="switch"]');
            if (toggle && toggle.checked) {
                console.log('Turning OFF Plan Finalization');
                toggle.click();
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    // Process each cluster's labour settings
    for (const cluster of config.labourMappingConfigs.clusters) {
        console.log(`\nConfiguring labour settings for cluster: ${cluster.name}`);

        if (cluster.labourDepartMessage) {
            createPopup(cluster.labourDepartMessage);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        const sections = document.querySelectorAll('.css-uz15kn');
        const clusterSection = Array.from(sections).find(section =>
            section.textContent.includes(cluster.name)
        );

        if (clusterSection) {
            // Set Service Type
            const serviceTypeDropdown = clusterSection.querySelector('.css-wkvjgb[role="combobox"]');
            if (serviceTypeDropdown) {
                console.log('Setting service type...');
                const mouseDown = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                serviceTypeDropdown.dispatchEvent(mouseDown);
                await new Promise(resolve => setTimeout(resolve, 1000));

                const options = document.querySelectorAll('[role="option"]');
                const targetOption = Array.from(options).find(option =>
                    option.textContent.trim() === cluster.serviceType
                );

                if (targetOption) {
                    targetOption.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            // Set Shift Time
            const shiftTimeInput = clusterSection.querySelector('input[aria-label="Shift time (mins)"]');
            if (shiftTimeInput) {
                console.log('Setting shift time');
                fillInput(shiftTimeInput, cluster.shiftTime);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            // Set Labour Depart Time
            if (cluster.labourDepartTime) {
    console.log('Setting labour depart time:', cluster.labourDepartTime);

    // Try to find all time picker inputs in the cluster section
    const timePickers = clusterSection.querySelectorAll('input[id^="timepicker-"]');
    console.log(`Found ${timePickers.length} time picker inputs`);

    // Find the correct time picker for Labour Depart Time
    const timeInput = Array.from(timePickers).find(input => {
        const label = input.closest('.css-14lg5yy')?.querySelector('label');
        return label && label.textContent.includes('Labour Depart Time');
    });

    if (timeInput) {
        console.log('Found labour depart time input');
        try {
            // Focus the input first
            timeInput.focus();
            await new Promise(resolve => setTimeout(resolve, 100));

            // Clear existing value
            timeInput.value = '';
            timeInput.dispatchEvent(new Event('input', { bubbles: true }));
            await new Promise(resolve => setTimeout(resolve, 100));

            // Set new value
            setNativeValue(timeInput, cluster.labourDepartTime);

            // Dispatch necessary events
            timeInput.dispatchEvent(new Event('input', { bubbles: true }));
            timeInput.dispatchEvent(new Event('change', { bubbles: true }));
            timeInput.dispatchEvent(new Event('blur', { bubbles: true }));

            await new Promise(resolve => setTimeout(resolve, 100));

            // Verify the value was set
            console.log('Final input value:', timeInput.value);
        } catch (error) {
            console.error('Error setting labour depart time:', error);
        }
    } else {
        console.error('Could not find labour depart time input');
        // Log available inputs for debugging
        const allInputs = clusterSection.querySelectorAll('input');
        console.log('Available inputs:', Array.from(allInputs).map(input => ({
            id: input.id,
            type: input.type,
            class: input.className,
            ariaLabel: input.getAttribute('aria-label'),
            label: input.closest('.css-14lg5yy')?.querySelector('label')?.textContent
        })));
    }
}

            // Handle cluster-specific toggles and settings
            const toggleSections = clusterSection.querySelectorAll('.css-1irdh6e');
            for (const section of toggleSections) {
                const sectionText = section.textContent;

                // Handle Schedule labour with finite quantity toggle
                if (sectionText.includes('Schedule labour with finite quantity')) {
                    const toggle = section.querySelector('input[type="checkbox"]');
                    if (toggle && toggle.checked !== cluster.scheduleLaborFiniteQuantity) {
                        toggle.click();
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }

                // Handle Unmapped labour maps to this cluster toggle
                if (sectionText.includes('Unmapped labour maps to this cluster')) {
                    const toggle = section.querySelector('input[type="checkbox"]');
                    if (toggle && toggle.checked !== cluster.unmappedLabourMapsToCluster) {
                        toggle.click();
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }

                // Handle Fill Order
                if (sectionText.includes('Fill order') && cluster.fillOrder) {
                    const fillOrderDropdown = section.querySelector('.css-1hmh5e9[role="combobox"]');
                    if (fillOrderDropdown) {
                        console.log('Setting Fill Order:', cluster.fillOrder);

                        const mouseDown = new MouseEvent('mousedown', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        });
                        fillOrderDropdown.dispatchEvent(mouseDown);
                        await new Promise(resolve => setTimeout(resolve, 1000));

                        const options = document.querySelectorAll('[role="option"]');
                        const fillOrderOption = Array.from(options).find(opt =>
                            opt.textContent.trim() === cluster.fillOrder.toString()
                        );

                        if (fillOrderOption) {
                            fillOrderOption.click();
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }
                }
            }
        }
    }

    console.log('=== Labour Mappings Fill Complete ===');
}



    
function updateUIColors(theme) {
    // Update container background
    const container = document.querySelector('div[style*="position: fixed"]');
    if (!container) return; // Exit if our tool container isn't found

    // Update theme selector (scoped to our container)
    const themeSelector = container.querySelector('select');
    if (themeSelector) {
        themeSelector.style.backgroundColor = theme.mainBackground;
        themeSelector.style.color = theme.mainTextColor;
        themeSelector.style.border = `1px solid ${theme.mainBorder}`;
    }

    // Update drag handle (scoped to our container)
    const dragHandle = container.querySelector('div[style*="cursor: move"]');
    if (dragHandle) {
        dragHandle.style.backgroundColor = theme.mainBackground;
    }

    // Update main toggle button (scoped to our container)
    const mainButton = container.querySelector('button:not([data-title]):not([data-name])');
    if (mainButton) {
        styleMainButton(mainButton);
    }

    // Update content container (scoped to our container)
    const contentContainer = container.querySelector('div[style*="flex-direction: column"]');
    if (contentContainer) {
        contentContainer.style.backgroundColor = theme.mainBackground;
        contentContainer.style.border = `2px solid ${theme.mainBorder}`;
    }

    // Update section toggles (scoped to our container)
    container.querySelectorAll('[data-title]').forEach(section => {
        const sectionToggle = section.querySelector('button');
        if (sectionToggle) {
            styleSectionToggle(sectionToggle);
        }
    });

    // Update cycle toggles (scoped to our container)
    container.querySelectorAll('[data-name]').forEach(cycle => {
        const cycleToggle = cycle.querySelector('button');
        if (cycleToggle) {
            styleCycleToggle(cycleToggle);
        }
    });

    // Update action buttons (scoped to our container)
    container.querySelectorAll('button').forEach(button => {
        if (button.innerHTML.includes('.')) {
            styleActionButton(button);
        }
    });
}


    function createUI() {
    const theme = getCurrentTheme();

    // Create main container
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '10px';
    container.style.bottom = '10px';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '5px';

    // Create theme selector
    const themeSelector = document.createElement('select');
    themeSelector.style.width = '200px';
    themeSelector.style.padding = '5px';
    themeSelector.style.marginBottom = '5px';
    themeSelector.style.borderRadius = '5px';
    themeSelector.style.border = `1px solid ${theme.mainBorder}`;
    themeSelector.style.backgroundColor = theme.mainBackground;
    themeSelector.style.color = theme.mainTextColor;
    themeSelector.style.cursor = 'pointer';

    // Add theme options
    Object.keys(COLOR_SCHEMES).forEach(themeName => {
        const option = document.createElement('option');
        option.value = themeName;
        option.text = COLOR_SCHEMES[themeName].name;
        themeSelector.appendChild(option);
    });

    // Set initial value
    themeSelector.value = localStorage.getItem('rtwToolTheme') || 'dark';

    // Add theme change listener
    themeSelector.addEventListener('change', (e) => {
        const newTheme = setTheme(e.target.value);
        updateUIColors(newTheme);
    });

    // Create drag handle
    const dragHandle = document.createElement('div');
    dragHandle.style.width = '200px';
    dragHandle.style.height = '20px';
    dragHandle.style.backgroundColor = theme.mainBackground;
    dragHandle.style.cursor = 'move';
    dragHandle.style.borderRadius = '5px 5px 0 0';

    // Add drag functionality
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;

    dragHandle.addEventListener('mousedown', (e) => {
        isDragging = true;
        const rect = container.getBoundingClientRect();
        initialX = e.clientX - rect.left;
        initialY = e.clientY - rect.top;
        container.style.bottom = 'auto';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        container.style.left = `${currentX}px`;
        container.style.top = `${currentY}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Create main toggle button
    const mainToggle = document.createElement('button');
    mainToggle.innerHTML = '▼ RTW Auto Fill Tool';
    styleMainButton(mainToggle);

    // Create main content container
    const contentContainer = document.createElement('div');
    contentContainer.style.display = 'none';
    contentContainer.style.flexDirection = 'column';
    contentContainer.style.marginTop = '5px';
    contentContainer.style.backgroundColor = theme.mainBackground;
    contentContainer.style.border = `2px solid ${theme.mainBorder}`;
    contentContainer.style.borderRadius = '5px';
    contentContainer.style.padding = '10px';
    contentContainer.style.maxHeight = '80vh';
    contentContainer.style.overflowY = 'auto';
    contentContainer.style.gap = '10px';

    // Toggle functionality for main button
    mainToggle.onclick = () => {
        const isOpen = contentContainer.style.display !== 'none';
        contentContainer.style.display = isOpen ? 'none' : 'flex';
        mainToggle.innerHTML = `${isOpen ? '▼' : '▲'} RTW Auto Fill Tool`;

        // If closing the main container, close all sections and cycles
        if (isOpen) {
            const sectionDivs = contentContainer.querySelectorAll('div[style*="flex-direction: column"]');
            sectionDivs.forEach(sectionDiv => {
                const sectionToggle = sectionDiv.querySelector('button');
                const sectionContent = sectionDiv.querySelector('div');
                if (sectionToggle && sectionContent) {
                    sectionContent.style.display = 'none';
                    sectionToggle.innerHTML = sectionToggle.innerHTML.replace('▲', '▼');

                    const cycleDivs = sectionContent.querySelectorAll('[style*="flex-direction: column"]');
                    cycleDivs.forEach(cycleDiv => {
                        const cycleToggle = cycleDiv.querySelector('button');
                        const cycleContent = cycleDiv.querySelector('div');
                        if (cycleToggle && cycleContent) {
                            cycleContent.style.display = 'none';
                            cycleToggle.innerHTML = cycleToggle.innerHTML.replace('▲', '▼');
                        }
                    });
                }
            });
        }
    };

    // Create sections
    sections.forEach(section => {
        const sectionDiv = document.createElement('div');
        sectionDiv.setAttribute('data-title', section.title);
        sectionDiv.style.display = 'flex';
        sectionDiv.style.flexDirection = 'column';
        sectionDiv.style.gap = '5px';
        sectionDiv.style.marginBottom = '10px';

        const sectionToggle = document.createElement('button');
        sectionToggle.innerHTML = `▼ ${section.title}`;
        styleSectionToggle(sectionToggle);

        const sectionContent = document.createElement('div');
        sectionContent.style.display = 'none';
        sectionContent.style.flexDirection = 'column';
        sectionContent.style.marginLeft = '15px';
        sectionContent.style.marginTop = '5px';
        sectionContent.style.gap = '5px';

        // Section toggle functionality
        sectionToggle.onclick = () => {
            const theme = getCurrentTheme();
            const isOpen = sectionContent.style.display !== 'none';
            sectionContent.style.display = isOpen ? 'none' : 'flex';
            sectionToggle.innerHTML = `${isOpen ? '▼' : '▲'} ${section.title}`;

            const allSectionDivs = Array.from(contentContainer.children);

            allSectionDivs.forEach(otherSectionDiv => {
                const otherSectionToggle = otherSectionDiv.querySelector('button');
                const otherSectionContent = otherSectionDiv.querySelector('div');

                if (otherSectionToggle !== sectionToggle) {
                    if (!isOpen) {
                        otherSectionDiv.style.marginBottom = '2px';
                        otherSectionContent.style.display = 'none';
                        otherSectionToggle.style.height = '2px';
                        otherSectionToggle.style.padding = '0';
                        otherSectionToggle.style.fontSize = '0';
                        otherSectionToggle.innerHTML = '';
                        otherSectionToggle.style.backgroundColor = theme.sectionBackground;
                        otherSectionToggle.style.color = theme.sectionTextColor;
                    } else {
                        otherSectionDiv.style.marginBottom = '10px';
                        otherSectionToggle.style.height = '';
                        otherSectionToggle.style.padding = '8px';
                        otherSectionToggle.style.fontSize = '15px';
                        otherSectionToggle.innerHTML = `▼ ${otherSectionDiv.getAttribute('data-title')}`;
                    }
                } else if (!isOpen) {
                    const allCycleDivs = Array.from(otherSectionContent.children);
                    allCycleDivs.forEach(cycleDiv => {
                        const cycleToggle = cycleDiv.querySelector('button');
                        if (cycleToggle) {
                            cycleDiv.style.marginBottom = '5px';
                            cycleToggle.style.height = '';
                            cycleToggle.style.padding = '6px';
                            cycleToggle.style.fontSize = '15px';
                            cycleToggle.innerHTML = `▼ ${cycleDiv.getAttribute('data-name')}`;
                        }
                    });
                }
            });

            if (isOpen) {
                const cycleDivs = sectionContent.querySelectorAll('[style*="flex-direction: column"]');
                cycleDivs.forEach(cycleDiv => {
                    const cycleToggle = cycleDiv.querySelector('button');
                    const cycleContent = cycleDiv.querySelector('div');
                    if (cycleToggle && cycleContent) {
                        cycleContent.style.display = 'none';
                        cycleToggle.innerHTML = cycleToggle.innerHTML.replace('▲', '▼');
                    }
                });
            }
        };

        // Create cycles
        section.cycles.forEach(cycle => {
            const cycleDiv = document.createElement('div');
            cycleDiv.setAttribute('data-name', cycle.name);
            cycleDiv.style.display = 'flex';
            cycleDiv.style.flexDirection = 'column';
            cycleDiv.style.gap = '5px';
            cycleDiv.style.marginBottom = '5px';

            const cycleToggle = document.createElement('button');
            cycleToggle.innerHTML = `▼ ${cycle.name}`;
            styleCycleToggle(cycleToggle);

            const cycleContent = document.createElement('div');
            cycleContent.style.display = 'none';
            cycleContent.style.flexDirection = 'column';
            cycleContent.style.marginLeft = '15px';
            cycleContent.style.marginTop = '5px';
            cycleContent.style.gap = '3px';

            // Cycle toggle functionality
            cycleToggle.onclick = () => {
                const theme = getCurrentTheme();
                const isOpen = cycleContent.style.display !== 'none';
                cycleContent.style.display = isOpen ? 'none' : 'flex';
                cycleToggle.innerHTML = `${isOpen ? '▼' : '▲'} ${cycle.name}`;

                const allCycleDivs = Array.from(sectionContent.children);

                allCycleDivs.forEach(otherCycleDiv => {
                    const otherCycleToggle = otherCycleDiv.querySelector('button');
                    const otherCycleContent = otherCycleDiv.querySelector('div');

                    if (otherCycleToggle !== cycleToggle) {
                        if (!isOpen) {
                            otherCycleDiv.style.marginBottom = '2px';
                            otherCycleContent.style.display = 'none';
                            otherCycleToggle.style.height = '2px';
                            otherCycleToggle.style.padding = '0';
                            otherCycleToggle.style.fontSize = '0';
                            otherCycleToggle.innerHTML = '';
                            otherCycleToggle.style.backgroundColor = theme.cycleBackground;
                            otherCycleToggle.style.color = theme.cycleTextColor;
                        } else {
                            otherCycleDiv.style.marginBottom = '5px';
                            otherCycleToggle.style.height = '';
                            otherCycleToggle.style.padding = '6px';
                            otherCycleToggle.style.fontSize = '15px';
                            otherCycleToggle.innerHTML = `▼ ${otherCycleDiv.getAttribute('data-name')}`;
                        }
                    }
                });
            };

            // Create buttons
            cycle.buttons.forEach((buttonText, index) => {
                const button = document.createElement('button');
                button.innerHTML = `${index + 1}. ${buttonText}`;
                styleActionButton(button);

                button.onclick = (e) => {
                    e.stopPropagation();
                    const configKey = section.title === 'SSD Cycles'
                        ? cycle.name
                        : `${section.title.split(' ')[0]}_${cycle.name}`;

                    const config = cycleConfigurations[configKey];

                    if (config) {
                        switch(buttonText) {
                            case 'General Info: Text':
                                fillAllTextFields(config);
                                break;
                            case 'General Info: Dropdowns':
                                fillAllDropdowns(config);
                                break;
                            case 'Volume Mappings':
                                fillVolumeMappings(config);
                                break;
                            case 'Labour Mappings':
                                fillLabourMappings(config);
                                break;
                        }
                    } else {
                        console.error(`Configuration not found for ${configKey}`);
                    }
                };

                cycleContent.appendChild(button);
            });

            cycleDiv.appendChild(cycleToggle);
            cycleDiv.appendChild(cycleContent);
            sectionContent.appendChild(cycleDiv);
        });

        sectionDiv.appendChild(sectionToggle);
        sectionDiv.appendChild(sectionContent);
        contentContainer.appendChild(sectionDiv);
    });

    // Add components to container in order
    container.appendChild(themeSelector);  // Add theme selector first
    container.appendChild(dragHandle);
    container.appendChild(mainToggle);
    container.appendChild(contentContainer);
    document.body.appendChild(container);
}






    // Initialize UI when page loads
    window.addEventListener('load', createUI);
})();