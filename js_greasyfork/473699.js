function getReact() {
    return new Promise((resolve) => {
        const defineProperty = Object.defineProperty;
        Object.defineProperty = function () {
            defineProperty.apply(this, arguments);
            const prop = arguments[1];
            const descriptor = arguments[2];
            if (descriptor.get && descriptor.get.a) {
                if ("createElement" in descriptor.get.a) {
                    Object.defineProperty = defineProperty;
                    resolve(descriptor.get.a);
                }
            }
        }
    });
}