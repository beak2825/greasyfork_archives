class OsuWebObserver {
    constructor(staticFn, dynamicFn) {
        this.static = staticFn;
        this.dynamic = dynamicFn;
        this.static();
        const pageType = this.getType();
        if (pageType === "dynamic") {
            const firstLoad = new MutationObserver(() => {
                this.dynamic();
                firstLoad.disconnect();
            });
            const layout = document.querySelector(".osu-layout__section")?.firstElementChild;
            if (layout != null) {
                firstLoad.observe(layout, {childList: true});
            }
        }
        this.pageObserver = new MutationObserver(this.detectPageChange);
        this.pageObserver.observe(document.documentElement, {childList: true});
    }
    
    detectPageChange = (mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeName == "BODY") {
                        this.static();
                        this.dynamic();
                        return;
                    }
                });
            }
        }
    }

    getType = () => {
        const type = location.pathname.split("/")[1];
        const dynamic = ["users", "beatmapsets", "scores"];
        if (dynamic.includes(type)) {
            return "dynamic";
        }
        return "static";
    }

    destroy = () => {
        this.pageObserver.disconnect();
    }
}